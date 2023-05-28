import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Table, message } from "antd";
import { Fragment, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import API from "util/api";
import { GET_LIST_STAFF } from "util/const";
import ModalCreateStaff from "./form-create-staff";

const TableComponent = () => {
  const navigate = useNavigate();

  const navigateToInfo = useCallback(
    (id) => navigate(`/quan-ly-ho-so-ca-nhan/thong-tin-ca-nhan/${id}`),
    [navigate]
  );

  const modalRef = useRef();
  const showModal = useCallback((value) => {
    modalRef.current.show();
    modalRef.current.setValue(value);
  }, []);
  const queryClient = useQueryClient();
  const { data: queryData } = useQuery(GET_LIST_STAFF, () => {
    const config = {
      url: "user/list",
    };
    return API.request(config);
  });

  const { mutate } = useMutation(
    (id) => {
      const config = {
        url: "user/delete",
        data: { id },
        method: "delete",
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_LIST_STAFF);
        message.success("Bạn đã xoá nhân viên thành công!");
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  const columns = [
    {
      title: "Mã Nhân Viên",
      dataIndex: "id",
      key: "id",
      with: "100%",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vị trí",
      dataIndex: "position_id",
      key: "position_id",
    },
    {
      title: "Phòng ban",
      dataIndex: "department_id",
      key: "department_id",
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
              onClick={() => navigateToInfo(record.id)}
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
              onClick={() => showModal(record)}
            >
              Sửa
            </Button>
          </Col>
          <Col span="auto">
            <Popconfirm
              description={`Bạn có chắc chắn muốn xoá báo cáo này không}?`}
              onConfirm={() => mutate(record.id)}
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
      <Table columns={columns} dataSource={queryData?.data} bordered />
      <ModalCreateStaff ref={modalRef} />
    </Fragment>
  );
};

export default TableComponent;
