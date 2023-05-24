import { Button, Table } from "antd";
import { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import UpdateFormSalary from "../update-form/update-form-salary";

const Salary = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { salary, user } = userInfo ?? {};
  const modalRef = useRef();
  const showModal = useCallback(() => {
    modalRef.current.show();
  }, []);
  const data = [{ ...salary, id: user?.id, name: user?.name }];

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
      title: "Lương cơ bản",
      dataIndex: "salary_basic",
      key: "salary_basic",
    },
    {
      title: "Thưởng kinh doanh",
      dataIndex: "allowance_money",
      key: "allowance_money",
    },
    {
      title: "Tiền đóng BHXH",
      dataIndex: "insurance_premium_salary",
      key: "insurance_premium_salary",
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
        <h1>Thông tin nhân sự</h1>
        <Button onClick={showModal}>Edit</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
      />
      <UpdateFormSalary ref={modalRef} />
    </div>
  );
};

export default Salary;
