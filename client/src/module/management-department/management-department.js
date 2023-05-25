import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useCallback, useRef } from "react";
import FormDepartment from "./subs/form-department";
import TableComponent from "./subs/table";

const ManagementDepartment = () => {
  const modalAddRef = useRef();
  const showModal = useCallback(() => {
    modalAddRef.current.show();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Quản lý phòng ban</h3>
        <Button
          onClick={showModal}
          type="primary"
          style={{ backgroundColor: "#09aeae" }}
          icon={<PlusOutlined />}
        >
          Thêm
        </Button>
      </div>
      <TableComponent />
      <FormDepartment ref={modalAddRef} />
    </div>
  );
};

export default ManagementDepartment;
