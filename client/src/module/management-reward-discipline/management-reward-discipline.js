import { Button, DatePicker, Divider, Input, Select, Space } from "antd";
import { useCallback, useRef } from "react";
import FormRewardDiscipline from "./subs/form-reward-discipline";
import TableComponent from "./subs/table";

const { Search } = Input;

const ManagementRewardAndDiscipline = () => {
  const modalRef = useRef();
  const openModal = useCallback(() => {
    modalRef.current.show();
  }, []);
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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={openModal}>
          Them moi
        </Button>
      </div>
      <TableComponent />
      <FormRewardDiscipline ref={modalRef} />
    </div>
  );
};

export default ManagementRewardAndDiscipline;
