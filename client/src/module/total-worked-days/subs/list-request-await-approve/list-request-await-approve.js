import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import dayjs from "dayjs";
import { Fragment, useCallback, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { GET_REQUEST_LIST } from "util/const";
import FormApprove from "./subs/form-approve";

const ListRequestAwaitApprove = () => {
  const userInfo = useRecoilValue(UserInfoAtom) ?? {};
  console.log(userInfo?.user);
  const { name = "kiennn" } = userInfo?.user ?? {};
  const [data, setData] = useState();
  useQuery(
    GET_REQUEST_LIST,
    () => {
      const config = {
        url: "request/list",
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        console.log(data);
        const newData = data.people_request.map((e) => {
          return { ...e, name };
        });
        setData(newData);
      },
    }
  );
  const modalRef = useRef();
  const openModal = useCallback((data) => {
    const { date, time_ot_start = "", time_ot_end = "", type } = data;
    data.date = dayjs(date, "YYYY-MM-DD");
    if (type === 1) {
      data.time_ot_start = dayjs(time_ot_start, '"HH:mm"');
      data.time_ot_end = dayjs(time_ot_end, "HH:mm");
    }
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
      title: "Thời gian",
      dataIndex: "date",
      key: "type_time",
    },
    {
      title: "Loại báo cáo",
      dataIndex: "check_paid",
      key: "start_date",
      render: (_, record) => {
        if (record.type === 0) {
          return "Nghỉ";
        }
        return "Làm thêm giờ";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "end_date",
      render: (_, record) => {
        if (record.status === 1) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Đã phê duyệt
            </Tag>
          );
        } else if (record.status === 2) {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Từ chối phê duyệt
            </Tag>
          );
        } else {
          return (
            <Tag icon={<ClockCircleOutlined />} color="processing">
              Chờ phê duyệt
            </Tag>
          );
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          style={{
            background: "#62a73b",
            color: "#fff",
            borderRadius: "4px",
          }}
          icon={<CopyOutlined />}
          onClick={() => openModal(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      <Table columns={columns} dataSource={data} />
      <FormApprove ref={modalRef} />
    </Fragment>
  );
};

export default ListRequestAwaitApprove;
