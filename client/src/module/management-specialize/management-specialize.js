import Header from "component/header-component/header";
import { useCallback, useRef } from "react";
import FormSpecialize from "./subs/form-specialize";
import TableComponent from "./subs/table";

const ManagementSpecialize = () => {
  const modalAddRef = useRef();
  const showModal = useCallback(() => {
    modalAddRef.current.show();
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Header
        content="Quản lý vị trí chuyên môn"
        onClick={showModal}
        hiddenFilter
      />
      <TableComponent />
      <FormSpecialize ref={modalAddRef} />
    </div>
  );
};

export default ManagementSpecialize;
