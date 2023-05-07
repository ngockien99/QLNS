import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Row, Table } from "antd";
import { Fragment, useCallback, useRef } from "react";
import FormVerify from "../form-verify";

const TableWorkedDays = () => {
  const modalRef = useRef();
  const openModal = useCallback(() => modalRef.current.show(), []);
  const editModal = useCallback((data) => {
    modalRef.current.show();
    modalRef?.current?.setValue(data);
  }, []);
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Thời gian",
      dataIndex: "type_time",
      key: "type_time",
    },
    {
      title: "Hành động",
      key: "action",
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
              onClick={openModal}
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
              onClick={() => editModal(record)}
            >
              Sửa
            </Button>
          </Col>
          <Col span="auto">
            <Button
              type="primary"
              danger
              style={{
                borderRadius: "4px",
              }}
              icon={<DeleteOutlined />}
            >
              Xoá
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  const data = [
    {
      name: "Nguyễn Ngọc Kiên",
      start_date: "12/02/2021",
      end_date: "12/02/2021",
      type_time: "Buổi chiều",
    },
  ];
  return (
    <Fragment>
      <Table columns={columns} dataSource={data} />
      <FormVerify ref={modalRef} />
    </Fragment>
  );
};

export default TableWorkedDays;
