import { Button, Result } from "antd";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { TOKEN_JWT } from "util/const";
import { useCheckRole } from "util/custom-hook";
const NotFound = () => {
  const navigate = useNavigate();
  const role = useCheckRole();
  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem(TOKEN_JWT);

  const onBackToHome = useCallback(() => {
    if (token) {
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate(`/quan-ly-ho-so-ca-nhan/thong-tin-ca-nhan/${id}`);
      }
    } else {
      navigate("/login");
    }
  }, [id, navigate, role, token]);
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, chúng tôi không tìm thấy trang mà bạn yêu cầu."
      extra={
        <Button type="primary" onClick={onBackToHome}>
          Trở về trang chủ
        </Button>
      }
    />
  );
};
export default NotFound;
