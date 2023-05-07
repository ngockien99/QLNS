import { Button, Col, Form, Input, Radio, Row } from "antd";
import { useRef } from "react";

const ThongTinNhanSu = () => {
  const data = useRef({
    work_status: {
      title: "Trạng thái làm việc",
      value: "Nhân viên đang làm việc",
    },
    start_work: { title: "Ngày bắt đầu công việc", value: "14/02/1999" },
    end_work: { title: "Ngày nghỉ việc", value: "02/03/2023" },
    manager_id: { title: "Quản lý", value: "Nguyễn Hoàng Sơn" },
    level_id: { title: "Vị trí", value: "Chuyên viên" },
    salary_id: { title: "Bậc lương", value: "2" },
    department_id: { title: "Phòng ban", value: "Công nghệ" },
    position_id: { title: "Chức vụ", value: "Nhân viên" },
    specialize_id: { title: "Chuyên môn", value: "FrontEnd Developer" },
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
        <Button>Edit</Button>
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
    </div>
  );
};

export default ThongTinNhanSu;
