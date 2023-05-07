import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Select, Space, Table } from "antd";

const { Search } = Input;
const ManagementStaff = () => {
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
      title: "Vị trí",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phòng ban",
      dataIndex: "month",
      key: "start_date",
    },
    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Row gutter={8}>
          <Col span="auto">
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
          </Col>
          <Col span="auto">
            <Button
              style={{
                backgroundColor: "#f56a00",
                color: "#fff",
                borderRadius: "4px",
              }}
              icon={<EditOutlined />}
            >
              Sửa
            </Button>
          </Col>
          <Col span="auto">
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
          </Col>
        </Row>
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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary">Them moi</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManagementStaff;
