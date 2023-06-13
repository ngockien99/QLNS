import Header from "component/header-component/header";
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
      <Header content="Quản lý cấp bậc" onClick={showModal} />
      <TableComponent />
      <FormLevel ref={modalAddRef} />
    </div>
  );
};

export default ManagementLevel;
