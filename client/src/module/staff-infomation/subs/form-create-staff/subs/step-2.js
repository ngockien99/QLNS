import { Col, DatePicker, Form, Radio, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import {
  LisLevelAtom,
  ListDepartmentAtom,
  ListPositionAtom,
  ListSpecializedAtom,
  ListUserAtom,
} from "state-management/recoil";
import { IsOpen, NewUserInfoAtom, StepAtom } from "../recoil";
import ButtonComponent from "./button";

const Step2 = () => {
  const currentStep = useRecoilValue(StepAtom);
  const [form] = Form.useForm();
  const isOpen = useRecoilValue(IsOpen);
  const newStaffInfo = useRecoilValue(NewUserInfoAtom);

  const manager_list = useRecoilValue(ListUserAtom);
  const level_list = useRecoilValue(LisLevelAtom);
  const position_list = useRecoilValue(ListPositionAtom);
  const department_list = useRecoilValue(ListDepartmentAtom);
  const specialize_list = useRecoilValue(ListSpecializedAtom);
  const data = useMemo(() => {
    return [
      {
        title: "Vai trò",
        key: "role",
        type: "select",
        option: [
          { label: "Quản trị viên", value: 2 },
          { label: "Nhân viên", value: 1 },
        ],
        rules: [{ required: true, message: "Vui lòng nhập vai trò!" }],
      },
      {
        title: "Trạng thái làm việc",
        type: "radio",
        key: "work_status",
        rules: [
          { required: true, message: "Vui lòng nhập trạng thái làm việc" },
        ],
      },
      {
        title: "Ngày bắt đầu công việc",
        type: "date",
        key: "start_work",
        rules: [
          { required: true, message: "Vui lòng nhập ngày bắt đầu làm việc" },
        ],
      },
      {
        title: "Ngày nghỉ việc",
        type: "date",
        key: "end_work",
      },
      {
        title: "Quản lý",
        type: "select",
        key: "manager_id",
        option: manager_list,
        rules: [
          { required: true, message: "Vui lòng nhập thông tin người quản lý!" },
        ],
      },
      {
        title: "Vị trí",
        type: "select",
        key: "position_id",
        option: position_list,
        rules: [{ required: true, message: "Vui lòng nhập vị trí công việc!" }],
      },
      {
        title: "Chuyên môn",
        type: "select",
        key: "specialize_id",
        option: specialize_list,
        rules: [
          { required: true, message: "Vui lòng nhập chuyên môn công việc!" },
        ],
      },
      {
        title: "Phòng ban",
        type: "select",
        key: "department_id",
        option: department_list,
        // rules: [{ required: true, message: "Vui lòng nhập phòng ban!" }],
      },
      {
        title: "Chức vụ",
        type: "select",
        key: "level_id",
        option: level_list,
        rules: [{ required: true, message: "Vui lòng nhập chức vụ!" }],
      },
    ];
  }, [
    department_list,
    level_list,
    manager_list,
    position_list,
    specialize_list,
  ]);

  useEffect(() => {
    if (!!isOpen) {
      form.resetFields();
    }
  }, [form, isOpen]);

  return (
    <Form
      form={form}
      name="form-create-staff-step-2"
      layout="vertical"
      initialValues={{
        newStaffInfo,
        end_date: newStaffInfo?.end_date
          ? dayjs(newStaffInfo?.end_date, "YYYY-MM-DD")
          : "",
        start_date: newStaffInfo?.start_date
          ? dayjs(newStaffInfo?.start_date, "YYYY-MM-DD")
          : "",
      }}
    >
      <div
        style={{
          gap: 12,
          display: currentStep !== 1 ? "none" : "flex",

          flexDirection: "column",
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, value: initValue, type, key, option, rules } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title} rules={rules}>
                  {type === "radio" ? (
                    <Radio.Group defaultValue={initValue}>
                      <Radio value={0}> Nhân viên đã nghỉ việc </Radio>
                      <Radio value={1}> Nhân viên đang làm việc </Radio>
                    </Radio.Group>
                  ) : type === "select" ? (
                    <Select name={key} options={option} />
                  ) : (
                    <DatePicker
                      name={key}
                      placeholder="Vui lòng chọn ngày..."
                      format="DD/MM/YYYY"
                    />
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

export default Step2;
