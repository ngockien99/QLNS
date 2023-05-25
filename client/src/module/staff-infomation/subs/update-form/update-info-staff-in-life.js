import { Col, Form, Input, Modal, Radio, Row, message } from "antd";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { GET_STAFF_INFO } from "util/const";

const UpdateFormStaff1 = forwardRef(({ onCancel, onCreate }, ref) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [userInfo, setUserInfo] = useRecoilState(UserInfoAtom);

  const {
    name,
    date_of_birth,
    address,
    phone,
    gender,
    academic_level_id,
    marital_status,
  } = userInfo?.user || {};
  const queryClient = useQueryClient();
  const params = useParams();
  const { id } = params;

  const { mutate } = useMutation(
    (data) => {
      const config = {
        url: "user/update",
        method: "put",
        data: { ...userInfo?.user, ...data },
      };
      return API.request(config);
    },
    {
      onSuccess: (_, variables) => {
        setUserInfo((pre) => ({ ...pre, ...variables }));
        queryClient.invalidateQueries([id, GET_STAFF_INFO]);
        message.success("Bạn đã cập nhật thông tin thành công!");
        setOpen(false);
      },
      onError: (error) => {
        message.error(error.message);
      },
    }
  );
  const onFinish = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, mutate]);

  useImperativeHandle(ref, () => ({
    show: () => {
      setOpen(true);
    },
  }));

  const data = useMemo(() => {
    return [
      { title: "Tên nhân viên", value: name, key: "name" },
      {
        title: "Ngày sinh",
        value: date_of_birth || "15/09/99",
        key: date_of_birth,
      },
      { title: "Địa chỉ", value: address, key: "address" },
      { title: "Số điện thoại", value: phone || "0236627637", key: "phone" },
      { title: "Giới tính", value: gender, type: "radio", key: "gender" },
      {
        title: "Trình độ chuyên môn",
        value: academic_level_id,
        key: "academic_level_id",
      },
      {
        title: "Tình trạng hôn nhân",
        value: marital_status,
        key: "marital_status",
      },
    ];
  }, [
    academic_level_id,
    address,
    date_of_birth,
    gender,
    marital_status,
    name,
    phone,
  ]);

  return (
    <Modal
      open={open}
      title="Sửa thông tin nhân viên"
      okText="Sửa"
      cancelText="Huỷ"
      onCancel={() => setOpen(false)}
      onOk={onFinish}
    >
      <Form
        form={form}
        name="update-info-staff"
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, value: initValue, type, key } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title}>
                  {type ? (
                    <Radio.Group defaultValue={initValue}>
                      <Radio value={0}> Nam </Radio>
                      <Radio value={1}> Nữ </Radio>
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
    </Modal>
  );
});

export default UpdateFormStaff1;
