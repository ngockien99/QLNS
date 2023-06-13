import Header from "component/header-component/header";
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
      <Header content="Quản lý  vị trí" onClick={showModal} />
      <TableComponent />
      <FormPosition ref={modalAddRef} />
    </div>
  );
};

export default ManagementPosition;
