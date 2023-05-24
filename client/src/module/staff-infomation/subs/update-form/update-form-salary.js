import { Col, Form, Input, Modal, Row, message } from "antd";
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

const UpdateFormSalary = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [userInfo, setUserInfo] = useRecoilState(UserInfoAtom);

  const { salary_basic, allowance_money, insurance_premium_salary } =
    userInfo?.salary || {};
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
        // setUserInfo((pre) => ({ ...pre, ...variables }));
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
        values.salary_basic = Number(values.salary_basic);
        values.insurance_premium_salary = Number(
          values.insurance_premium_salary
        );
        values.allowance_money = Number(values.allowance_money);
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
        title: "Lương cơ bản",
        value: salary_basic,
        key: "salary_basic",
      },
      {
        title: "Thưởng kinh doanh",
        value: allowance_money,
        key: "allowance_money",
      },
      {
        title: "Ngày nghỉ việc",
        value: insurance_premium_salary,
        key: "insurance_premium_salary",
      },
    ];
  }, []);

  //   useEffect(() => {
  //     if (open) {
  //       data.forEach((e) => {
  //         return form.setFields([{ name: e.key, value: e.value }]);
  //       });
  //     }
  //   }, [data, form, open]);

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
          salary_basic: salary_basic,
          allowance_money: allowance_money,
          insurance_premium_salary: insurance_premium_salary,
        }}
      >
        <Row gutter={24}>
          {data.map((item) => {
            const { title, key, value } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} label={title}>
                  <Input name={key} defaultValue={value} />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
});

export default UpdateFormSalary;
