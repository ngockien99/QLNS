import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { memo } from "react";

const EditButton = memo((props) => {
  const { onClick, icon = <EditOutlined />, textButton = "Sửa", style } = props;
  return (
    <Button
      style={{
        backgroundColor: "#f56a00",
        color: "#fff",
        borderRadius: "4px",
        ...style,
      }}
      icon={icon}
      onClick={onClick}
    >
      {textButton}
    </Button>
  );
});

export default EditButton;
