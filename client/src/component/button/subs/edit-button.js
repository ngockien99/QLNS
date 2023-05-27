import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { memo } from "react";

const EditButton = memo(({ onClick }) => {
  return (
    <Button
      style={{
        backgroundColor: "#f56a00",
        color: "#fff",
        borderRadius: "4px",
      }}
      icon={<EditOutlined />}
      onClick={onClick}
    >
      Sửa
    </Button>
  );
});

export default EditButton;
