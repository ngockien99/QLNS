import { Button, Divider, Input, Select, Space } from "antd";
import { useCallback, useRef } from "react";
import FormCreateStaff from "./subs/form-create-staff";
import TableComponent from "./subs/table";

const { Search } = Input;
const ManagementStaff = () => {
  const modalRef = useRef();

  const onToggle = useCallback(() => modalRef.current.show(), []);

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
        <Button type="primary" onClick={onToggle}>
          Thêm
        </Button>
      </div>
      <TableComponent />
      <FormCreateStaff ref={modalRef} />
    </div>
  );
};

export default ManagementStaff;
