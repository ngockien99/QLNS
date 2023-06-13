import { Route, Routes } from "react-router-dom";

import Home from "module/home";
import Login from "module/login";
import Main from "module/main";

import ManagementContract from "module/management-contract/management-contract";
import ManagementDepartment from "module/management-department/management-department";
import ManagementLevel from "module/management-level";
import ManagementPosition from "module/management-position";
import ManagementSpecialize from "module/management-specialize";
import ManagementRewardAndDiscipline from "./module/management-reward-discipline";
import ManagementStaff from "./module/management-staff";

import CheckInCheckOut from "module/checkin-checkout/checkin-checkout";
import { FormCreate, FormEdit } from "module/form-staff";
import ManagementPayroll from "module/management-payroll/management-payroll";
import NotFound from "module/not-found/not-found";
import PhepNam from "./module/phep-nam";
import Profile from "./module/profile";
import Salary from "./module/salary";
import StaffInformation, {
  Academi,
  SalaryInfo,
  StaffInfoInLife,
  StaffInfoInWork,
} from "./module/staff-infomation";
import TotalWorkedDays, {
  ListRequest,
  ListRequestAwaitApprove,
  ListWorkedDays,
  ListWorkingDayOfMonth,
} from "./module/total-worked-days";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/danh-sach-cong" element={<ListWorkedDays />} />
      <Route path="/" element={<Main />}>
        <Route index path="/dashboard" element={<Home />} />
        <Route path="/quan-ly-nhan-su" element={<ManagementStaff />} />
        <Route path="/quan-ly-hop-dong" element={<ManagementContract />} />
        <Route path="/quan-ly-phong-ban" element={<ManagementDepartment />} />
        <Route path="/quan-ly-vi-tri" element={<ManagementPosition />} />
        <Route path="/quan-ly-chuyen-mon" element={<ManagementSpecialize />} />
        <Route path="/quan-ly-cap-bac" element={<ManagementLevel />} />
        <Route path="/quan-ly-bang-luong" element={<ManagementPayroll />} />
        <Route
          path="/quan-ly-khen-thuong-ky-luat"
          element={<ManagementRewardAndDiscipline />}
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/phep-nam" element={<PhepNam />} />
        <Route path="/cham-cong" element={<CheckInCheckOut />} />
        <Route path="/them-thong-tin-nhan-su" element={<FormCreate />} />
        <Route path="/chinh-sua-thong-tin-nhan-su/:id" element={<FormEdit />} />
        <Route path="/quan-ly-ho-so-ca-nhan" element={<StaffInformation />}>
          <Route
            path="thong-tin-ca-nhan/:id"
            index
            element={<StaffInfoInLife />}
          />
          <Route path="thong-tin-lam-viec/:id" element={<StaffInfoInWork />} />
          <Route path="thong-tin-luong-thuong/:id" element={<SalaryInfo />} />
          <Route path="qua-trinh-dao-tao/:id" element={<Academi />} />
        </Route>
        <Route path="/luong-thuong" element={<Salary />} />
        <Route path="/bao-cao-tong-hop-cong" element={<TotalWorkedDays />}>
          <Route
            path="danh-sach-cong-trong-thang"
            element={<ListWorkingDayOfMonth />}
          />
          <Route path="bao-cao-tong-hop-cong" element={<ListRequest />} />
          <Route
            path="danh-sach-bao-cao-cho-duyet"
            element={<ListRequestAwaitApprove />}
          />
        </Route>
        <Route path="/thong-tin-tai-khoan" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
