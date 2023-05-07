// import FooterComponent from './footer'
import { Layout } from "antd";
import React, { useState } from "react";
import HeaderComponent from "./subs/header";
import "./subs/layout.css";
import NavBar from "./subs/nav-bar";

const LayoutComponent = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { Content } = Layout;
  const handleMenu = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout className="site-layout" style={{ minHeight: "100vh" }}>
      <HeaderComponent click={handleMenu} />
      <Layout className="site-layout">
        <NavBar collapsed={collapsed} />
        <Content style={{ margin: "8px 16px 0 16px", minHeight: "100%" }}>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              borderRadius: "8px",
              maxWidth: "100vw",
              maxHeight: "100vh",
              minHeight: "100%",
              boxShadow:
                " 0 1px 3px 0 rgba(0, 0, 0, 0.06),0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            }}
          >
            {props.children}
          </div>
        </Content>
      </Layout>
      {/* <FooterComponent /> */}
    </Layout>
  );
};

export default React.memo(LayoutComponent);
