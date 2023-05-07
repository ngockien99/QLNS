import { Menu } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, Outlet, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";

const StaffInformation = () => {
  const [route, setRoute] = useState("thong-tin-ca-nhan");
  const onClick = (e) => {
    setRoute(e.key);
  };
  const setUserInfo = useSetRecoilState(UserInfoAtom);
  const params = useParams();
  const { id } = params;

  useQuery(
    [id, "QUERY_STAFF_INFO"],
    () => {
      const config = {
        url: `/user/detail`,
        params: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        console.log(data);
        setUserInfo(data);
      },
      onError: (error) => {
        console.log(error);
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
