import {
  BookOutlined,
  BuildOutlined,
  ClusterOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  HomeOutlined,
  TableOutlined,
  TagOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import Home from "module/home";
import ManagementContract from "module/management-contract/management-contract";
import ManagementDepartment from "module/management-department/management-department";
import ManagementLevel from "module/management-level";
import ManagementPayroll from "module/management-payroll/management-payroll";
import ManagementPosition from "module/management-position";
import ManagementRewardAndDiscipline from "module/management-reward-discipline";
import ManagementSpecialize from "module/management-specialize";
import ManagementStaff from "module/management-staff";

export const RoleAdmin = [
  {
    title: "",
    items: [
      {
        title: "Trang chủ",
        to: "/dashboard",
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
        title: "Quản lý khen thưởng kỷ luật",
        to: "/quan-ly-khen-thuong-ky-luat",
        component: <ManagementRewardAndDiscipline />,
        icon: <BookOutlined />,
      },
      {
        title: "Quản lý bảng lương",
        to: "/quan-ly-bang-luong",
        component: <ManagementPayroll />,
        icon: <TableOutlined />,
      },
      {
        title: "Quản lý vị trí",
        to: "/quan-ly-vi-tri",
        component: <ManagementPosition />,
        icon: <DatabaseOutlined />,
      },
      {
        title: "Quản lý vị trí chuyên môn",
        to: "/quan-ly-chuyen-mon",
        component: <ManagementSpecialize />,
        icon: <TagOutlined />,
      },
      {
        title: "Quản lý hợp đồng",
        to: "/quan-ly-hop-dong",
        component: <ManagementContract />,
        icon: <ContainerOutlined />,
      },
      {
        title: "Quản lý phòng ban",
        to: "/quan-ly-phong-ban",
        component: <ManagementDepartment />,
        icon: <ClusterOutlined />,
      },
      {
        title: "Quản lý cấp bậc",
        to: "/quan-ly-cap-bac",
        component: <ManagementLevel />,
        icon: <BuildOutlined />,
      },
    ],
  },
];
