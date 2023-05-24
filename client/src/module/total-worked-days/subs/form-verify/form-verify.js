import {
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
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import API from "util/api";

const { TextArea } = Input;

const FormVerify = forwardRef((_, ref) => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(false);
  const [value, setValue] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");
  const queryClient = useQueryClient();
  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      Object.entries(value).map(([formKey, value]) => {
        return form.setFields([{ name: formKey, value: value }]);
      });
      setIsEdit(!!value?.isEdit);
      setId(value?.id);
      setValue(value?.type);
    },
  }));
  const title = useMemo(
    () => (isEdit ? "Sửa báo cáo" : "Thêm báo cáo"),
    [isEdit]
  );
  const onChange = (e) => {
    setValue(e.target.value);
    form.resetFields();
  };

  const { mutate } = useMutation(
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
        queryClient.invalidateQueries("QUERY_REQUEST");
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
        values.type = value;
        const params =
          value === 1
            ? {
                time_ot_start: dayjs(values?.time_ot_start).format("HH:mm"),
                time_ot_end: dayjs(values?.time_ot_end).format("HH:mm"),
                date: dayjs(values?.date).format("YYYY-MM-DD"),
              }
            : { date: dayjs(values?.date).format("YYYY-MM-DD") };

        mutate({ ...values, ...params });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, mutate, value]);

  return (
    <Modal
      open={show}
      title={title}
      okText="Xác nhận"
      cancelText="Huỷ"
      onCancel={() => {
        setShow(false);
        form.resetFields();
        setIsEdit(false);
        setId("");
      }}
      onOk={onSubmit}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
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
