import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Table, message } from "antd";
import { Fragment, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import API from "util/api";
import FormSpecialize from "./form-specialize";

const TableComponent = () => {
  const { data = [] } = useQuery("QUERY_SPECIALIZE_LIST", () => {
    const config = {
      url: "specialize/list",
    };
    return API.request(config);
  });

  const queryClient = useQueryClient();

  const modalEditRef = useRef();
  const editModal = useCallback((data) => {
    modalEditRef.current.show();
    modalEditRef.current.setValue(data);
  }, []);

  const { mutate } = useMutation(
    (data) => {
      const { id } = data;
      const config = {
        url: "specialize/delete",
        method: "delete",
        data: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (_, variable) => {
        const { name } = variable;
        message.success(`Bạn đã xoá vị trí chuyên môn ${name} thành công`);
        queryClient.invalidateQueries("QUERY_SPECIALIZE_LIST");
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  const confirm = useCallback(
    (data) => {
      mutate(data);
    },
    [mutate]
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Tên vị trí chuyên môn",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "start_date",
      width: "30%",
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
            <Popconfirm
              description={`Bạn có chắc chắn muốn xoá vị trí chuyên môn ${record?.name}?`}
              onConfirm={() => confirm(record)}
              okText="Có, tôi chắc chắn"
              cancelText="Không"
            >
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
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];
  return (
    <Fragment>
      <Table
        columns={columns}
        size="small"
        dataSource={data?.data}
        pagination={{ pageSize: 5 }}
      />
      <FormSpecialize ref={modalEditRef} />
    </Fragment>
  );
};

export default TableComponent;
