import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Table, Tag, message } from "antd";
import dayjs from "dayjs";
import { Fragment, useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { GET_REQUEST_LIST } from "util/const";
import FormVerify from "../form-verify";

const TableWorkedDays = () => {
  const userInfo = useRecoilValue(UserInfoAtom) ?? {};
  console.log(userInfo?.user);
  const { name = "kiennn" } = userInfo?.user ?? {};
  const queryClient = useQueryClient();
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
        const newData = data.my_request.map((e) => {
          return { ...e, name };
        });
        setData(newData);
      },
    }
  );

  const { mutate } = useMutation(
    (id) => {
      const config = {
        url: "request/delete",
        data: { id },
        method: "delete",
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_REQUEST_LIST);
        message.success("Bạn đã xoá báo cáo duyệt công thành công!");
      },
      onError: (error) => {
        message.error(error);
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
    data.disabled = true;
    modalRef?.current?.setValue(data);
    modalRef.current.show();
  }, []);
  const editModal = useCallback((data) => {
    const { date, time_ot_start = "", time_ot_end = "", type } = data;
    data.date = dayjs(date, "YYYY-MM-DD");
    if (type === 1) {
      data.time_ot_start = dayjs(time_ot_start, '"HH:mm"');
      data.time_ot_end = dayjs(time_ot_end, "HH:mm");
    }
    data.isEdit = true;
    data.disabled = false;
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
        <Row gutter={8}>
          <Col span="auto">
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
      <Table columns={columns} dataSource={data} />
      <FormVerify ref={modalRef} />
    </Fragment>
  );
};

export default TableWorkedDays;
