import Header from "component/header-component/header";
import { useCallback, useRef } from "react";
import FilterComponent from "./subs/filter";
import FormRewardDiscipline from "./subs/form-reward-discipline";
import TableComponent from "./subs/table";

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
      <Header content="Quản lý khen thưởng kỷ luật" onClick={openModal}>
        <FilterComponent />
      </Header>
      <TableComponent />
      <FormRewardDiscipline ref={modalRef} />
    </div>
  );
};

export default ManagementRewardAndDiscipline;
