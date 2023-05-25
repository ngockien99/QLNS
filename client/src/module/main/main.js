import Layout from "component/layout";
import { useQuery } from "react-query";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { TOKEN_JWT } from "util/const";

const Main = () => {
  const token = localStorage.getItem(TOKEN_JWT);
  const setUserInfo = useSetRecoilState(UserInfoAtom);
  const idLocal = localStorage.getItem("user_id");
  const params = useParams();
  const id = params?.id || idLocal;

  useQuery(
    [id, "QUERY_STAFF_INFO"],
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
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
      enabled: !!id,
    }
  );

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
