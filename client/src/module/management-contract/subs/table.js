import { Col, Row } from "antd";
import { ButtonEdit, ButtonScreen } from "component/button";
import LoadingComponent from "component/loading";
import Table from "component/table";
import { Fragment, useCallback, useRef } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import API from "util/api";
import { GET_LIST_CONTACT } from "util/const";
import {
  EndDateKeyAtom,
  ManagerKeyAtom,
  MixKeyAtom,
  StartDateKeyAtom,
  TypeKeyAtom,
} from "../recoil";
import FormContract from "./form-contract";

const TableComponent = () => {
  const userList = useRecoilValue(ListUserAtom);
  const mixKey = useRecoilValue(MixKeyAtom);
  const startDateKey = useRecoilValue(StartDateKeyAtom);
  const endDateKey = useRecoilValue(EndDateKeyAtom);
  const typeKey = useRecoilValue(TypeKeyAtom);
  const userKey = useRecoilValue(ManagerKeyAtom);

  const { data = {}, isLoading } = useQuery(
    [GET_LIST_CONTACT, mixKey, startDateKey, endDateKey, typeKey, userKey],
    () => {
      const config = {
        url: "contract/list",
        params: {
          type_of_contract: typeKey,
          start_end_work: "",
          start_date: startDateKey,
          end_date: endDateKey,
          user: userKey,
          keyword: mixKey,
        },
      };
      return API.request(config);
    }
  );

  const modalEditRef = useRef();
  const editModal = useCallback((data) => {
    modalEditRef.current.show();
    modalEditRef.current.setValue(data);
  }, []);

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
              <ButtonScreen />
            </Link>
          </Col>
          <Col span="auto">
            <ButtonEdit onClick={() => editModal(record)} />
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
      <FormContract ref={modalEditRef} />
    </Fragment>
  );
};

export default TableComponent;
