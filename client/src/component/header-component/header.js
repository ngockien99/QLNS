import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { memo } from "react";

const Header = memo(({ onClick, content, noButton = false }) => {
  return (
    <div className={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>{content}</h3>
        {!noButton && (
          <Button
            onClick={onClick}
            type="primary"
            style={{ backgroundColor: "#09aeae" }}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
        )}
      </div>
      <Divider style={{ margin: "12px 0" }} />
    </div>
  );
});

export default Header;
