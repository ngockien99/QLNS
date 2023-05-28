import {
  Col,
  DatePicker,
  Form,
  Modal,
  Radio,
  Row,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  LisLevelAtom,
  ListDepartmentAtom,
  ListPositionAtom,
  ListSpecializedAtom,
  ListUserAtom,
  UserInfoAtom,
} from "state-management/recoil";
import API from "util/api";
import { GET_STAFF_INFO } from "util/const";

const UpdateFormStaff = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [userInfo, setUserInfo] = useRecoilState(UserInfoAtom);

  const {
    work_status,
    start_work,
    end_work,
    level_id,
    department_id,
    position_id,
    specialize_id,
    manager_id,
  } = userInfo?.user || {};
  const queryClient = useQueryClient();
  const params = useParams();
  const { id } = params;

  const specialize_list = useRecoilValue(ListSpecializedAtom);
  const level_list = useRecoilValue(LisLevelAtom);
  const position_list = useRecoilValue(ListPositionAtom);
  const manager_list = useRecoilValue(ListUserAtom);
  const department_list = useRecoilValue(ListDepartmentAtom);

  const { mutate } = useMutation(
    (data) => {
      const config = {
        url: "user/update",
        method: "put",
        data: { ...userInfo?.user, ...userInfo?.salary, ...data },
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([id, GET_STAFF_INFO]);
        message.success("Bạn đã cập nhật thông tin thành công!");
        setOpen(false);
      },
      onError: (error) => {
        message.error(error.message);
      },
    }
  );
  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        values.end_work = dayjs(values?.end_work || "").format("YYYY-MM-DD");
        values.start_work = dayjs(values?.start_work || "").format(
          "YYYY-MM-DD"
        );
        mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, mutate]);

  useImperativeHandle(ref, () => ({
    show: () => {
      setOpen(true);
    },
  }));

  const data = useMemo(() => {
    return [
      {
        title: "Trạng thái làm việc",
        value: work_status,
        type: "radio",
        key: "work_status",
      },
      {
        title: "Ngày bắt đầu công việc",
        value: dayjs(start_work || "2021-12-06", "YYYY-MM-DD"),
        type: "date",
        key: "start_work",
      },
      {
        title: "Ngày nghỉ việc",
        value: dayjs(end_work || "2023-03-02", "YYYY-MM-DD"),
        type: "date",
        key: "end_work",
      },
      {
        title: "Quản lý",
        value: manager_id,
        type: "select",
        key: "manager_id",
        option: manager_list,
      },
      {
        title: "Vị trí",
        value: position_id,
        type: "select",
        key: "position_id",
        option: position_list,
      },
      {
        title: "Chuyên môn",
        value: specialize_id,
        type: "select",
        key: "specialize_id",
        option: specialize_list,
      },
      {
        title: "Phòng ban",
        value: department_id,
        type: "select",
        key: "department_id",
        option: department_list,
      },
      {
        title: "Chức vụ",
        value: level_id,
        type: "select",
        key: "level_id",
        option: level_list,
      },
    ];
  }, [
    department_id,
    department_list,
    end_work,
    level_id,
    level_list,
    manager_id,
    manager_list,
    position_id,
    position_list,
    specialize_id,
    specialize_list,
    start_work,
    work_status,
  ]);

  useEffect(() => {
    data.forEach((e) => {
      return form.setFields([{ name: e.key, value: e.value }]);
    });
  }, [data, form]);

  return (
    <Modal
      open={open}
      title="Sửa thông tin nhân viên"
      okText="Sửa"
      cancelText="Huỷ"
      onCancel={() => setOpen(false)}
      onOk={onFinish}
    >
      <Form
        form={form}
        name="update-info-staff-in-life"
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, value: initValue, type, key, option } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title}>
                  {type === "radio" ? (
                    <Radio.Group defaultValue={initValue}>
                      <Radio value={0}> Nhân viên đã nghỉ việc </Radio>
                      <Radio value={1}> Nhân viên đang làm việc </Radio>
                    </Radio.Group>
                  ) : type === "select" ? (
                    <Select
                      name={key}
                      options={option}
                      //   defaultValue={initValue}
                    />
                  ) : (
                    <DatePicker
                      name={key}
                      placeholder="Vui lòng chọn ngày..."
                      format="DD/MM/YYYY"
                    />
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
});

export default UpdateFormStaff;
