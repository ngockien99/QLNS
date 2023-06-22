import { Col, Row, Table, message } from "antd";
import { ButtonDelete, ButtonEdit } from "component/button";
import LoadingComponent from "component/loading";
import { Fragment, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import API from "util/api";
import { GET_LIST_DEPARTMENT, QUERY_DEPARTMENT_LIST } from "util/const";
import { useDebounce } from "util/custom-hook";
import { ManagerKeyAtom, MixKeyAtom, TypeKeyAtom } from "../recoil";
import FormDepartment from "./form-department";

const TableComponent = () => {
  const mixKey = useRecoilValue(MixKeyAtom);
  const typeKey = useRecoilValue(TypeKeyAtom);
  const userKey = useRecoilValue(ManagerKeyAtom);

  const keyword = useDebounce(mixKey);
  const { data = [], isLoading } = useQuery(
    [GET_LIST_DEPARTMENT, keyword, typeKey, userKey],
    () => {
      const config = {
        url: "department/list",
        params: {
          status: 1,
          keyword: keyword,
          type: typeKey,
          manager: userKey,
        },
      };
      return API.request(config);
    }
  );

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
        url: "department/delete",
        method: "delete",
        data: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (_, variable) => {
        const { name } = variable;
        message.success(`Bạn đã xoá phòng ban ${name} thành công`);
        queryClient.invalidateQueries(GET_LIST_DEPARTMENT);
        queryClient.invalidateQueries(QUERY_DEPARTMENT_LIST);
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
      title: "Tên vị trí",
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
            <ButtonEdit onClick={() => editModal(record)} />
          </Col>
          <Col span="auto">
            <ButtonDelete
              description={`Bạn có chắc chắn muốn xoá phòng ban ${record?.name}?`}
              onConfirm={() => confirm(record)}
            />
          </Col>
        </Row>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Fragment>
      <Table columns={columns} size="small" dataSource={data?.data} />
      <FormDepartment ref={modalEditRef} />
    </Fragment>
  );
};

export default TableComponent;
