import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Row, Spin, Table } from "antd";
import { Fragment, useCallback, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import API from "util/api";

import dayjs from "dayjs";
import FormPayrol from "./form-payroll";
import FormScreenPayroll from "./form-screen-payroll";

const TableComponent = () => {
  const { data = {}, isLoading } = useQuery("GET_LIST_PAYROLL", () => {
    const config = {
      url: "payroll/list",
    };
    return API.request(config);
  });
  const userList = useRecoilValue(ListUserAtom);

  const modalEditRef = useRef();
  const modalScreenPayrollRef = useRef();

  const onEdit = useCallback((data) => {
    data.action = "edit";
    modalEditRef.current.show();
    modalEditRef.current.setValue(data);
  }, []);

  const onScreen = useCallback((data) => {
    modalScreenPayrollRef.current.show();
    modalScreenPayrollRef.current.setValue(data);
  }, []);

  const dataSource = useMemo(() => {
    return data?.data?.map((e) => {
      return { ...e.user, ...e.salary, ...e.payroll, user_id: e.user?.id };
    });
  }, [data?.data]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Tên người lao động",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (_, record) => {
        const { user_id } = record;
        const name = userList?.find((e) => e.value === user_id);
        if (!name) {
          return;
        }
        return name.label;
      },
    },
    {
      title: "Tháng",
      dataIndex: "month_pay",
      key: "month_pay",
      width: "30%",
      render: (_, record) => {
        const { month_pay } = record;
        return dayjs(month_pay, "YYYY-MM").format("MM/YYYY");
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: "35%",
      render: (_, record) => (
        <Row gutter={8}>
          <Col span="auto">
            <Button
              style={{
                background: "#62a73b",
                color: "#fff",
                borderRadius: "4px",
              }}
              icon={<CopyOutlined />}
              onClick={() => onScreen(record)}
            >
              Xem chi tiết
            </Button>
          </Col>
          <Col span="auto">
            <Button
              style={{
                backgroundColor: "#f56a00",
                color: "#fff",
                borderRadius: "4px",
              }}
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Sửa
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  if (isLoading) {
    return <Spin />;
  }
  return (
    <Fragment>
      <Table
        columns={columns}
        size="small"
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
      <FormPayrol ref={modalEditRef} />
      <FormScreenPayroll ref={modalScreenPayrollRef} />
    </Fragment>
  );
};

export default TableComponent;
