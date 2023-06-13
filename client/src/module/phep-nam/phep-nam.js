import { Table } from "antd";
import Header from "component/header-component/header";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";

const PhepNam = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { leave, user } = userInfo ?? {};
  const dataSource = [{ ...leave, id: user?.id, name: user?.name }];
  console.log("kienn", dataSource, userInfo);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Header content="Bảng nghỉ phép năm" noButton />
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
      />
    </div>
  );
};

export default PhepNam;
