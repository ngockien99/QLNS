import { Spin } from "antd";
import Layout from "component/layout";
import { useQuery } from "react-query";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { GET_STAFF_INFO, TOKEN_JWT } from "util/const";
import {
  useQueryDepartmentList,
  useQueryLevelList,
  useQueryManagerList,
  useQueryPositionList,
  useQuerySpecializedList,
} from "util/custom-hook";

const Main = () => {
  const token = localStorage.getItem(TOKEN_JWT);
  const setUserInfo = useSetRecoilState(UserInfoAtom);
  const idLocal = localStorage.getItem("user_id");
  const params = useParams();
  const id = params?.id || idLocal;

  const { isLoading } = useQueryManagerList();
  const { isLoading: specialize_loading } = useQuerySpecializedList();
  const { isLoading: level_loading } = useQueryLevelList();
  const { isLoading: position_loading } = useQueryPositionList();
  const { isLoading: department_loading } = useQueryDepartmentList();

  useQuery(
    [id, GET_STAFF_INFO],
    () => {
      const config = {
        url: `/staff/detail`,
        params: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        setUserInfo(data);
      },
      onError: (error) => {
        console.log(error);
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
