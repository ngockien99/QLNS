import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useCallback, useRef } from "react";
import FormLevel from "./subs/form-level";
import TableComponent from "./subs/table";

const ManagementLevel = () => {
  const modalAddRef = useRef();
  const showModal = useCallback(() => {
    modalAddRef.current.show();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Quản lý cấp bậc</h3>
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
      <FormLevel ref={modalAddRef} />
    </div>
  );
};

export default ManagementLevel;
