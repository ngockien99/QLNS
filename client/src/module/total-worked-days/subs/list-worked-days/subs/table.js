import { Spin, Table } from "antd";
import { useQuery } from "react-query";
import API from "util/api";
import { useColumn } from "./custom-hook";
import "./index.css";

const TableComponent = () => {
  const { data: queryData = [], isLoading } = useQuery(
    "QUERY_TIME_SHEET",
    () => {
      const config = {
        url: "get-time-sheet",
      };
      return API.request(config);
    }
  );

  const data = [
    {
      index: "1",
      id: "HO012323",
      name: "Nguyễn Ngọc Kiên",
      department: "Techlonogy",
      date: queryData,
    },
  ];
  const columns = useColumn(queryData);
  if (isLoading) {
    return <Spin />;
  }

  return (
    <Table
      columns={columns}
      pagination={false}
      dataSource={data}
      bordered
      size="small"
    />
  );
};

export default TableComponent;
