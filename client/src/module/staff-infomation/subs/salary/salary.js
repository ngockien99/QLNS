import { Button, Table } from "antd";
import { useCallback, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import { ROLE } from "util/const";
import UpdateFormSalary from "../update-form/update-form-salary";

const Salary = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { salary, user } = userInfo ?? {};
  const modalRef = useRef();
  const showModal = useCallback(() => {
    modalRef.current.show();
  }, []);
  const data = [{ ...salary, name: user?.name }];
  const showEditButton = useMemo(() => (ROLE === "admin" ? true : false), []);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hệ số lương",
      dataIndex: "salary_factor",
      key: "salary_factor",
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
        {showEditButton && <Button onClick={showModal}>Chỉnh sửa</Button>}
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
