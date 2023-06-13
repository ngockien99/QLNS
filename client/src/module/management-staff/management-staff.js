import Header from "component/header-component/header";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import TableComponent from "./subs/table";

const ManagementStaff = () => {
  const navigate = useNavigate();
  const onCreateStaff = useCallback(
    () => navigate("/them-thong-tin-nhan-su"),
    [navigate]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Header content="Quản lý nhân sự" onClick={onCreateStaff} />
      <TableComponent />
    </div>
  );
};

export default ManagementStaff;
