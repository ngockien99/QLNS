import { Menu } from "antd";
import { useCallback, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";

const StaffInformation = () => {
  const [route, setRoute] = useState("danh-sach-cong-trong-thang");
  const onClick = useCallback((e) => {
    setRoute(e.key);
  }, []);

  const userInfo = useRecoilValue(UserInfoAtom);
  const { check_manager } = userInfo ?? {};
  const items = [
    {
      label: (
        <Link to="danh-sach-cong-trong-thang">Danh sách công trong tháng</Link>
      ),
      key: "danh-sach-cong-trong-thang",
    },
    {
      label: <Link to="bao-cao-tong-hop-cong">Báo cáo tổng hợp công</Link>,
      key: "bao-cao-tong-hop-cong",
    },
  ];

  if (check_manager) {
    items.push({
      label: (
        <Link to="danh-sach-bao-cao-cho-duyet">
          Danh sách báo cáo chờ duyệt
        </Link>
      ),
      key: "danh-sach-bao-cao-cho-duyet",
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Menu
        onClick={onClick}
        selectedKeys={[route]}
        mode="horizontal"
        items={items}
      />
      <Outlet />
    </div>
  );
};

export default StaffInformation;
