import { Button, Table } from "antd";
import { ActiveUserInfoAtom } from "module/staff-infomation/recoil";
import { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import { ROLE } from "util/const";
import UpdateAcademic from "../update-form/update-academic";

const Salary = () => {
  const activeUserInfo = useRecoilValue(ActiveUserInfoAtom);
  const showEditButton = ROLE === "admin" ? true : false;
  const { academic = {}, user } = activeUserInfo ?? {};
  const data = [{ ...academic, staff_name: user?.name }];
  const modalRef = useRef();
  const showModal = useCallback(() => modalRef.current.show(), []);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      with: "10%",
    },
    {
      title: "Họ và tên",
      dataIndex: "staff_name",
      key: "staff_name",
      with: "15%",
    },
    {
      title: "Tên Trường",
      dataIndex: "name",
      key: "name",
      with: "20%",
    },
    {
      title: "Trình độ",
      dataIndex: "rank",
      key: "rank",
      with: "15%",
      render: (_, record) => {
        const { rank } = record;
        if (rank === 1) {
          return "Trung cấp";
        } else if (rank === 2) {
          return "Cao đẳng";
        } else if (rank === 3) {
          return "Đại học";
        } else {
          return "Cao học";
        }
      },
    },

    {
      title: "Ngành học",
      dataIndex: "specialized",
      key: "specialized",
      with: "40%",
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
        <h1>Quá trình đào tạo</h1>
        {showEditButton && <Button onClick={showModal}>Chỉnh sửa</Button>}
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
