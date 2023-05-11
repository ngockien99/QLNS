import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useCallback, useRef } from "react";
import FormPosition from "./subs/form-position";
import TableComponent from "./subs/table";

const ManagementPosition = () => {
  const modalAddRef = useRef();
  const showModal = useCallback(() => {
    modalAddRef.current.show();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Quản lý vị trí</h3>
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
      <FormPosition ref={modalAddRef} />
    </div>
  );
};

export default ManagementPosition;
