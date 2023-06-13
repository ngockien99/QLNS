import { Col, Image, Row } from "antd";
import helloImage from "assets/image/hello.png";
import LoadingComponent from "component/loading";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import CardComponent from "./subs/card";
import ChartPie from "./subs/chart-pie";
import TableComponent from "./subs/table";
import TotalStaff from "./subs/total-staff";

const Home = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { name } = userInfo?.user ?? {};
  const { data, isLoading } = useQuery("GET_DATA_DASHBOARD", () => {
    const config = {
      url: "dashboard",
    };
    return API.request(config);
  });
  const topDepartment = useMemo(() => {
    return data?.percent_department
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [data?.percent_department]);

  const chartPie = useMemo(() => {
    return data?.percent_department.map((e) => {
      return {
        name: e.name,
        y: Number(e.percent),
        sliced: true,
        selected: true,
      };
    });
  }, [data?.percent_department]);

  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <div
      style={{ backgroundColor: "#ccc", padding: 12, gap: 16, height: "100%" }}
    >
      <Row gutter={16} style={{ padding: "12px 8pxs" }}>
        <Col span={18}>
          <Row
            style={{
              background: "#ed213a",
              borderRadius: 8,
              padding: "12px 24px",
              gap: 8,
              marginBottom: 16,
            }}
            align="middle"
          >
            <Col>
              <Image src={helloImage} preview={false} width={90} />
            </Col>
            <Col style={{ color: "#fff" }}>
              <Row style={{ fontSize: 16 }}>Xin chào {name}.</Row>
              <Row>Bạn đang xem tổng quan về nhân sự công ty Trico.</Row>
            </Col>
          </Row>
          <CardComponent data={data?.count_user} />
        </Col>
        <Col span={6}>
          <TotalStaff total={data?.count_user?.total} data={topDepartment} />
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} gutter={16}>
        <Col span={12} style={{ borderRadius: 8, overflow: "hidden" }}>
          <ChartPie data={chartPie} />
        </Col>
        <Col span={12}>
          <TableComponent data={data?.user_late} />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
