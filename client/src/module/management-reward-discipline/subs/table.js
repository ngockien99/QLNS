import {
  CheckCircleOutlined,
  CopyOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Table, Tag } from "antd";
import dayjs from "dayjs";
import { Fragment, useCallback, useRef } from "react";
import { useQuery } from "react-query";
import API from "util/api";
import FormRewardDiscipline from "./form-reward-discipline";

const TableComponent = () => {
  const modalRef = useRef();
  const onEdit = useCallback((data, isEdit) => {
    data.action = isEdit ? "edit" : "screen";
    modalRef.current.show();
    modalRef.current.setValue(data);
  }, []);

  const { data } = useQuery(
    "GET_LIST_REWARD_DISCIPLINE",
    () => {
      const config = {
        url: "reward-discipline/list",
        params: {
          date: "",
          type: "",
          page: 1,
        },
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      with: "100%",
    },
    {
      title: "Họ và tên",
      dataIndex: "user_name",
      key: "name",
    },
    {
      title: "Ngày ra quyết định",
      dataIndex: "date",
      key: "date",
      render: (_, record) => {
        const { date } = record;
        return dayjs(date, "YYYY-MM-DD").format("DD/MM/YYYY");
      },
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (_, record) => {
        const { type } = record;
        if (type == 0) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Khen thưởng
            </Tag>
          );
        }
        return (
          <Tag icon={<WarningOutlined />} color="error">
            Kỷ luật
          </Tag>
        );
      },
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
              onClick={() => onEdit(record, false)}
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
              onClick={() => onEdit(record, true)}
            >
              Sửa
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Fragment>
      <Table columns={columns} dataSource={data?.data} />
      <FormRewardDiscipline ref={modalRef} />
    </Fragment>
  );
};

export default TableComponent;
