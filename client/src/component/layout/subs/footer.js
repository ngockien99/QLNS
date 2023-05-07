import { Layout } from "antd";
import React from "react";
import "./layout.css";

const { Footer } = Layout;
const FooterComponent = () => {
  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Web Quản lý nhân sự ©2023 Created by Kiên_Dev_iMedia
      </Footer>
    </>
  );
};

export default React.memo(FooterComponent);
