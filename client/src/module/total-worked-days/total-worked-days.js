import { Divider, Space } from "antd";
import Action from "./subs/action";
import TableWorkedDays from "./subs/table-worked-day";

const TotalWorkedDays = () => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Action />
      <Divider />
      <TableWorkedDays />
    </Space>
  );
};

export default TotalWorkedDays;
