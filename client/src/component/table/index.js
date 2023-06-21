import { Table } from "antd";

const TableComponent = (props) => {
  const {
    columns = [],
    dataSource = [],
    bordered = true,
    pageSize = 5,
    size = "medium",
  } = props;
  return (
    <Table
      columns={columns}
      size={size}
      dataSource={dataSource}
      bordered={bordered}
      pagination={{ pageSize: pageSize }}
    />
  );
};

export default TableComponent;
