import { Button, Col, Form, Input, Radio, Row } from "antd";
import { useCallback, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import UpdateFormStaffInLife from "../update-form/update-info-staff-in-life";

const ThongTinCaNhan = () => {
  const modalRef = useRef();
  const showModal = useCallback(() => {
    modalRef.current.show();
  }, []);

  const userInfo = useRecoilValue(UserInfoAtom);
  const {
    name,
    date_of_birth,
    address,
    id,
    phone,
    gender,
    academic_level_id,
    marital_status,
    email,
  } = userInfo?.user || {};
  console.log(userInfo?.user);

  const data = useMemo(() => {
    return [
      { title: "Mã nhân viên", value: id },

      { title: "Tên nhân viên", value: name },
      { title: "Ngày sinh", value: date_of_birth || "15/09/99" },
      { title: "Giới tính", value: gender, type: "radio" },
      { title: "Địa chỉ", value: address },
      { title: "Số điện thoại", value: phone || "0236627637" },
      { title: "email", value: email },
      { title: "Tình trạng hôn nhân", value: marital_status },
      { title: "Trình độ chuyên môn", value: academic_level_id },

      { title: "Trạng thái làm việc", value: name },
      { title: "Ngày bắt đầu công việc", value: date_of_birth || "15/09/99" },
      { title: "Ngày nghỉ việc", value: address },
      { title: "Quản lý", value: phone || "0236627637" },
      { title: "Vị trí", value: id },
      { title: "Bậc lương", value: gender, type: "radio" },
      {
        title: "Phòng ban",
        value: academic_level_id,
      },
    ];
  }, [
    id,
    name,
    date_of_birth,
    gender,
    address,
    phone,
    email,
    marital_status,
    academic_level_id,
  ]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <h1>Thông tin cá nhân</h1>
        <Button onClick={showModal}>Edit</Button>
      </div>
      <div>
        <Form name="customized_form_controls" layout="vertical" disabled>
          <Row gutter={24}>
            {data.map((item) => {
              const { title, value: initValue, type } = item;
              return (
                <Col span={8}>
                  <Form.Item name={initValue} label={title}>
                    {type ? (
                      <Radio.Group defaultValue={initValue}>
                        <Radio value={1}> Nam </Radio>
                        <Radio value={0}> Nữ </Radio>
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
      <UpdateFormStaffInLife ref={modalRef} />
    </div>
  );
};

export default ThongTinCaNhan;
