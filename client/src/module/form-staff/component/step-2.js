import { Col, DatePicker, Form, Radio, Row, Select } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import {
  LisLevelAtom,
  ListDepartmentAtom,
  ListPositionAtom,
  ListSpecializedAtom,
  ListUserAtom,
} from "state-management/recoil";
import { IsEditAtom, IsOpen, NewUserInfoAtom, StepAtom } from "../recoil";
import ButtonComponent from "./button";

const Step2 = () => {
  const currentStep = useRecoilValue(StepAtom);
  const [form] = Form.useForm();
  const isOpen = useRecoilValue(IsOpen);
  const newStaffInfo = useRecoilValue(NewUserInfoAtom);
  const isEdit = useRecoilValue(IsEditAtom);

  const {
    role,
    work_status,
    end_work,
    start_work,
    manager_id,
    level_id,
    specialize_id,
    department_id,
    position_id,
  } = newStaffInfo ?? {};
  const manager_list = useRecoilValue(ListUserAtom);
  const level_list = useRecoilValue(LisLevelAtom);
  const position_list = useRecoilValue(ListPositionAtom);
  const department_list = useRecoilValue(ListDepartmentAtom);

  console.log(department_list);
  const specialize_list = useRecoilValue(ListSpecializedAtom);
  const data = useMemo(() => {
    return [
      {
        title: "Vai trò",
        key: "role",
        type: "select",
        value: role,
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
        value: isEdit ? work_status : 1,
        disable: !isEdit && true,
        rules: [
          { required: true, message: "Vui lòng nhập trạng thái làm việc" },
        ],
      },
      {
        title: "Ngày bắt đầu công việc",
        type: "date",
        key: "start_work",
        value: start_work ? dayjs(start_work, "YYYY-MM-DD") : "",
        rules: [
          { required: true, message: "Vui lòng nhập ngày bắt đầu làm việc" },
        ],
      },
      {
        hidden: !isEdit,
        title: "Ngày nghỉ việc",
        type: "date",
        key: "end_work",
        value: end_work ? dayjs(end_work, "YYYY-MM-DD") : "",
      },
      {
        title: "Quản lý",
        type: "select",
        key: "manager_id",
        value: manager_id,
        option: manager_list,
        rules: [
          { required: true, message: "Vui lòng nhập thông tin người quản lý!" },
        ],
      },
      {
        title: "Vị trí",
        type: "select",
        key: "position_id",
        value: position_id,
        option: position_list,
        rules: [{ required: true, message: "Vui lòng nhập vị trí công việc!" }],
      },
      {
        title: "Chuyên môn",
        type: "select",
        key: "specialize_id",
        value: specialize_id,
        option: specialize_list,
        rules: [
          { required: true, message: "Vui lòng nhập chuyên môn công việc!" },
        ],
      },
      {
        title: "Phòng ban",
        type: "select",
        key: "department_id",
        value: department_id,
        option: department_list,
        // rules: [{ required: true, message: "Vui lòng nhập phòng ban!" }],
      },
      {
        title: "Chức vụ",
        type: "select",
        key: "level_id",
        value: level_id,
        option: level_list,
        rules: [{ required: true, message: "Vui lòng nhập chức vụ!" }],
      },
    ];
  }, [
    department_id,
    department_list,
    end_work,
    isEdit,
    level_id,
    level_list,
    manager_id,
    manager_list,
    position_id,
    position_list,
    role,
    specialize_id,
    specialize_list,
    start_work,
    work_status,
  ]);

  useEffect(() => {
    if (!!isOpen) {
      form.resetFields();
    }
  }, [form, isOpen]);

  useEffect(() => {
    if (!isEmpty(newStaffInfo)) {
      data.forEach((e) => {
        form.setFieldsValue({ [e.key]: e.value });
      });
    }
  }, [data, form, newStaffInfo]);

  return (
    <Form form={form} name="form-create-staff-step-2" layout="vertical">
      <div
        style={{
          gap: 12,
          display: currentStep !== 1 ? "none" : "flex",

          flexDirection: "column",
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const {
              title,
              value: initValue,
              type,
              key,
              option,
              rules,
              disable,
            } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title} rules={rules}>
                  {type === "radio" ? (
                    <Radio.Group defaultValue={initValue} disabled={disable}>
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
