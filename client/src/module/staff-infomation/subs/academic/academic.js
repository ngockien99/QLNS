import { Button, Table } from "antd";
import { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import UpdateAcademic from "../update-form/update-academic";

const Salary = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { academic = {}, user } = userInfo ?? {};
  const data = [{ academic, id: user?.id, name: user?.name }];
  const modalRef = useRef();
  const showModal = useCallback(() => modalRef.current.show());

  const columns = [
    {
      title: "MNV",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên Trường",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trình độ",
      dataIndex: "rank",
      key: "rank",
      render: (_, record) => {
        const { rank } = record;
        if (rank === 1) {
          return "Trung cấp";
        } else if (rank === 2) {
          return "Cao đẳng";
        } else {
          return "Đại học";
        }
      },
    },
    {
      title: "Vị trí hiện tại",
      dataIndex: "specialized",
      key: "specialized",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1>Qúa trình đào tạo</h1>
        <Button onClick={showModal}>Edit</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
      />
      <UpdateAcademic ref={modalRef} />
    </div>
  );
};

export default Salary;
