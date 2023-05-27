import { Avatar, Button, Card, Form, Input, message } from "antd";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";

const Profile = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { name, id } = userInfo?.user ?? {};
  const [hasUpdatePassword, setHasUpdatePassword] = useState(false);
  const [form] = Form.useForm();
  const { mutate } = useMutation(
    (data) => {
      const config = { url: "staff/update", method: "put", data };
      return API.request(config);
    },
    {
      onSuccess: () => {
        message.success("Bạn đã thay đổi mật khẩu thành công!!!");
        setHasUpdatePassword(false);
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, mutate]);
  return (
    <Card
      style={{
        width: 400,
        margin: "auto",
        textAlign: "center",
        position: "relative",
        paddingTop: "5px",
      }}
    >
      <div
        style={{
          background: "#74b9ff",
          position: "absolute",
          top: 0,
          width: "100%",
          padding: "30px 0",
          left: 0,
        }}
      ></div>
      <div>
        <Avatar
          className="custom-icon"
          size={50}
          style={{
            backgroundColor: "#1890ff",
            border: "2px solid #fff",
          }}
        >
          H
        </Avatar>
        <h2 style={{ marginTop: 1 }}>{name}</h2>
        <h4 style={{ marginTop: 1 }}>{id}</h4>
      </div>
      {hasUpdatePassword ? (
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="old_password"
            label="Mật khẩu cũ:"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu !",
              },
              {
                min: 6,
                message: "Mật khẩu phải dài ít nhất 6 kí tự",
              },
            ]}
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <div style={{ marginTop: "2px" }}>
              <Input.Password name="old_password" />
            </div>
          </Form.Item>
          <Form.Item
            name="new_password"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu !",
              },
              {
                min: 6,
                message: "Mật khẩu phải dài ít nhất 6 kí tự",
              },
            ]}
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <div style={{ marginTop: "2px" }}>
              <Input.Password name="new_password" />
            </div>
          </Form.Item>
          <Form.Item
            name="retype_password"
            label="Nhập lại mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu !",
              },
              {
                min: 6,
                message: "Mật khẩu phải dài ít nhất 6 kí tự",
              },
            ]}
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <div style={{ marginTop: "2px" }}>
              <Input.Password name="retype_password" />
            </div>
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "10px",
              gap: 12,
            }}
          >
            <Button onClick={() => setHasUpdatePassword(false)}>Huỷ</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form>
      ) : (
        <Button type="primary" onClick={() => setHasUpdatePassword(true)}>
          Thay đổi mật khẩu
        </Button>
      )}
    </Card>
  );
};

export default Profile;
