import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import { GET_STAFF_INFO } from "util/const";
import { Marital } from "util/data-form";

const UpdateFormStaff1 = forwardRef(({ onCancel, onCreate }, ref) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const userInfo = useRecoilValue(UserInfoAtom);

  const queryClient = useQueryClient();
  const params = useParams();
  const { id } = params;

  const { mutate } = useMutation(
    (data) => {
      const config = {
        url: "user/update",
        method: "put",
        data: { ...userInfo?.user, ...userInfo?.salary, ...data },
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
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
        values.date_of_birth = dayjs(values.date_of_birth).format("YYYY-MM-DD");
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
      { title: "Tên nhân viên", key: "name" },
      {
        title: "Ngày sinh",
        key: "date_of_birth",
        type: "date",
      },
      { title: "Địa chỉ", key: "address" },
      { title: "Số điện thoại", key: "phone" },
      { title: "Giới tính", type: "radio", key: "gender" },
      {
        title: "email",
        key: "email",
      },
      {
        title: "Tình trạng hôn nhân",
        type: "select",
        option: Marital,
        key: "marital_status",
      },
    ];
  }, []);

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
        initialValues={{
          ...userInfo?.user,
          date_of_birth: dayjs(userInfo?.user?.date_of_birth, "YYYY-MM-DD"),
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, type, key, option } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title}>
                  {type === "radio" ? (
                    <Radio.Group name={key}>
                      <Radio value={0}> Nam </Radio>
                      <Radio value={1}> Nữ </Radio>
                    </Radio.Group>
                  ) : type === "select" ? (
                    <Select name={key} options={option} />
                  ) : type === "date" ? (
                    <DatePicker name={key} format="DD/MM/YYYY" />
                  ) : (
                    <Input name={key} />
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
