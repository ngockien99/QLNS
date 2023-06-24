import Header from "component/header-component/header";
import { useCallback, useRef } from "react";
import ButtonCreateAll from "./subs/button-create-all-payroll";
import FilterComponent from "./subs/filter";
import FormPayroll from "./subs/form-payroll";
import TableComponent from "./subs/table";

const ManagementPayroll = () => {
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
      <Header
        content="Quản lý bảng lương"
        onClick={openModal}
        buttonComponent={<ButtonCreateAll />}
      >
        <FilterComponent />
      </Header>
      <TableComponent />
      <FormPayroll ref={modalRef} />
    </div>
  );
};

export default ManagementPayroll;
