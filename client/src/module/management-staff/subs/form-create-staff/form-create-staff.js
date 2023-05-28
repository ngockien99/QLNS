import { Modal } from "antd";
import {
  Fragment,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
} from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IsEditAtom, IsOpen, NewUserInfoAtom, StepAtom } from "./recoil";
import Step from "./subs/step";
import Step1 from "./subs/step-1";
import Step2 from "./subs/step-2";
import Step3 from "./subs/step-3";
import Step4 from "./subs/step-4";

const FormCreateStaff = forwardRef((_, ref) => {
  const setCurrentStep = useSetRecoilState(StepAtom);
  const setNewStaffInfo = useSetRecoilState(NewUserInfoAtom);
  const [open, setOpen] = useRecoilState(IsOpen);
  const [isEdit, setIsEdit] = useRecoilState(IsEditAtom);

  useImperativeHandle(ref, () => ({
    show: () => {
      setOpen(true);
    },
    setValue: (value) => {
      setNewStaffInfo(value);
      setIsEdit(true);
    },
  }));

  const onClose = useCallback(() => {
    setOpen(false);
    setIsEdit(false);
    setCurrentStep(0);
  }, [setCurrentStep, setIsEdit, setOpen]);

  // const { isLoading } = useQuery(
  //   ["GET_USER_DETAIL", data?.id, isEdit],
  //   () => {
  //     const config = {
  //       url: "user/detail",
  //       params: { id: data?.id },
  //     };
  //     return API.request(config);
  //   },
  //   {
  //     onSuccess: (data) => {
  //       const { academic, user, salary } = data ?? {};
  //       setNewStaffInfo({ ...data, ...academic, ...salary, ...user });
  //     },
  //     enabled: !!data?.id && !!isEdit,
  //   }
  // );

  return (
    <Modal
      title={`${isEdit ? "Sửa" : "Thêm"} thông tin nhân sự`}
      open={open}
      width={900}
      footer={null}
      centered
      onCancel={onClose}
    >
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
    </Modal>
  );
});

export default memo(FormCreateStaff);
