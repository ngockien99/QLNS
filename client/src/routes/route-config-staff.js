import {
  CalendarOutlined,
  FileSyncOutlined,
  IdcardOutlined,
  MoneyCollectOutlined,
  UserOutlined,
} from "@ant-design/icons";

import PhepNam from "module/phep-nam";
import Profile from "module/profile";
import Salary from "module/salary";
import StaffInformation from "module/staff-infomation";
import TotalWorkedDays from "module/total-worked-days";

const id = localStorage.getItem("user_id");
export const RoleStaff = [
  {
    title: "",
    items: [
      {
        hidden: id & 1,
        title: "Hồ sơ cá nhân",
        to: `/quan-ly-ho-so-ca-nhan/thong-tin-ca-nhan/${id}`,
        component: <StaffInformation />,
        icon: <IdcardOutlined />,
        children: [{ title: "Thông tin nhân sự" }],
      },
      {
        title: "Phép năm",
        to: "/phep-nam",
        component: <PhepNam />,
        icon: <CalendarOutlined />,
      },
      {
        title: "Lương thưởng",
        to: "/luong-thuong",
        component: <Salary />,
        icon: <MoneyCollectOutlined />,
      },
      {
        title: "Báo cáo tổng hợp công",
        to: "/bao-cao-tong-hop-cong",
        component: <TotalWorkedDays />,
        icon: <FileSyncOutlined />,
      },
      {
        title: "Thông tin tài khoản",
        to: "/thong-tin-tai-khoan",
        component: <Profile />,
        icon: <UserOutlined />,
      },
    ],
  },
];
