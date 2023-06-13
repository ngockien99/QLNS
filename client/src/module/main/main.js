import { Spin, message } from "antd";
import Layout from "component/layout";
import { useQuery } from "react-query";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { GET_STAFF_INFO, TOKEN_JWT } from "util/const";
import {
  useCheckRole,
  useQueryDepartmentList,
  useQueryLevelList,
  useQueryManagerList,
  useQueryPositionList,
  useQuerySpecializedList,
} from "util/custom-hook";

const Main = () => {
  const token = localStorage.getItem(TOKEN_JWT);

  const setUserInfo = useSetRecoilState(UserInfoAtom);
  const id = localStorage.getItem("user_id");
  const role = useCheckRole();
  const navigate = useNavigate();

  const { isLoading } = useQueryManagerList();
  const { isLoading: specialize_loading } = useQuerySpecializedList();
  const { isLoading: level_loading } = useQueryLevelList();
  const { isLoading: position_loading } = useQueryPositionList();
  const { isLoading: department_loading } = useQueryDepartmentList();

  useQuery(
    [id, GET_STAFF_INFO],
    () => {
      const config = {
        url: `/user/detail`,
        params: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        // message.success(
        //   "Chào mừng bạn đến với hệ thống quản lý nhân sự công ty Trico"
        // );
        setUserInfo(data);
      },
      onError: (error) => {
        message.error(error);
      },
      enabled: !!id,
    }
  );

  if (
    isLoading ||
    specialize_loading ||
    level_loading ||
    position_loading ||
    department_loading
  ) {
    return <Spin />;
  }

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default Main;
