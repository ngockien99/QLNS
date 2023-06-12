import { isEmpty } from "lodash";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import {
  LisLevelAtom,
  ListDepartmentAtom,
  ListPositionAtom,
  ListSpecializedAtom,
  ListUserAtom,
} from "state-management/recoil";

import API from "util/api";

export const useCheckRole = () => {
  const role = localStorage.getItem("role");
  if (isEmpty(role)) {
    return;
  }
  if (Number(role)) {
    if (Number(role) === 2) {
      return "admin";
    }
    return "staff";
  }
};

export const useQuerySpecializedList = () => {
  const setListSpecialized = useSetRecoilState(ListSpecializedAtom);
  const { data, isLoading } = useQuery(
    ["QUERY_SPECIALIZED_LIST"],
    () => {
      const config = { url: "specialize/list" };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        const options = data?.data.map((e) => {
          return { value: e.id, label: e.name };
        });
        setListSpecialized(options);
      },
    }
  );

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};

export const useQueryManagerList = () => {
  const setListUser = useSetRecoilState(ListUserAtom);
  const { data, isLoading } = useQuery(
    ["QUERY_MANAGER_LIST"],
    () => {
      const config = { url: "user/list" };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        const options = data?.data?.map((e) => {
          return { value: e.id, label: e.name };
        });
        setListUser(options);
      },
    }
  );

  const options = data?.data?.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
export const useQueryPositionList = () => {
  const setListPosition = useSetRecoilState(ListPositionAtom);
  const { data, isLoading } = useQuery(
    ["QUERY_POSITION_LIST"],
    () => {
      const config = { url: "position/list" };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        const options = data?.data.map((e) => {
          return { value: e.id, label: e.name };
        });
        setListPosition(options);
      },
    }
  );

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
export const useQueryLevelList = () => {
  const setListLevel = useSetRecoilState(LisLevelAtom);
  const { data, isLoading } = useQuery(
    ["QUERY_LEVEL_LIST"],
    () => {
      const config = { url: "level/list" };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        const options = data?.data.map((e) => {
          return { value: e.id, label: e.name };
        });
        setListLevel(options);
      },
    }
  );

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
export const useQueryDepartmentList = () => {
  const setListDepartment = useSetRecoilState(ListDepartmentAtom);
  const { data, isLoading } = useQuery(
    ["QUERY_DEPARTMENT_LIST"],
    () => {
      const config = { url: "department/list", params: { status: 1 } };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        const options = data?.data.map((e) => {
          return { value: e.id, label: e.name };
        });
        setListDepartment(options);
        console.log(options, data);
      },
    }
  );

  const options = data?.data.map((e) => {
    return { value: e.id, label: e.name };
  });
  return { options, isLoading };
};
