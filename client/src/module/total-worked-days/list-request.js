import { Space } from "antd";
import Header from "component/header-component/header";
import { useCallback, useRef } from "react";
import FormVerify from "./subs/form-verify/form-verify";
import TableWorkedDays from "./subs/table-worked-day";
import FilterComponent from "./subs/table-worked-day/subs/filter";

const ListRequest = () => {
  const modalRef = useRef();
  const showModal = useCallback(() => modalRef.current.show(), []);
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Header content="Báo cáo tổng hợp công" onClick={showModal}>
        <FilterComponent />
      </Header>
      <TableWorkedDays />
      <FormVerify ref={modalRef} />
    </Space>
  );
};

export default ListRequest;
