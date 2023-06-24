import { Layout, Menu } from "antd";
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { getRoutes } from "routes/routes-setup";
import { useCheckRole } from "util/custom-hook";

const NavBar = (props) => {
  const { collapsed } = props;
  const { Sider } = Layout;
  const { pathname } = useLocation();
  const role = useCheckRole();

  const routes = getRoutes(role);
  const rootRoutes = useMemo(() => {
    if (
      pathname.includes("/quan-ly-ho-so-ca-nhan") ||
      pathname.includes("/bao-cao-tong-hop-cong")
    ) {
      return pathname.slice(0, 22);
    }

    return pathname;
  }, [pathname]);

  return (
    <Sider
      collapsed={collapsed}
      width={240}
      style={{
        background: "#fff",
        borderRadius: "8px",
        margin: "8px",
        boxShadow:
          " 0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <Menu
        theme="light"
        defaultSelectedKeys={pathname || "/dashboard"}
        defaultOpenKeys="home"
        mode="inline"
        style={{
          borderRadius: "8px",
        }}
      >
        {routes.map((e) => {
          return (
            <Menu.Item
              key={e.to}
              icon={e.icon}
              title={e.title}
              style={
                e.to.includes(rootRoutes) && {
                  background: "#FF512F",
                  color: "#fff",
                  fontSize: 15,
                }
              }
            >
              <Link to={e.to}>{e.title}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default React.memo(NavBar);
