import { Col, Row, message } from "antd";
import { ButtonDelete, ButtonEdit } from "component/button";
import Table from "component/table";
import { Fragment, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import API from "util/api";
import { GET_LIST_LEVEL, QUERY_LEVEL_LIST } from "util/const";
import FormLevel from "./form-level";

const TableComponent = () => {
  const { data = [] } = useQuery(GET_LIST_LEVEL, () => {
    const config = {
      url: "level/list",
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
        url: "level/delete",
        method: "delete",
        data: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (_, variable) => {
        const { name } = variable;
        message.success(`Bạn đã xoá cấp bậc ${name} thành công`);
        queryClient.invalidateQueries(GET_LIST_LEVEL);
        queryClient.invalidateQueries(QUERY_LEVEL_LIST);
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
      title: "Tên cấp bậc",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "start_date",
      width: "20%",
    },
    {
      title: "Hệ số lương",
      dataIndex: "salary_factor",
      key: "salary_factor",
      width: "20%",
    },
    {
      title: "Hành động",
      key: "action",
      width: "30%",
      render: (_, record) => (
        <Row gutter={8}>
          <Col span="auto">
            <ButtonEdit onClick={() => editModal(record)} />
          </Col>
          <Col span="auto">
            <ButtonDelete
              description={`Bạn có chắc chắn muốn xoá cấp bậc ${record?.name}?`}
              onConfirm={() => confirm(record)}
            />
          </Col>
        </Row>
      ),
    },
  ];
  return (
    <Fragment>
      <Table columns={columns} size="small" dataSource={data?.data} />
      <FormLevel ref={modalEditRef} />
    </Fragment>
  );
};

export default TableComponent;
