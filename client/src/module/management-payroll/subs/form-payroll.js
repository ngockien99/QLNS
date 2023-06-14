import { Form, Input, Modal, Select, message } from "antd";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import API from "util/api";

const FormPayroll = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("create");

  const [newData, setNewData] = useState("");
  const queriesClient = useQueryClient();
  const listUser = useRecoilValue(ListUserAtom);

  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      setNewData(value);
      setAction(value.action);
      value.bonus_money = Number(value.bonus_money);
      Object.entries(value).map(([formKey, value]) => {
        return form.setFields([{ name: formKey, value: value }]);
      });
    },
  }));
  const title = useMemo(
    () => (action === "edit" ? `Chỉnh sửa bảng lương` : "Thêm bảng lương"),
    [action]
  );

  const { mutate } = useMutation(
    (data) => {
      data.bonus_money = Number(data.bonus_money || newData.bonus_money);
      const params = { ...newData, ...data };
      const url = newData ? "payroll/update" : "payroll/create";

      const config = {
        url: url,
        data: params,
        method: newData ? "put" : "post",
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queriesClient.invalidateQueries("GET_LIST_PAYROLL");
        message.success(
          `Bạn đã ${newData ? "sửa" : "thêm"} thông tin bảng lương thành công`
        );
        form.resetFields();
        setNewData("");
        setShow(false);
      },
      onError: (error) => {
        message.error(error);
      },
    }
  );

  const onSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, mutate]);

  return (
    <Modal
      open={show}
      title={title}
      okText="Xác nhận"
      cancelText="Huỷ"
      onCancel={() => {
        setShow(false);
        form.resetFields();
        setNewData("");
        setAction("create");
      }}
      onOk={onSubmit}
    >
      <Form form={form} layout="vertical" name="form_in_modal_payroll">
        <Form.Item name="user_id" label="Người lao động:">
          <Select options={listUser} name="user_id" />
        </Form.Item>
        <Form.Item name="bonus_money" label="Số tiền thưởng:">
          <Input name="bonus_money" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default FormPayroll;
