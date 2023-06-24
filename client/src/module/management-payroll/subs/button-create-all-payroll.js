import { Button } from "antd";
import { useMutation, useQueryClient } from "react-query";
import api from "util/api";

const ButtonCreateAll = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => {
      const config = {
        url: "payroll/create-all",
        method: "post",
      };
      return api.request(config);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("GET_LIST_PAYROLL");
      },
    }
  );
  return (
    <Button onClick={() => mutate()}>
      Tính lương tháng cho tất cả nhân viên
    </Button>
  );
};

export default ButtonCreateAll;
