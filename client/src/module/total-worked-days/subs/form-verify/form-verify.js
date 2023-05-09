import {
  DatePicker,
  Form,
  Modal,
  Radio,
  Select,
  Space,
  TimePicker,
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
import { useMutation } from "react-query";
import API from "util/api";

const FormVerify = forwardRef(({ data = "" }, ref) => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(false);
  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      form.setFieldValue(value);
    },
  }));
  const title = useMemo(() => (data ? "Sửa báo cáo" : "Thêm báo cáo"), [data]);
  const [value, setValue] = useState(0);
  const onChange = (e) => {
    setValue(e.target.value);
    form.resetFields();
  };

  const { mutate } = useMutation((data) => {
    const { date } = data;
    const newData = { date: dayjs(date).format("YYYY-MM-DD") };
    const config = {
      url: "request/create",
      data: { ...data, ...newData },
      method: "post",
    };
    console.log(config);
    return API.request(config);
  });

  const onSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, mutate]);

  return (
    <Modal
      open={show}
      title={title}
      okText="Xác nhận"
      cancelText="Huỷ"
      onCancel={() => {
        setShow(false);
        form.resetFields();
      }}
      onOk={onSubmit}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="type" label="Loại báo cáo:">
          <Radio.Group defaultValue={value}>
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

        {value === 0 && (
          <Fragment>
            <Form.Item name="time_leave" label="Thời gian">
              <Select
                options={[
                  { label: "Buổi sáng", value: 3.5 },
                  { label: "Buổi chiều", value: 4.5 },
                  { label: "Cả ngày", value: 8 },
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
