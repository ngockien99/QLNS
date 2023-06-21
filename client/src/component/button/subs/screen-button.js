import { CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";

const ScreenButton = (props) => {
  const {
    onClick,
    icon = <CopyOutlined />,
    type = "button",
    style,
    textButton = "Xem chi tiết",
  } = props;
  return (
    <Button
      onClick={onClick}
      icon={icon}
      type={type}
      style={{
        background: "#62a73b",
        color: "#fff",
        borderRadius: "4px",
        ...style,
      }}
    >
      {textButton}
    </Button>
  );
};

export default ScreenButton;
