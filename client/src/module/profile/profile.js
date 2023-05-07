import { Avatar, Button, Card, Form, Input } from "antd";

const Profile = () => {
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
        <h2 style={{ marginTop: 1 }}>Kiên Nguyễn Ngọc</h2>
        <h4 style={{ marginTop: 1 }}>621142</h4>
      </div>
      <Form>
        <Form.Item
          name="password"
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
            <Input.Password name="password" />
          </div>
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "10px",
          }}
        >
          <Button htmlType="submit">Cập nhật</Button>
        </div>
      </Form>
    </Card>
  );
};

export default Profile;
