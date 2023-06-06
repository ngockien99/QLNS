import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  TimePicker,
  message,
} from "antd";

import { Fragment, forwardRef, useImperativeHandle, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import API from "util/api";
import { GET_REQUEST_LIST } from "util/const";

const { TextArea } = Input;

const FormVerify = forwardRef((_, ref) => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(false);
  const [value, setValue] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState("");
  const queryClient = useQueryClient();

  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      setData(value);
      setValue(value.type);
    },
  }));

  const onChange = (e) => {
    setValue(e.target.value);
    form.resetFields();
  };

  const { mutate: approveMutate } = useMutation(
    () => {
      const config = {
        url: "request/approve",
        data: { id: data?.id },
        method: "put",
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_REQUEST_LIST);
        message.success("Bạn đã duyệt công thành công!");
        setShow(false);
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  const { mutate: rejectMutate } = useMutation(
    () => {
      const config = {
        url: "request/reject",
        data: { id: data?.id },
        method: "put",
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_REQUEST_LIST);
        message.success("Bạn đã từ chối duyệt công thành công!");
        setShow(false);
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  return (
    <Modal open={show} title="Form duyệt công" footer={null}>
      <Fragment>
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal-approve"
          disabled
          initialValues={data}
        >
          <Form.Item name="type" label="Loại báo cáo:">
            <Radio.Group defaultValue={value} disabled={isEdit}>
              <Radio onChange={onChange} value={0}>
                Nghỉ Phép
              </Radio>
              <Radio onChange={onChange} value={1}>
                Làm Thêm Giờ
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Space>
            <Form.Item
              name="date"
              label="Ngày:"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày...!",
                },
              ]}
            >
              <DatePicker
                name="date"
                placeholder="Vui lòng chọn ngày..."
                format={"YYYY-MM-DD"}
              />
            </Form.Item>

            {value === 1 && (
              <Space>
                <Form.Item
                  name="time_ot_start"
                  label="Giờ bắt đầu:"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giờ bắt đầu...!",
                    },
                  ]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item
                  name="time_ot_end"
                  label="Giờ kết thúc:"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giờ kết thúc...!",
                    },
                  ]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Space>
            )}
          </Space>
          {value === 1 && (
            <Form.Item
              name="title"
              label="Tiêu đề mail:"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giờ kết thúc...!",
                },
              ]}
            >
              <TextArea placeholder="Vui lòng nhập tiêu đề..." />
            </Form.Item>
          )}

          {value === 0 && (
            <Fragment>
              <Form.Item name="time_leave" label="Thời gian">
                <Select
                  options={[
                    { label: "Buổi sáng", value: 0 },
                    { label: "Buổi chiều", value: 1 },
                    { label: "Cả ngày", value: 2 },
                  ]}
                />
              </Form.Item>
              <Form.Item name="reason" label="Lý do">
                <Select
                  options={[
                    { label: "Nghỉ phép(được tính lương)", value: "Nghỉ phép" },
                    {
                      label: "Làm việc từ xa(được tính lương)",
                      value: "Làm việc từ xa",
                    },
                    { label: "Nghỉ ốm", value: "Nghỉ ốm" },
                    { label: "Nghỉ bù", value: "Nghỉ bù" },
                    {
                      label: "Xin đi muộn/về sớm",
                      value: "Xin đi muộn/về sớm",
                    },
                  ]}
                />
              </Form.Item>
            </Fragment>
          )}
        </Form>
        <div style={{ display: "flex", gap: 4 }}>
          <Button
            onClick={() => {
              setShow(false);
              setValue(0);
            }}
          >
            Huỷ
          </Button>
          <Button onClick={() => approveMutate()}>Xác nhận</Button>
          <Button onClick={() => rejectMutate()}> Từ chối phê duyệt</Button>
        </div>
      </Fragment>
    </Modal>
  );
});

export default FormVerify;
