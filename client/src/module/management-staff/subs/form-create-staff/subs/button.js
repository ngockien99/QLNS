import { Button, Form, message } from "antd";
import dayjs from "dayjs";
import { memo, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import API from "util/api";
import { GET_LIST_STAFF } from "util/const";
import { IsEditAtom, NewUserInfoAtom, StepAtom } from "../recoil";

const ButtonComponent = memo(({ onClose }) => {
  const form = Form.useFormInstance();
  const [currentStep, setCurrentStep] = useRecoilState(StepAtom);
  const [newStaffInfo, setNewStaffInfo] = useRecoilState(NewUserInfoAtom);
  const isEdit = useRecoilValue(IsEditAtom);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (data) => {
      data.date_of_birth = dayjs(newStaffInfo?.date_of_birth || "").format(
        "YYYY-MM-DD"
      );
      data.start_work = dayjs(newStaffInfo?.start_work || "").format(
        "YYYY-MM-DD"
      );
      data.end_work = dayjs(newStaffInfo?.end_work || "").format("YYYY-MM-DD");
      data.department_id = newStaffInfo.department_id || 1;

      const config = {
        url: isEdit ? "user/update" : "user/create",
        method: isEdit ? "put" : "post",
        data: { ...newStaffInfo, ...data },
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        message.success(
          `Bạn đã ${
            isEdit ? "Chỉnh sửa" : "Thêm"
          } thông tin nhân viên thành công!`
        );
        queryClient.invalidateQueries(GET_LIST_STAFF);
        onClose();
        setNewStaffInfo(undefined);
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  const next = useCallback(
    () =>
      form
        .validateFields()
        .then((values) => {
          setCurrentStep((pre) => pre + 1);
          setNewStaffInfo((pre) => ({ ...pre, ...values }));
        })
        .catch((reason) => console.log(reason)),
    [setCurrentStep]
  );

  const previous = useCallback(
    () =>
      form
        .validateFields()
        .then((values) => {
          setCurrentStep((pre) => pre - 1);
          setNewStaffInfo((pre) => ({ ...pre, ...values }));
        })
        .catch(() => console.log("kienn")),
    [setCurrentStep]
  );

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    form.validateFields().then((values) => {
      mutate(values);
    });
  }, []);

  return (
    <div
      style={{
        marginTop: 24,
      }}
    >
      {currentStep > 0 && (
        <Button
          style={{
            margin: "0 8px",
          }}
          onClick={previous}
        >
          Quay lại
        </Button>
      )}
      {currentStep === 3 && (
        <Button
          type="primary"
          htmlType="submit"
          onClick={onSubmitForm}
          loading={isLoading}
        >
          Xác nhận
        </Button>
      )}
      {currentStep < 3 && (
        <Button type="primary" onClick={next}>
          Tiếp tục
        </Button>
      )}
    </div>
  );
});

export default ButtonComponent;
