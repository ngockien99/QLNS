import { Button, Col, Form, Input, Radio, Row } from "antd";
import dayjs from "dayjs";
import { useCallback, useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import { ROLE } from "util/const";
import UpdateFormStaffInLife from "../update-form/update-info-staff-in-life";

const ThongTinCaNhan = () => {
  const modalRef = useRef();
  const showModal = useCallback(() => {
    modalRef.current.show();
  }, []);

  const showEditButton = useMemo(() => (ROLE === "admin" ? true : false), []);

  const userInfo = useRecoilValue(UserInfoAtom);
  const {
    name,
    date_of_birth,
    address,
    id,
    phone,
    gender,
    marital_status,
    email,
  } = userInfo?.user || {};

  const data = useMemo(() => {
    return [
      { title: "Mã nhân viên", value: id },

      { key: "name", title: "Tên nhân viên", value: name },
      {
        key: "date_of_birth",
        title: "Ngày sinh",
        value: dayjs(date_of_birth).format("DD/MM/YYYY"),
      },
      { key: "gender", title: "Giới tính", value: gender, type: "radio" },
      { key: "address", title: "Địa chỉ", value: address },
      { key: "phone", title: "Số điện thoại", value: phone || "0236627637" },
      { key: "email", title: "Email", value: email },
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
  }, [id, name, date_of_birth, gender, address, phone, email, marital_status]);

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
          <Row gutter={24}>
            {data.map((item) => {
              const { title, value: initValue, type, key } = item;
              return (
                <Col span={12}>
                  <Form.Item name={initValue} label={title}>
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

export default ThongTinCaNhan;
