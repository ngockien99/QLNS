import Layout from "component/layout";
import { Navigate, Outlet } from "react-router-dom";
import { TOKEN_JWT } from "util/const";

const Main = () => {
  const token = localStorage.getItem(TOKEN_JWT);
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
