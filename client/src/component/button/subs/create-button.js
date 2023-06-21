import { Button } from "antd";

const CreateButton = (props) => {
  const { children, onClick, icon, type = "button", style } = props;
  return (
    <Button onClick={onClick} icon={icon} type={type} style={style}>
      {children}
    </Button>
  );
};

export default CreateButton;
