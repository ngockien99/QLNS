import { Button, Col, Form, Input, Radio, Row } from "antd";
import { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import UpdateFormStaff from "../update-form/update-form-staff";

const ThongTinNhanSu = () => {
  const modalRef = useRef();
  const showModal = useCallback(() => {
    modalRef.current.show();
  }, []);
  const userInfo = useRecoilValue(UserInfoAtom);
  const { user } = userInfo ?? {};

  const {
    work_status,
    start_work,
    end_work,
    level_id,
    department_id,
    position_id,
    specialize_id,
    manager_name,
  } = user ?? {};
  console.log(user);
  const data = useRef({
    work_status: {
      title: "Trạng thái làm việc",
      value:
        work_status === 1
          ? "Nhân viên đang làm việc"
          : "Nhân viên đã nghỉ việc",
    },
    start_work: {
      title: "Ngày bắt đầu công việc",
      value: start_work || "06/12/2021",
    },
    end_work: { title: "Ngày nghỉ việc", value: end_work || "02/03/2023" },
    manager_id: { title: "Quản lý", value: manager_name || "Nguyễn Hoàng Sơn" },
    level_id: {
      title: "Vị trí",
      value: level_id === 1 ? "Chuyên viên" : "Ăn hại",
    },
    salary_id: { title: "Bậc lương", value: "2" },
    department_id: {
      title: "Phòng ban",
      value: department_id === 1 ? "Công nghệ" : "Phòng kinh doanh",
    },
    position_id: {
      title: "Chức vụ",
      value: position_id === 1 ? "Nhân viên" : "Qủan lý",
    },
    specialize_id: {
      title: "Chuyên môn",
      value: specialize_id === 1 ? "FrontEnd Developer" : "Ăn hại",
    },
  });
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
        <Button onClick={showModal}>Edit</Button>
      </div>
      <div>
        <Form name="customized_form_controls" layout="vertical" disabled>
          <Row gutter={24}>
            {Object.entries(data.current).map(([key, value]) => {
              const { title, value: initValue, type } = value;
              return (
                <Col span={8}>
                  <Form.Item name={key} label={title}>
                    {type ? (
                      <Radio.Group defaultValue={initValue}>
                        <Radio value="male"> Nam </Radio>
                        <Radio value="female"> Nữ </Radio>
                      </Radio.Group>
                    ) : (
                      <Input defaultValue={initValue} />
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

export default ThongTinNhanSu;
