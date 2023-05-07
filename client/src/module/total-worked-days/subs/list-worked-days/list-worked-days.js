import { Space } from "antd";
import TableComponent from "./subs/table";

const ListWorkedDays = () => {
  return (
    <Space direction="vertical" style={{ padding: "12px 24px", width: "100%" }}>
      <h3>Danh sách công</h3>
      <TableComponent />
    </Space>
  );
};

export default ListWorkedDays;
