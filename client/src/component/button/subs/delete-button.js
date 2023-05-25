import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

const DeleteButton = ({ description, onConfirm }) => {
  return (
    <Popconfirm
      description={description}
      onConfirm={onConfirm}
      okText="Có, tôi chắc chắn"
      cancelText="Không"
    >
      <Button
        type="primary"
        danger
        style={{
          borderRadius: "4px",
        }}
        icon={<DeleteOutlined />}
      >
        Xoá
      </Button>
    </Popconfirm>
  );
};

export default DeleteButton;
