import Home from "module/home";
import Login from "module/login";
import Main from "module/main";
import ManagementLevel from "module/management-level";
import ManagementPosition from "module/management-position";
import ManagementSpecialize from "module/management-specialize";
import { Route, Routes } from "react-router-dom";
import ManagementRewardAndDiscipline from "./module/management-reward-discipline";
import ManagementStaff from "./module/management-staff";
import ManagementWorkedDays from "./module/management-working-days";

import PhepNam from "./module/phep-nam";
import Profile from "./module/profile";
import Salary from "./module/salary";
import StaffInformation, {
  ThongTinCaNhan,
  ThongTinLamViec,
} from "./module/staff-infomation";
import TotalWorkedDays, { ListWorkedDays } from "./module/total-worked-days";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/danh-sach-cong" element={<ListWorkedDays />} />
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="/quan-ly-nhan-su" element={<ManagementStaff />} />
        <Route path="/quan-ly-vi-tri" element={<ManagementPosition />} />
        <Route path="/quan-ly-chuyen-mon" element={<ManagementSpecialize />} />
        <Route path="/quan-ly-cap-bac" element={<ManagementLevel />} />
        <Route
          path="/quan-ly-khen-thuong-ky-luat"
          element={<ManagementRewardAndDiscipline />}
        />
        <Route path="/quan-ly-cong" element={<ManagementWorkedDays />} />
        <Route path="/phep-nam" element={<PhepNam />} />
        <Route path="/quan-ly-ho-so-ca-nhan" element={<StaffInformation />}>
          <Route
            path="thong-tin-ca-nhan/:id"
            index
            element={<ThongTinCaNhan />}
          />
          <Route path="thong-tin-lam-viec/:id" element={<ThongTinLamViec />} />
        </Route>
        <Route path="/luong-thuong" element={<Salary />} />
        <Route path="/bao-cao-tong-hop-cong" element={<TotalWorkedDays />} />
        <Route path="/thong-tin-tai-khoan" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
