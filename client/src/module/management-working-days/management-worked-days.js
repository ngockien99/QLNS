import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";

const { Search } = Input;

const ManagementWorkedDays = () => {
  const columns = [
    {
      title: "Mã Nhân Viên",
      dataIndex: "id",
      key: "id",
      with: "100%",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tháng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày đi làm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày nghỉ",
      dataIndex: "month",
      key: "start_date",
    },
    {
      title: "Số giờ làm",
      dataIndex: "month",
      key: "start_date",
    },
    {
      title: "Số giờ làm thêm",
      dataIndex: "month",
      key: "start_date",
    },
    {
      title: "Trạng thái",
      dataIndex: "month",
      key: "start_date",
      render: () => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã được duyệt
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Button
          style={{
            background: "#62a73b",
            color: "#fff",
            borderRadius: "4px",
          }}
          icon={<CopyOutlined />}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const data = [
    {
      id: "HO012032",
      name: "Nguyễn Ngọc Kiên",
      month: "12/2021",
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Search
          placeholder="Tìm kiếm..."
          enterButton
          style={{ maxWidth: "30%" }}
        />
        <Space>
          <DatePicker />
          <Select
            placeholder="Tìm kiếm theo phòng ban..."
            options={[
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
            ]}
          />
          <Select
            placeholder="Tìm kiếm theo vị trí công việc..."
            options={[
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
              { label: "Phòng Công Nghệ", value: "Phòng Công Nghệ" },
            ]}
          />
        </Space>
      </div>
      <Divider />

      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManagementWorkedDays;
