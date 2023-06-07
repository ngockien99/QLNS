import { Col, Form, Input, Row, Select } from "antd";
import { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { IsOpen, NewUserInfoAtom, StepAtom } from "../recoil";
import ButtonComponent from "./button";

const Step4 = ({ onClose }) => {
  const [form] = Form.useForm();

  const currentStep = useRecoilValue(StepAtom);
  const isOpen = useRecoilValue(IsOpen);
  const newStaffInfo = useRecoilValue(NewUserInfoAtom);
  const data = useMemo(() => {
    return [
      {
        title: "Tên Trường",
        key: "academic_name",
        rules: [{ required: true, message: "Vui lòng nhập tên trường!" }],
      },
      {
        title: "Cấp bậc đào tạo",
        key: "academic_rank",
        type: "select",
        rules: [{ required: true, message: "Vui lòng nhập cấp bậc đào tạo!" }],
        option: [
          { label: "Trung cấp", value: 1 },
          { label: "Cao đẳng", value: 2 },
          { label: "Đại học", value: 3 },
          { label: "Cao học", value: 4 },
        ],
      },
      {
        title: "Học vị",
        key: "academic_specialize",
        type: "select",
        rules: [{ required: true, message: "Vui lòng chọn học vị!" }],
        option: [
          { label: "Cử nhân", value: "Cử nhân" },
          { label: "Kỹ sư", value: "Kỹ sư" },
          { label: "Thạc sỹ", value: "Thạc sỹ" },
          { label: "Tiến sỹ", value: "Tiến sỹ" },
        ],
      },
    ];
  }, []);

  useEffect(() => {
    if (!!isOpen) {
      form.resetFields();
    }
  }, [form, isOpen]);

  return (
    <Form
      form={form}
      name="form-create-staff-step-4"
      layout="vertical"
      initialValues={{
        ...newStaffInfo,
        academic_specialize: newStaffInfo?.academic_specialized,
      }}
    >
      <div
        style={{
          gap: 12,
          display: currentStep !== 3 ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, key, option, type, rules } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title} rules={rules}>
                  {type === "select" ? (
                    <Select name={key} options={option} />
                  ) : (
                    <Input name={key} />
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonComponent onClose={onClose} />
        </div>
      </div>
    </Form>
  );
};

export default Step4;
