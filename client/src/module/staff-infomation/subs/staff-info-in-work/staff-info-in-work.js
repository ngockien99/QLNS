import { Button, Col, Form, Input, Radio, Row } from "antd";
import dayjs from "dayjs";
import { ActiveUserInfoAtom } from "module/staff-infomation/recoil";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { ROLE } from "util/const";
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
  const showEditButton = useMemo(() => (ROLE === "admin" ? true : false), []);
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
        value: dayjs(start_work || "2021-12-06").format("DD/MM/YYYY"),
      },
      {
        key: "end_work",
        title: "Ngày nghỉ việc",
        value: dayjs(end_work || "2023-03-02").format("DD/MM/YYYY"),
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
        <h1>Thông tin nhân sự</h1>
        {showEditButton && <Button onClick={showModal}>Chỉnh sửa</Button>}
      </div>
      <div>
        <Form name="form-info-staff-2" layout="vertical" disabled form={form}>
          <Row gutter={24}>
            {data.map((item) => {
              const { title, type, key } = item;
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
