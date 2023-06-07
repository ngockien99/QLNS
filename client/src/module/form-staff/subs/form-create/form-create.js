import Step from "module/form-staff/component/step";
import Step1 from "module/form-staff/component/step-1";
import Step2 from "module/form-staff/component/step-2";
import Step3 from "module/form-staff/component/step-3";
import Step4 from "module/form-staff/component/step-4";
import { IsEditAtom, NewUserInfoAtom } from "module/form-staff/recoil";
import { Fragment, useEffect } from "react";
import { useSetRecoilState } from "recoil";

const FormCreate = () => {
  const setIsEdit = useSetRecoilState(IsEditAtom);
  const setNewStaffInfo = useSetRecoilState(NewUserInfoAtom);
  useEffect(() => {
    setIsEdit(false);
  }, [setIsEdit]);

  useEffect(() => {
    setNewStaffInfo(undefined);
  }, [setNewStaffInfo]);
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

export default FormCreate;
