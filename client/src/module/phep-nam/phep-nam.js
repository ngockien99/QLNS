import { Table } from "antd";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";

const PhepNam = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { leave, user } = userInfo ?? {};
  const dataSource = [{ ...leave, id: user?.id, name: user?.name }];
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
      dataIndex: "leave_used_pay",
      key: "phep_con_thua",
    },
    {
      title: "Tổng phép được sử dụng trong năm",
      dataIndex: "total_leave",
      key: "total_leave",
    },
    {
      title: "Phép đã sử dụng",
      dataIndex: "leave_used",
      key: "leave_used",
    },
    {
      title: "Phép chưa sử dụng",
      dataIndex: "leave_remaining",
      key: "leave_remaining",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
    />
  );
};

export default PhepNam;
