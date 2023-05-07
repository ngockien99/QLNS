import { Table } from "antd";

const PhepNam = () => {
  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phép còn dư từ năm trước",
      dataIndex: "phep_con_thua",
      key: "phep_con_thua",
    },

    {
      title: "Phép chưa sử dụng",
      dataIndex: "phep_chua_su_dung",
      key: "phep_chua_su_dung",
    },
    {
      title: "Phép đã dùng ở thời điểm hiện tại",
      dataIndex: "phep_da_dung_o_thoi_diem_hien_tai",
      key: "phep_da_dung_o_thoi_diem_hien_tai",
    },
    {
      title: "Phép được sử dụng ở thời điểm hiện tại",
      dataIndex: "phep_duoc_dung_o_thoi_diem_hien_tai",
      key: "phep_duoc_dung_o_thoi_diem_hien_tai",
    },
    {
      title: "Phép đã sử dụng",
      dataIndex: "phep_da_su_dung",
      key: "phep_da_su_dung",
    },
  ];

  const data = [
    {
      id: "HO020202",
      name: "Nguyễn Ngọc Kiên",
      phep_con_thua: "12",
      phep_chua_su_dung: "24",
      phep_da_dung_o_thoi_diem_hien_tai: "0",
      phep_duoc_dung_o_thoi_diem_hien_tai: "16",
      phep_da_su_dung: "0",
    },
  ];
  return (
    <Table columns={columns} dataSource={data} bordered pagination={false} />
  );
};

export default PhepNam;
