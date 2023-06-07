import { Spin } from "antd";
import Step from "module/form-staff/component/step";
import Step1 from "module/form-staff/component/step-1";
import Step2 from "module/form-staff/component/step-2";
import Step3 from "module/form-staff/component/step-3";
import Step4 from "module/form-staff/component/step-4";
import { IsEditAtom, NewUserInfoAtom } from "module/form-staff/recoil";
import { Fragment, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router";
import { useSetRecoilState } from "recoil";
import API from "util/api";

const FormEdit = () => {
  const params = useParams();
  const { id } = params;
  const setNewStaffInfo = useSetRecoilState(NewUserInfoAtom);
  const setIsEdit = useSetRecoilState(IsEditAtom);
  const queryClient = useQueryClient();

  const { isLoading } = useQuery(
    ["GET_USER_DETAIL", id],
    () => {
      const config = {
        url: "user/detail",
        params: { id },
      };
      return API.request(config);
    },
    {
      onSuccess: (data) => {
        const { academic, user, salary } = data ?? {};

        setNewStaffInfo({
          ...salary,
          ...user,
          academic_name: academic.name,
          academic_rank: academic.rank,
          academic_specialized: academic.specialized,
        });
      },
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (id) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  }, [id, setIsEdit]);

  useEffect(
    () => () => {
      setNewStaffInfo(undefined);
    },
    [setNewStaffInfo]
  );

  useEffect(() => {
    queryClient.refetchQueries(["GET_USER_DETAIL", id]);
  }, [id, queryClient]);

  if (isLoading) {
    return <Spin />;
  }
  return (
    <Fragment>
      <Step />
      <div
        style={{
          margin: "28px 0",
          border: "1px solid #ccc",
          padding: "12px 12px",
          borderRadius: 8,
        }}
      >
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
      </div>
    </Fragment>
  );
};

export default FormEdit;
