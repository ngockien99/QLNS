import { useQuery } from "react-query";
import API from "util/api";

export const useQuerySpecializedList = () => {
  const { data, isLoading } = useQuery(["QUERY_SPECIALIZED_LIST"], () => {
    const config = { url: "specialize/list" };
    return API.request(config);
  });

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};

export const useQueryManagerList = () => {
  const { data, isLoading } = useQuery(["QUERY_MANAGER_LIST"], () => {
    const config = { url: "user/list" };
    return API.request(config);
  });

  const options = data?.data?.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
export const useQueryPositionList = () => {
  const { data, isLoading } = useQuery(["QUERY_POSITION_LIST"], () => {
    const config = { url: "position/list" };
    return API.request(config);
  });

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
export const useQueryLevelList = () => {
  const { data, isLoading } = useQuery(["QUERY_LEVEL_LIST"], () => {
    const config = { url: "level/list" };
    return API.request(config);
  });

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
export const useQueryDepartmentList = () => {
  const { data, isLoading } = useQuery(["QUERY_DEPARTMENT_LIST"], () => {
    const config = { url: "department/list" };
    return API.request(config);
  });

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
