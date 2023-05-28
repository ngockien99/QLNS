import { Menu } from "antd";
import { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";

const StaffInformation = () => {
  const [route, setRoute] = useState("thong-tin-ca-nhan");
  const onClick = (e) => {
    setRoute(e.key);
  };

  const params = useParams();
  const { id } = params;

  const items = [
    {
      label: <Link to={`thong-tin-ca-nhan/${id}`}>Thông tin cá nhân</Link>,
      key: "thong-tin-ca-nhan",
    },
    {
      label: <Link to={`thong-tin-lam-viec/${id}`}>Thông tin làm việc</Link>,
      key: "thong-tin-lam-viec",
    },
    {
      label: (
        <Link to={`thong-tin-luong-thuong/${id}`}>Thông tin tiền lương</Link>
      ),
      key: "tien-luong",
    },
    {
      label: <Link to={`qua-trinh-dao-tao/${id}`}>Quá trình đào tạo</Link>,
      key: "qua-trinh-dao-tao",
    },
  ];

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
