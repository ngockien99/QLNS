import { Fragment, forwardRef, memo, useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IsEditAtom, IsOpen, StepAtom } from "./recoil";
import Step from "./subs/step";
import Step1 from "./subs/step-1";
import Step2 from "./subs/step-2";
import Step3 from "./subs/step-3";
import Step4 from "./subs/step-4";

const FormCreateStaff = forwardRef((_, ref) => {
  const setCurrentStep = useSetRecoilState(StepAtom);
  const [open, setOpen] = useRecoilState(IsOpen);
  const [isEdit, setIsEdit] = useRecoilState(IsEditAtom);

  const onClose = useCallback(() => {
    setOpen(false);
    setIsEdit(false);
    setCurrentStep(0);
  }, [setCurrentStep, setIsEdit, setOpen]);

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
        <Step3 isResetField={!open} />
        <Step4 onClose={onClose} isResetField={!open} />
      </div>
    </Fragment>
  );
});

export default memo(FormCreateStaff);
