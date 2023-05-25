import { Form, Input, Modal, message } from "antd";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import API from "util/api";
import { GET_LIST_CONTACT } from "util/const";

const FormContract = forwardRef((_, ref) => {
  const [form] = Form.useForm();

  const [show, setShow] = useState(false);
  const [newData, setNewData] = useState("");
  const queriesClient = useQueryClient();
  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      Object.entries(value).map(([formKey, value]) => {
        return form.setFields([{ name: formKey, value: value }]);
      });
      setNewData(value);
    },
  }));
  const title = useMemo(
    () => (newData ? `Chỉnh sửa vị trí ${newData?.name}` : "Thêm vị trí"),
    [newData]
  );

  const { mutate } = useMutation(
    (data) => {
      const method = newData ? "put" : "post";
      const url = newData ? "contract/update" : "contract/create";
      const config = {
        url: url,
        data: { ...newData, ...data },
        method: method,
      };
      return API.request(config);
    },
    {
      onSuccess: (_, variable) => {
        const { name } = variable;
        queriesClient.invalidateQueries(GET_LIST_CONTACT);
        message.success(
          `Bạn đã ${newData ? "sửa" : "thêm"} vị trí ${name} thành công`
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
      }}
      onOk={onSubmit}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="name" label="Chức vụ:">
          <Input name="name" />
        </Form.Item>
        <Form.Item name="description" label="Miêu tả:">
          <Input name="description" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default FormContract;
