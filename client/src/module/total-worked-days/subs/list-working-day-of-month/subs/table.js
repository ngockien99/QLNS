import { PlusOutlined } from "@ant-design/icons";
import { Button, Spin, Table } from "antd";
import dayjs from "dayjs";
import { Fragment, useCallback, useRef } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { GET_TIME_SHEET } from "util/const";
import FormVerify from "../../form-verify/form-verify";

const TableComponent = () => {
  const modalRef = useRef();
  const { data: queryData = [], isLoading } = useQuery(GET_TIME_SHEET, () => {
    const config = {
      url: "get-time-sheet",
    };
    return API.request(config);
  });

  const userInfo = useRecoilValue(UserInfoAtom);
  const { name } = userInfo?.user ?? {};

  const data = queryData.map((e) => {
    return { ...e, name };
  });

  const showModal = useCallback((data) => {
    const { date, type, time_ot_end, time_ot_start } = data;
    data.date = dayjs(date, "DD-MM-YYYY");
    if (type === 1) {
      data.time_ot_start = dayjs(time_ot_start, "HH:mm");
      data.time_ot_end = dayjs(time_ot_end, "HH:mm");
    }
    data.isEdit = false;
    modalRef.current.show();
    console.log(data);
    modalRef.current.setValue(data);
  }, []);

  console.log(data);
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày làm việc",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Giờ vào",
      dataIndex: "checkin",
      key: "checkin",
    },
    {
      title: "Giờ về",
      dataIndex: "checkout",
      key: "checkout",
    },
    {
      title: "Thời gian làm việc",
      dataIndex: "work_day",
      key: "type_time",
      render: (_, record) => {
        const { checkin, checkout, work_day } = record;
        console.log(work_day, checkin, checkout);
        if (!checkin || !checkout) {
          return 0;
        }
        return work_day * 8;
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const { checkin, checkout, work_day } = record;
        if (!checkin || !checkout || work_day * 8 < 8) {
          return "NLVKHL";
        }
        return "";
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        if (!record.checkin || !record.checkout || record.work_day * 8 < 8) {
          return (
            <Button
              style={{
                backgroundColor: "#f56a00",
                color: "#fff",
                borderRadius: "4px",
              }}
              icon={<PlusOutlined />}
              onClick={() => showModal(record)}
            >
              Thêm báo cáo
            </Button>
          );
        }
        return null;
      },
    },
  ];

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Fragment>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        bordered
      />
      <FormVerify ref={modalRef} />
    </Fragment>
  );
};

export default TableComponent;
