import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Table, message } from "antd";
import { Fragment, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import API from "util/api";
import { GET_LIST_CONTACT } from "util/const";
import FormContract from "./form-contract";

const TableComponent = () => {
  const { data = {} } = useQuery(GET_LIST_CONTACT, () => {
    const config = {
      url: "contract/list",
      params: { type_of_contract: "", start_end_work: "" },
    };
    return API.request(config);
  });
  const userList = useRecoilValue(ListUserAtom);

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
        url: "contract/delete",
        method: "delete",
        data: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (_, variable) => {
        const { name } = variable;
        message.success(`Bạn đã xoá vị trí ${name} thành công`);
        queryClient.invalidateQueries(GET_LIST_CONTACT);
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
      title: "Loại hợp đồng",
      dataIndex: "type_of_contract",
      key: "type_of_contract",
      width: "30%",
    },
    {
      title: "Hành động",
      key: "action",
      width: "35%",
      render: (_, record) => (
        <Row gutter={8}>
          <Col span="auto">
            <Link
              to={record.file}
              download={true}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                style={{
                  background: "#62a73b",
                  color: "#fff",
                  borderRadius: "4px",
                }}
                icon={<CopyOutlined />}
              >
                Xem chi tiết
              </Button>
            </Link>
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
            <Popconfirm
              description={`Bạn có chắc chắn muốn xoá vị trí ${record?.name}?`}
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
      <FormContract ref={modalEditRef} />
    </Fragment>
  );
};

export default TableComponent;
