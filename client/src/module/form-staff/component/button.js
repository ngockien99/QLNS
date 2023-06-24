import { Button, Form, message } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { memo, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router";
import { useRecoilState } from "recoil";
import API from "util/api";
import { GET_LIST_STAFF, QUERY_LIST_MANAGER } from "util/const";
import { NewUserInfoAtom, StepAtom } from "../recoil";

const ButtonComponent = memo(() => {
  const form = Form.useFormInstance();
  const [currentStep, setCurrentStep] = useRecoilState(StepAtom);
  const [newStaffInfo, setNewStaffInfo] = useRecoilState(NewUserInfoAtom);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const queryClient = useQueryClient();
  const onClose = useCallback(() => {
    setCurrentStep(0);
    navigate(-1);
    if (!id) {
      setNewStaffInfo(undefined);
    }
  }, [id, navigate, setCurrentStep, setNewStaffInfo]);

  const { mutate, isLoading } = useMutation(
    (data) => {
      let formData = new FormData();
      console.log("ha12-m", data, newStaffInfo);
      data.date_of_birth = dayjs(newStaffInfo?.date_of_birth || "").format(
        "YYYY-MM-DD"
      );
      data.start_work = dayjs(newStaffInfo?.start_work || "").format(
        "YYYY-MM-DD"
      );

      if (!isEmpty(newStaffInfo?.end_work)) {
        data.end_work = dayjs(newStaffInfo?.end_work || "").format(
          "YYYY-MM-DD"
        );
      }
      data.department_id = newStaffInfo.department_id || 1;
      const params = { ...newStaffInfo, ...data };

      if (
        newStaffInfo.hasOwnProperty("avatar") &&
        (typeof newStaffInfo?.avatar === "string" || !newStaffInfo?.avatar)
      ) {
        delete params?.avatar;
      } else if (
        typeof newStaffInfo?.avatar === "object" &&
        !isEmpty(newStaffInfo?.avatar)
      ) {
        params.avatar = newStaffInfo?.avatar?.[0]?.originFileObj;
      }
      console.log(params, data, newStaffInfo);
      Object.entries(params).map(([key, value]) => {
        formData.append(key, value);
      });
      if (id) {
        formData.append("_method", "PUT");
      }

      const config = {
        url: id ? "user/update" : "user/create",
        method: "post",
        data: formData,
        header: { "Content-Type": "multipart/form-data" },
      };
      console.log("kienn", formData.get("avatar"));
      return API.request(config);
    },
    {
      onSuccess: () => {
        message.success(
          `Bạn đã ${id ? "Chỉnh sửa" : "Thêm"} thông tin nhân viên thành công!`
        );
        queryClient.invalidateQueries(GET_LIST_STAFF);
        queryClient.invalidateQueries(QUERY_LIST_MANAGER);
        onClose();
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
          console.log("kienn-next", values);
          setNewStaffInfo((pre) => ({ ...pre, ...values }));
        })
        .catch((reason) => console.log(reason)),
    [form, setCurrentStep, setNewStaffInfo]
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
    [form, setCurrentStep, setNewStaffInfo]
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      form.validateFields().then((values) => {
        mutate(values);
      });
    },
    [form, mutate]
  );

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
