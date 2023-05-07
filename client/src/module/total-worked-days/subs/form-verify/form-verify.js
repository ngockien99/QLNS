import { DatePicker, Form, Modal, Select, Space } from "antd";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

const FormVerify = forwardRef(({ data = "" }, ref) => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setShow(true);
      },
      setValue: (value) => {
        form.setFieldValue(value);
      },
    }),
    [form]
  );
  const title = useMemo(
    () => (data ? "Sửa duyệt công" : "Thêm duyệt công"),
    [data]
  );

  return (
    <Modal
      open={show}
      title={title}
      okText="Xác nhận"
      cancelText="Huỷ"
      onCancel={() => setShow(false)}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Space>
          <Form.Item
            name="start_date"
            label="Ngày bắt đầu"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Ngày kết thúc"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
        </Space>
        <Form.Item name="time" label="Thời gian">
          <Select
            options={[
              { label: "Buổi sáng", value: "Buổi sáng" },
              { label: "Buổi chiều", value: "Buổi chiều" },
              { label: "Cả ngày", value: "Cả ngày" },
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
      </Form>
    </Modal>
  );
});

export default FormVerify;
