import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Col, Row, Table, Tag } from "antd";
import { ButtonEdit, ButtonScreen } from "component/button";
import LoadingComponent from "component/loading";
import dayjs from "dayjs";
import { Fragment, useCallback, useRef } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import API from "util/api";
import {
  EndDateKeyAtom,
  ManagerKeyAtom,
  MixKeyAtom,
  StartDateKeyAtom,
  TypeKeyAtom,
} from "../recoil";
import FormRewardDiscipline from "./form-reward-discipline";

const TableComponent = () => {
  const modalRef = useRef();
  const onEdit = useCallback((data, isEdit) => {
    data.action = isEdit ? "edit" : "screen";
    modalRef.current.show();
    modalRef.current.setValue(data);
  }, []);

  const mixKey = useRecoilValue(MixKeyAtom);
  const startDateKey = useRecoilValue(StartDateKeyAtom);
  const endDateKey = useRecoilValue(EndDateKeyAtom);
  const typeKey = useRecoilValue(TypeKeyAtom);
  const userKey = useRecoilValue(ManagerKeyAtom);

  const { isLoading, data } = useQuery(
    [
      "GET_LIST_REWARD_DISCIPLINE",
      mixKey,
      startDateKey,
      endDateKey,
      typeKey,
      userKey,
    ],
    () => {
      const config = {
        url: "reward-discipline/list",
        params: {
          date: "",
          type: typeKey,
          keyword: mixKey,
          endDate: endDateKey,
          startDateKey: startDateKey,
          user: userKey,
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
        if (type === 0) {
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
            <ButtonScreen onClick={() => onEdit(record, false)} />
          </Col>
          <Col span="auto">
            <ButtonEdit onClick={() => onEdit(record, true)} />
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
      <Table columns={columns} dataSource={data?.data} />
      <FormRewardDiscipline ref={modalRef} />
    </Fragment>
  );
};

export default TableComponent;
