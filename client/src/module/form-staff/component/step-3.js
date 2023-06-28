import { Col, Form, Input, Row } from "antd";
import { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { IsOpen, NewUserInfoAtom, StepAtom } from "../recoil";
import ButtonComponent from "./button";

const Step3 = () => {
  const [form] = Form.useForm();

  const currentStep = useRecoilValue(StepAtom);
  const isOpen = useRecoilValue(IsOpen);
  const newStaffInfo = useRecoilValue(NewUserInfoAtom);
  const data = useMemo(() => {
    return [
      {
        title: "Lương cơ bản(đơn vị: Đồng)",
        key: "salary_basic",
        rules: [{ required: true, message: "Vui lòng nhập mức lương cơ bản!" }],
      },

      // {
      //   title: "Hệ số lương",
      //   key: "salary_factor",
      //   rules: [
      //     { required: true, message: "Vui lòng nhập thưởng kinh doanh!" },
      //   ],
      // },
      {
        title: "Thưởng kinh doanh(đơn vị: Đồng)",
        key: "allowance_money",
        rules: [
          { required: true, message: "Vui lòng nhập thưởng kinh doanh!" },
        ],
      },
      {
        title: "Tiền đóng BHXH, BHYT(đơn vị: Đồng)",
        key: "insurance_premium_salary",
        rules: [
          { required: true, message: "Vui lòng nhập tiền đóng BHXH, BHYT!" },
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
      name="form-create-staff-step-3"
      layout="vertical"
      initialValues={newStaffInfo}
    >
      <div
        style={{
          gap: 12,
          display: currentStep !== 2 ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, key, rules } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title} rules={rules}>
                  <Input name={key} />
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

export default Step3;
