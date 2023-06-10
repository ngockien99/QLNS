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
import dayjs from "dayjs";

import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import API from "util/api";
import { GET_REQUEST_LIST } from "util/const";

const { TextArea } = Input;

const FormVerify = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState(undefined);
  const [id, setId] = useState("");
  const queryClient = useQueryClient();
  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      setData(value);
      setIsEdit(!!value?.isEdit);
      setDisable(!!value?.disabled);
      setId(value?.id);
      setValue(value?.type || 0);
    },
  }));
  const title = useMemo(
    () => (disable ? "Xem báo cáo" : isEdit ? "Sửa báo cáo" : "Thêm báo cáo"),
    [disable, isEdit]
  );
  const onChange = (e) => {
    setValue(e.target.value);
    form.resetFields();
  };

  console.log(value);

  const { mutate, isLoading } = useMutation(
    (data) => {
      const method = isEdit ? "put" : "post";
      const url = isEdit ? "request/update" : "request/create";
      data.id = id;
      const config = {
        url,
        data,
        method,
      };

      return API.request(config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(GET_REQUEST_LIST);
        message.success("Bạn đã gửi duyệt công thành công!");
        !!isEdit && form.resetFields();
        setShow(false);
        setIsEdit(false);
        setId("");
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  const onSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        console.log("kienn", values);
        values.type = value;
        const params =
          value === 1
            ? {
                time_ot_start: dayjs(values?.time_ot_start).format("HH:mm"),
                time_ot_end: dayjs(values?.time_ot_end).format("HH:mm"),
                date: dayjs(values?.date).format("YYYY-MM-DD"),
              }
            : {
                date: !isEdit
                  ? [
                      dayjs(values?.date_start).format("YYYY-MM-DD"),
                      dayjs(values?.date_end).format("YYYY-MM-DD"),
                    ]
                  : dayjs(values?.date).format("YYYY-MM-DD"),
              };

        mutate({ ...values, ...params });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, isEdit, mutate, value]);

  useEffect(() => {
    if (data) {
      Object.entries(data).map(([formKey, value]) => {
        return form.setFields([{ name: formKey, value: value }]);
      });
    }
  }, [data, form, value]);

  return (
    <Modal
      open={show}
      title={title}
      onCancel={() => {
        setShow(false);
        form.resetFields();
        setIsEdit(false);
        setId("");
        setDisable(false);
        setData(undefined);
      }}
      onOk={onSubmit}
      footer={
        !disable && (
          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
            <Button
              disabled={isLoading}
              onClick={() => {
                setShow(false);
                form.resetFields();
                setIsEdit(false);
                setId("");
                setDisable(false);
                setData(undefined);
              }}
            >
              Huỷ
            </Button>
            <Button type="primary" onClick={onSubmit} loading={isLoading}>
              Xác nhận
            </Button>
          </div>
        )
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        disabled={disable}
      >
        <Form.Item name="type" label="Loại báo cáo:">
          <Radio.Group defaultValue={value} disabled={isEdit || disable}>
            <Radio onChange={onChange} value={0}>
              Nghỉ Phép
            </Radio>
            <Radio onChange={onChange} value={1}>
              Làm Thêm Giờ
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Space>
          {(isEdit || disable || value === 1) && (
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
          )}
          {!isEdit && !disable && value !== 1 && (
            <Space>
              <Form.Item
                name="date_start"
                label="Ngày bắt đầu:"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày bắt đầu...!",
                  },
                ]}
              >
                <DatePicker
                  name="date_start"
                  placeholder="Vui lòng chọn ngày bắt đầu..."
                  format={"YYYY-MM-DD"}
                />
              </Form.Item>
              <Form.Item
                name="date_end"
                label="Ngày kết thúc:"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày kết thúc...!",
                  },
                ]}
              >
                <DatePicker
                  name="date_end"
                  placeholder="Vui lòng chọn ngày kết thúc..."
                  format={"YYYY-MM-DD"}
                />
              </Form.Item>
            </Space>
          )}
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
                  { label: "Xin đi muộn/về sớm", value: "Xin đi muộn/về sớm" },
                ]}
              />
            </Form.Item>
          </Fragment>
        )}
      </Form>
    </Modal>
  );
});

export default FormVerify;
