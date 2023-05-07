import { Table } from "antd";

const TableComponent = () => {
  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "index",
      width: 60,
      key: "index",
      fixed: "left",
    },
    {
      title: "Mã nhân viên",
      dataIndex: "id",
      width: 100,
      key: "id",
      fixed: "left",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      width: 100,
      key: "name",
      fixed: "left",
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      width: 60,
      key: "department",
      fixed: "left",
    },
    {
      title: "Ngày trong tháng",
      dataIndex: "date",
      key: "date",
      children: [
        {
          title: "24",
          dataIndex: "24",
          key: `date`,
          width: 100,
          children: [
            {
              title: "T7",
              dataIndex: "t7",
              key: `date1`,
              width: 120,
              children: [
                { title: "Giờ vào", dataIndex: "24", key: `date`, width: 40 },
                { title: "Giờ ra", dataIndex: "24", key: `date`, width: 40 },
                { title: "Tổng", dataIndex: "24", key: `date`, width: 40 },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Tổng hợp ngày công",
      dataIndex: "date_offer",
      key: "date_offer",
      fixed: "right",
      children: [
        {
          title: "Ngày đi làm",
          dataIndex: "24",
          key: `date`,
          width: 100,
        },
        {
          title: "Ngày nghỉ không lý do",
          dataIndex: "24",
          key: `date`,
          width: 100,
        },
        {
          title: "Tổng ngày không được tính lương",
          dataIndex: "24",
          key: `date`,
          width: 100,
        },
        {
          title: "Tổng ngày được tính lương",
          dataIndex: "24",
          key: `date`,
          width: 100,
        },
      ],
    },
  ];

  const data = [
    {
      index: "1",
      id: "HO012323",
      name: "Nguyễn Ngọc Kiên",
      department: "Techlonogy",
    },
  ];
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
