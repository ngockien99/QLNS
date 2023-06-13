import { Button, Col, Form, Image, Input, Radio, Row } from "antd";
import dayjs from "dayjs";
import { ActiveUserInfoAtom } from "module/staff-infomation/recoil";
import { useCallback, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import UpdateFormStaffInLife from "../update-form/update-info-staff-in-life";

const StaffInfoInLife = () => {
  const modalRef = useRef();
  const showModal = useCallback(() => {
    modalRef.current.show();
  }, []);

  const showEditButton = useMemo(() => false, []);
  const activeUserInfo = useRecoilValue(ActiveUserInfoAtom);
  const {
    name,
    date_of_birth,
    address,
    id,
    phone,
    gender,
    marital_status,
    email,
    avatar,
    mst,
  } = activeUserInfo?.user || {};

  const data = useMemo(() => {
    return [
      {
        key: "date_of_birth",
        title: "Ngày sinh",
        value: dayjs(date_of_birth).format("DD/MM/YYYY"),
      },
      { key: "gender", title: "Giới tính", value: gender, type: "radio" },
      { key: "CMTND/CCCD", title: "CMTND/CCCD", value: "010291021288" },
      { key: "address", title: "Địa chỉ", value: address },
      { key: "phone", title: "Số điện thoại", value: phone || "0236627637" },
      { key: "email", title: "Email", value: email },
      { key: "mst", title: "Mã số thuế", value: mst },
      {
        key: "marital_status",
        title: "Tình trạng hôn nhân",
        value:
          marital_status === 1
            ? "Đã kết hôn"
            : marital_status === 2
            ? "Khác"
            : "Độc thân",
      },
    ];
  }, [date_of_birth, gender, address, phone, email, mst, marital_status]);

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
        {showEditButton && <Button onClick={showModal}>Chỉnh sửa</Button>}
      </div>
      <div>
        <Form name="form-info-staff-1" layout="vertical" disabled>
          <Row gutter={24} justify="center">
            <Col span={12}>
              <Form.Item name="avatar" label="Ảnh nhân sự">
                <Image
                  width={120}
                  src={
                    avatar ||
                    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="id" label="Mã nhân viên">
                <Input name="id" defaultValue={id} />
              </Form.Item>
              <Form.Item name="name" label="Họ và tên">
                <Input name="name" defaultValue={name} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            {data.map((item) => {
              const { title, value: initValue, type, key } = item;
              return (
                <Col span={12}>
                  <Form.Item name={key} label={title}>
                    {type ? (
                      <Radio.Group defaultValue={initValue} name={key}>
                        <Radio value={0}> Nam </Radio>
                        <Radio value={1}> Nữ </Radio>
                      </Radio.Group>
                    ) : (
                      <Input defaultValue={initValue} name={key} />
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

export default StaffInfoInLife;
