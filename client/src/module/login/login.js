import { HomeTwoTone, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, message } from "antd";
import banner from "assets/image/quy-trinh-cham-cong-1.jpg";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { Navigate } from "react-router";
import { useSetRecoilState } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { TOKEN_JWT } from "util/const";
import { useCheckRole } from "util/custom-hook";

const Login = () => {
  const token = localStorage.getItem(TOKEN_JWT);
  const setUseInfo = useSetRecoilState(UserInfoAtom);
  const [id, setId] = useState("");
  const role = useCheckRole();

  const { mutate } = useMutation(
    (formValue) => {
      const config = {
        params: formValue,
        url: "auth/login",
        method: "post",
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        localStorage.setItem(TOKEN_JWT, data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);
        delete data.token;
        setUseInfo(data);
        setId(data.user_id);
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );
  const onSubmit = useCallback(
    (formValue) => {
      mutate(formValue);
    },
    [mutate]
  );
  if (token) {
    const redirectTo =
      role === "admin"
        ? "/dashboard"
        : `/quan-ly-ho-so-ca-nhan/thong-tin-ca-nhan/${id}`;
    return <Navigate to={redirectTo} />;
  }
  return (
    <div
      style={{
        // background: "#FF512F",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: 4,
      }}
    >
      <Image src={banner} preview={false} />
      <Form
        labelCol={{
          span: 24,
        }}
        onFinish={onSubmit}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical"
        style={{
          borderRadius: "8px",
          backgroundColor: "#FFF",
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: "32px 24px",
          marginRight: 48,
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <HomeTwoTone style={{ fontSize: 24 }} />
          <h2
            style={{
              fontWeight: 600,
              color: "#f7a306",
              padding: 0,
              margin: 0,
            }}
          >
            TRICO
          </h2>
        </div>
        <h4 style={{ marginBottom: 12 }}>
          Chào mừng bạn đến với hệ thống Quản lý nhân sự
        </h4>
        <Form.Item
          style={{ width: 300 }}
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email hoặc tên đăng nhập!!!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#f56a00" }} />}
            placeholder="Nhập email hoặc tên đăng nhập"
            style={{ borderWidth: 1.5, borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          style={{ width: 300 }}
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#f56a00" }} />}
            type="password"
            placeholder="Password"
            style={{ borderWidth: 1.5, borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          style={{
            width: 300,
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <a href="#">Quên mật khẩu?</a>
        </Form.Item>

        <Form.Item style={{ justifyItems: "center" }}>
          <Button type="primary" htmlType="submit" size="large">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
