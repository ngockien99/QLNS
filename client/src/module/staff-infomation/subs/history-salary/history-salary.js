import { Table } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { ActiveUserInfoAtom } from "module/staff-infomation/recoil";
import { useRecoilValue } from "recoil";

const HistorySalary = () => {
  const activeUserInfo = useRecoilValue(ActiveUserInfoAtom);
  const { history_salary = {} } = activeUserInfo ?? {};

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      with: "10%",
    },
    {
      title: "Họ và tên",
      dataIndex: "user_id",
      key: "user_id",
      with: "15%",
    },
    {
      title: "Mức lương trước thay đổi",
      dataIndex: "salary_before",
      key: "salary_before",
      with: "20%",
    },
    {
      title: "Mức lương sau thay đổi",
      dataIndex: "salary_after",
      key: "salary_after",
      with: "15%",
    },

    {
      title: "Ngày thay đổi",
      dataIndex: "date",
      key: "date",
      with: "40%",
      render: (_, record) => {
        const { date } = record;
        if (!isEmpty(date)) {
          return dayjs(date, "YYYY-MM-DD").format("DD/MM/YYYY");
        }
        return "";
      },
    },
    {
      title: "Người ra quyết định thay đổi",
      dataIndex: "user_update",
      key: "user_update",
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
        <h1>Lịch sử thay đổi lương, thưởng</h1>
      </div>
      <Table
        columns={columns}
        dataSource={history_salary}
        pagination={false}
        bordered
        size="small"
      />
    </div>
  );
};

export default HistorySalary;
