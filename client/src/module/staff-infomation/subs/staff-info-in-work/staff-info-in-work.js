import { Button, Col, Form, Input, Radio, Row } from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { ActiveUserInfoAtom } from "module/staff-infomation/recoil";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import UpdateFormStaff from "../update-form/update-form-staff";

const StaffInfoInWork = () => {
  const [form] = Form.useForm();
  const modalRef = useRef();
  const showModal = useCallback(() => {
    modalRef.current.show();
  }, []);
  const activeUserInfo = useRecoilValue(ActiveUserInfoAtom);
  const { user, specialize, position, level, department } =
    activeUserInfo ?? {};
  const showEditButton = useMemo(() => false, []);
  const { work_status, start_work, end_work, manager_name } = user ?? {};

  const data = useMemo(
    () => [
      {
        key: "work_status",
        title: "Trạng thái làm việc",
        value:
          work_status === 1
            ? "Nhân viên đang làm việc"
            : "Nhân viên đã nghỉ việc",
      },
      {
        key: "start_work",
        title: "Ngày bắt đầu công việc",
        value: dayjs(start_work).format("DD/MM/YYYY"),
      },
      {
        hidden: isEmpty(end_work),
        key: "end_work",
        title: "Ngày nghỉ việc",
        value: dayjs(end_work).format("DD/MM/YYYY"),
      },
      { title: "Quản lý", value: manager_name, key: " manager" },
      {
        key: "level",
        title: "Vị trí",
        value: level?.name,
      },
      {
        key: "department",
        title: "Phòng ban",
        value: department?.name,
      },
      {
        key: "position",
        title: "Chức vụ",
        value: position?.name,
      },
      {
        key: "specialize",
        title: "Chuyên môn",
        value: specialize?.name,
      },
    ],
    [
      work_status,
      start_work,
      end_work,
      manager_name,
      level?.name,
      department?.name,
      position?.name,
      specialize?.name,
    ]
  );

  useEffect(() => {
    data.map((e) => {
      form.setFieldsValue({ [e.key]: e.value });
    });
  }, [data, form]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1>Thông tin làm việc của nhân sự</h1>
        {showEditButton && <Button onClick={showModal}>Chỉnh sửa</Button>}
      </div>
      <div>
        <Form name="form-info-staff-2" layout="vertical" disabled form={form}>
          <Row gutter={24}>
            {data.map((item) => {
              const { title, type, key, hidden } = item;
              if (hidden) {
                return;
              }
              return (
                <Col span={12}>
                  <Form.Item name={key} label={title}>
                    {type ? (
                      <Radio.Group name={key}>
                        <Radio value="male" name={key}>
                          Nam
                        </Radio>
                        <Radio value="female" name={key}>
                          Nữ
                        </Radio>
                      </Radio.Group>
                    ) : (
                      <Input name={key} />
                    )}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
      </div>
      <UpdateFormStaff ref={modalRef} />
    </div>
  );
};

export default StaffInfoInWork;
