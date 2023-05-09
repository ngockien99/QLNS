import {
  BookOutlined,
  HomeOutlined,
  TableOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import Home from "module/home";
import ManagementRewardAndDiscipline from "module/management-reward-discipline";
import ManagementStaff from "module/management-staff";
import ManagementWorkedDays from "module/management-working-days";

export const RoleAdmin = [
  {
    title: "",
    items: [
      {
        title: "Trang chủ",
        to: "/",
        component: <Home />,
        icon: <HomeOutlined />,
      },
      {
        title: "Quản lý nhân sự",
        to: "/quan-ly-nhan-su",
        component: <ManagementStaff />,
        icon: <TeamOutlined />,
      },
      {
        title: "Quản lý công",
        to: "/quan-ly-cong",
        component: <ManagementWorkedDays />,
        icon: <TableOutlined />,
      },
      {
        title: "Quản lý khen thưởng kỷ luật",
        to: "/quan-ly-khen-thuong-ky-luat",
        component: <ManagementRewardAndDiscipline />,
        icon: <BookOutlined />,
      },
    ],
  },
];
