import { RiseOutlined } from "@ant-design/icons";
import { Card, Col, Image, Row } from "antd";
import helloImage from "assets/image/hello.png";
import ChartPie from "./subs/chart-pie";
import TableComponent from "./subs/table";

const Home = () => {
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
              <Row style={{ fontSize: 16 }}>Xin chào Nguyễn Ngọc Kiên.</Row>
              <Row>Bạn đang xem tổng quan về nhân sự công ty HocMai.</Row>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={8}>
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  padding: 12,
                  gap: 4,
                  borderLeft: "4px solid green",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Nhân viên thử việc
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <h2>1</h2>
                  <RiseOutlined
                    style={{ fontSize: "20px" }}
                    twoToneColor={"red"}
                  />
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  padding: 12,
                  gap: 4,
                  borderLeft: "4px solid blue",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Nhân viên chính thức
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <h2>1</h2>
                  <RiseOutlined
                    style={{ fontSize: "20px" }}
                    twoToneColor={"red"}
                  />
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 4,
                  padding: 12,
                  gap: 4,
                  borderLeft: "4px solid orange",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Nhân viên nghỉ việc
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <h2>1</h2>
                  <RiseOutlined
                    style={{ fontSize: "20px" }}
                    twoToneColor={"red"}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Card title="Tổng số nhân viên">
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <h4 style={{ marginTop: 0 }}>112</h4>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: "start" }}>
                icon
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                Thử việc
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                6
              </Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: "start" }}>
                icon
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                Thử việc
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                6
              </Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: "start" }}>
                icon
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                Thử việc
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                6
              </Col>
            </Row>
            <Row>
              <Col span={8} style={{ textAlign: "start" }}>
                icon
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                Thử việc
              </Col>
              <Col span={8} style={{ textAlign: "end" }}>
                6
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} gutter={16}>
        <Col span={12} style={{ borderRadius: 8, overflow: "hidden" }}>
          <ChartPie />
        </Col>
        <Col span={12}>
          <TableComponent />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
