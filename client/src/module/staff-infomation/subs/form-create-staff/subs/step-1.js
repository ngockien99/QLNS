import { Col, DatePicker, Form, Input, Radio, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { IsOpen, NewUserInfoAtom, StepAtom } from "../recoil";
import ButtonComponent from "./button";

const Step1 = () => {
  const [form] = Form.useForm();
  const currentStep = useRecoilValue(StepAtom);

  const isOpen = useRecoilValue(IsOpen);

  const newStaffInfo = useRecoilValue(NewUserInfoAtom);

  const data = useMemo(
    () => [
      {
        title: "Tên nhân viên",
        key: "name",

        rules: [{ required: true, message: "Vui lòng nhập tên nhân viên!" }],
      },
      {
        title: "Giới tính",
        type: "radio",
        key: "gender",

        rules: [{ required: true, message: "Vui lòng nhập giới tính!" }],
      },
      {
        title: "Ngày sinh",
        key: "date_of_birth",
        type: "date",

        rules: [{ required: true, message: "Vui lòng nhập ngày sinh" }],
      },
      {
        title: "Địa chỉ",
        key: "address",

        rules: [{ required: true, message: "Vui lòng nhập địa chỉ!" }],
      },
      {
        title: "Số điện thoại",
        key: "phone",

        rules: [{ required: true, message: "Vui lòng nhập số điện thoại!" }],
      },
      {
        title: "Email",
        key: "email",

        rules: [{ required: true, message: "Vui lòng nhập email!" }],
      },
      {
        title: "Mật khẩu",
        key: "password",

        rules: [{ required: true, message: "Vui lòng nhập email!" }],
      },

      {
        title: "Tình trạng hôn nhân",
        key: "marital_status",
        type: "select",

        options: [
          { label: "Độc thân", value: 0 },
          { label: "Đã kết hôn", value: 1 },
          { label: "Khác", value: 2 },
        ],
        rules: [
          { required: true, message: "Vui lòng nhập tình trạng hôn nhân!" },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    if (!!isOpen) {
      form.resetFields();
    }
  }, [form, isOpen]);

  return (
    <Form
      form={form}
      name="form-create-staff-step-1"
      layout="vertical"
      initialValues={{
        ...newStaffInfo,
        date_of_birth: newStaffInfo?.date_of_birth
          ? dayjs(newStaffInfo?.date_of_birth, "YYYY-MM-DD")
          : "",
      }}
    >
      <div
        style={{
          gap: 12,
          display: currentStep !== 0 ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, type, key, rules, options } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} rules={rules} label={title}>
                  {type === "radio" ? (
                    <Radio.Group name={key}>
                      <Radio value={0}>Nam </Radio>
                      <Radio value={1}> Nữ</Radio>
                    </Radio.Group>
                  ) : type === "select" ? (
                    <Select name={key} options={options} />
                  ) : type === "date" ? (
                    <DatePicker name={key} format="DD/MM/YYYY" />
                  ) : (
                    <Input name={key} />
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonComponent />
        </div>
      </div>
    </Form>
  );
};

export default Step1;
