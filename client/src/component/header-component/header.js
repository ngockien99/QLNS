import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { isEmpty } from "lodash";
import { memo, useCallback, useState } from "react";

const Header = memo(
  ({
    onClick,
    content,
    noButton = false,
    hiddenFilter = false,
    children,
    buttonComponent = null,
  }) => {
    const [showFilter, setShowFilter] = useState(false);
    const onFilter = useCallback(() => setShowFilter((pre) => !pre), []);
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
          <div style={{ display: "flex", gap: 16 }}>
            {!isEmpty(buttonComponent) && buttonComponent}
            {!hiddenFilter && (
              <Button icon={<FilterOutlined />} onClick={onFilter}>
                Bộ lọc
              </Button>
            )}
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
        </div>
        {showFilter && children}
        <Divider style={{ margin: "12px 0" }} />
      </div>
    );
  }
);

export default Header;
