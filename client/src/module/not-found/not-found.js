import { Button, Result } from "antd";
const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary">Trở về trang chủ</Button>}
  />
);
export default NotFound;
