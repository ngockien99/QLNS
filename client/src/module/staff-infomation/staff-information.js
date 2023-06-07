import { Menu, Spin, message } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, Outlet, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import API from "util/api";
import { ActiveUserInfoAtom } from "./recoil";

const StaffInformation = () => {
  const [route, setRoute] = useState("thong-tin-ca-nhan");
  const onClick = (e) => {
    setRoute(e.key);
  };

  const setActiveUserInfo = useSetRecoilState(ActiveUserInfoAtom);
  const params = useParams();
  const { id } = params;

  const { isLoading } = useQuery(
    [id, "ACTIVE_USER_INFO"],
    () => {
      const config = {
        url: `/user/detail`,
        params: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        setActiveUserInfo(data);
      },
      onError: (error) => {
        message.error(error);
      },
      enabled: !!id,
    }
  );

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

  if (isLoading) {
    return <Spin />;
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
