import { Col, Form, Input, Modal, Row, Select, message } from "antd";
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

const UpdateAcademic = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [userInfo, setUserInfo] = useRecoilState(UserInfoAtom);

  const { name, rank, specialized } = userInfo?.academic || {};
  console.log(name, rank, specialized);
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
      {
        title: "Tên Trường",
        value: name,
        key: "academic_name",
      },
      {
        title: "Trình độ",
        value: rank,
        key: "academic_rank",
        type: "select",
        option: [
          { label: "Trung cấp", value: 1 },
          { label: "Cao đẳng", value: 2 },
          { label: "Đại học", value: 3 },
          { label: "Cao học", value: 4 },
        ],
      },
      {
        title: "Ngành học",
        value: specialized,
        key: "academic_specialized",
      },
    ];
  }, [name, rank, specialized]);

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
        name="update-info-salary"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          academic_name: name,
          academic_rank: rank,
          academic_specialized: specialized,
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, key, option, type } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title}>
                  {type === "select" ? (
                    <Select name={key} options={option} />
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

export default UpdateAcademic;
