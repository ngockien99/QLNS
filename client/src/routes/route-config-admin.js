import {
  BookOutlined,
  HomeOutlined,
  TableOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import Home from "module/home";
import ManagementLevel from "module/management-level";
import ManagementPosition from "module/management-position";
import ManagementRewardAndDiscipline from "module/management-reward-discipline";
import ManagementSpecialize from "module/management-specialize";
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
      {
        title: "Quản lý vị trí",
        to: "/quan-ly-vi-tri",
        component: <ManagementPosition />,
        icon: <TableOutlined />,
      },
      {
        title: "Quản lý vị trí chuyên môn",
        to: "/quan-ly-chuyen-mon",
        component: <ManagementSpecialize />,
        icon: <BookOutlined />,
      },
      {
        title: "Quản lý cấp bậc",
        to: "/quan-ly-cap-bac",
        component: <ManagementLevel />,
        icon: <TableOutlined />,
      },
    ],
  },
];
