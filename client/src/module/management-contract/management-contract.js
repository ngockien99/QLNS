import Header from "component/header-component/header";
import { useCallback, useRef } from "react";
import FilterComponent from "./subs/filter";
import FormContract from "./subs/form-contract";
import TableComponent from "./subs/table";

const ManagementContract = () => {
  const modalAddRef = useRef();
  const showModal = useCallback(() => {
    modalAddRef.current.show();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Header content="Quản lý hợp đồng" onClick={showModal}>
        <FilterComponent />
      </Header>
      <TableComponent />
      <FormContract ref={modalAddRef} />
    </div>
  );
};

export default ManagementContract;
