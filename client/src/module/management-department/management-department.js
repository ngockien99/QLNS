import Header from "component/header-component/header";
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
      <Header content="Quản lý phòng ban" onClick={showModal} />
      <TableComponent />
      <FormDepartment ref={modalAddRef} />
    </div>
  );
};

export default ManagementDepartment;
