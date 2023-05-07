import { Button } from "antd";

const Index = ({
  type = "primary",
  size = "small",
  loading,
  text,
  danger,
  htmlType,
  color,
  bgColor,
}) => {
  return (
    <Button
      type={type}
      size={size}
      danger={danger}
      loading={loading}
      htmlType={htmlType}
      style={{ color: color, bgColor: bgColor }}
    >
      {text}
    </Button>
  );
};

export default Index;
