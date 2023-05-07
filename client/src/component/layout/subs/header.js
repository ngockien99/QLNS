import { MenuOutlined } from "@ant-design/icons";
import { Avatar, Col, Dropdown, Input, Layout, Menu, Row, Space } from "antd";
import logo from "assets/image/logo-sunoffice.jpg";
import PropTypes from "prop-types";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./layout.css";

const { Search } = Input;
const { Header } = Layout;

const HeaderComponent = (props) => {
  const { click } = props;
  const navigate = useNavigate();
  const role = "admin";

  const login = () => {
    navigate("/login");
    localStorage.clear();
  };
  const menu = (
    <Menu style={{ width: 220 }}>
      <Menu.Item key="0" hidden={role === "admin"}>
        <Link to="/thong-tin-tai-khoan">Hồ sơ</Link>
      </Menu.Item>
      <Menu.Divider hidden={role === "admin"} />
      <Menu.Item key="3" onClick={login}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ padding: "0 30px" }} className="site-layout-background">
      <Row width="100%">
        <Col span={8} style={{ display: "flex", alignItems: "center" }}>
          <MenuOutlined
            onClick={click}
            style={{ fontSize: "20px", marginRight: 48 }}
          />
          <img
            src={logo}
            alt="logo"
            width={120}
            height={44}
            onClick={() => navigate("/")}
          />
        </Col>
        <Col span={8} style={{ alignItems: "center", display: "flex" }}>
          <Search placeholder="Tìm kiếm..." enterButton />
        </Col>
        <Col span={8} style={{ textAlign: "right", paddingRight: "30px" }}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Space>
              <Avatar
                className="custom-icon"
                style={{
                  backgroundColor: "#00a2ae",
                }}
              >
                K
              </Avatar>
              <h5 style={{ margin: 0 }}>Nguyen Ngoc Kien</h5>
            </Space>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

HeaderComponent.propTypes = {
  click: PropTypes.func,
};

export default React.memo(HeaderComponent);
