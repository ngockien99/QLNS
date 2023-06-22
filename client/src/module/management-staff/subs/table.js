import { Col, Row, message } from "antd";
import { ButtonDelete } from "component/button";
import ButtonEdit from "component/button/subs/edit-button";
import ButtonScreen from "component/button/subs/screen-button";
import LoadingComponent from "component/loading";
import Table from "component/table";
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import { ListDepartmentAtom, ListPositionAtom } from "state-management/recoil";
import API from "util/api";
import { GET_LIST_STAFF } from "util/const";
import { useDebounce } from "util/custom-hook";
import {
  DepartmentKeyAtom,
  ManagerKeyAtom,
  MixKeyAtom,
  PositionKeyAtom,
} from "../recoil";

const TableComponent = () => {
  const navigate = useNavigate();
  const onEditInfo = useCallback(
    (id) => navigate(`/chinh-sua-thong-tin-nhan-su/${id}`),
    [navigate]
  );

  const navigateToInfo = useCallback(
    (id) => navigate(`/quan-ly-ho-so-ca-nhan/thong-tin-ca-nhan/${id}`),
    [navigate]
  );
  const mixKey = useRecoilValue(MixKeyAtom);
  const managerKey = useRecoilValue(ManagerKeyAtom);
  const departmentKey = useRecoilValue(DepartmentKeyAtom);
  const positionKey = useRecoilValue(PositionKeyAtom);

  const mixKeyword = useDebounce(mixKey);
  const managerKeyword = useDebounce(managerKey);
  const positionKeyword = useDebounce(positionKey);
  const departmentKeyword = useDebounce(departmentKey);

  const positionList = useRecoilValue(ListPositionAtom) ?? [];
  const departmentList = useRecoilValue(ListDepartmentAtom) ?? [];

  const queryClient = useQueryClient();
  const { isLoading, data: queryData } = useQuery(
    [GET_LIST_STAFF, mixKey, managerKey, departmentKey, positionKey],
    () => {
      const config = {
        url: "user/list",
        params: {
          search: "",
          page: 1,
          keyword: mixKeyword,
          manager: managerKeyword,
          department: departmentKeyword,
          position: positionKeyword,
        },
      };
      return API.request(config);
    }
  );
  console.log(queryData?.data);

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
      render: (_, record) => {
        const { position_id } = record;
        const positionName = positionList?.find((e) => e.value === position_id);
        if (positionName) {
          return positionName.label;
        }
      },
    },
    {
      title: "Phòng ban",
      dataIndex: "department_id",
      key: "department_id",
      render: (_, record) => {
        const { department_id } = record;
        const departmentName = departmentList?.find(
          (e) => e.value === department_id
        );
        if (departmentName) {
          return departmentName.label;
        }
        return;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Row gutter={8}>
          <Col span="auto">
            <ButtonScreen
              style={{
                background: "#62a73b",
                color: "#fff",
                borderRadius: "4px",
              }}
              onClick={() => navigateToInfo(record.id)}
            />
          </Col>
          <Col span="auto">
            <ButtonEdit onClick={() => onEditInfo(record.id)} />
          </Col>
          <Col span="auto">
            <ButtonDelete
              description={`Bạn có chắc chắn muốn xoá nhân viên ${record.name} này không?`}
              onConfirm={() => mutate(record.id)}
            />
          </Col>
        </Row>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingComponent />;
  }

  return <Table columns={columns} dataSource={queryData?.data} />;
};

export default TableComponent;
