import { Form, Input, Modal, Select, Table } from "antd";
import { forwardRef, useImperativeHandle, useMemo, useState } from "react";

const WorkedDaysApprove = forwardRef(({ data = "" }, ref) => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setShow(true);
      },
    }),
    []
  );
  const title = useMemo(
    () => (data ? "Sửa duyệt công" : "Thêm duyệt công"),
    [data]
  );

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Thời gian",
      dataIndex: "type_time",
      key: "type_time",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
  ];

  const dataSource = [
    {
      name: "Nguyễn Ngọc Kiên",
      start_date: "12/02/2021",
      end_date: "12/02/2021",
      type_time: "Buổi chiều",
      reason: "Nghỉ phép năm",
    },
  ];
  return (
    <Modal
      open={show}
      title={title}
      okText="Gửi duyệt công"
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
        <Form.Item
          name="title"
          label="Chủ đề"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="target_member" label="Người duyệt công">
          <Select options={[{ label: "Lê Ngọc Hà", value: "Lê Ngọc Hà" }]} />
        </Form.Item>
        <Form.Item
          name="modifier"
          className="collection-create-form_last-form-item"
        >
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            size="small"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default WorkedDaysApprove;
