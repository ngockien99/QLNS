import { DatePicker, Form, Input, Modal, Radio, Select, message } from "antd";
import dayjs from "dayjs";

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
const { TextArea } = Input;

const FormRewardDiscipline = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("create");
  const [type, setType] = useState(0);
  const onChange = useCallback((e) => {
    setType(e.target.value);
  }, []);

  console.log(type);
  const [newData, setNewData] = useState("");
  const queriesClient = useQueryClient();
  const listUser = useRecoilValue(ListUserAtom);

  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      value.date = dayjs(value.date, "YYYY-MM-DD");
      setNewData(value);
      setAction(value.action);
      value.type = Number(value.type);
      Object.entries(value).map(([formKey, value]) => {
        return form.setFields([{ name: formKey, value: value }]);
      });
    },
  }));
  const title = useMemo(
    () =>
      action === "edit"
        ? `Chỉnh sửa khen thưởng/kỷ luật`
        : action === "screen"
        ? "Xem chi tiết quyết định khen thưởng/kỷ luật"
        : "Thêm Khen thưởng/kỷ luật",
    [action]
  );

  const { mutate } = useMutation(
    (data) => {
      data.date = dayjs(data?.date || newData?.date).format("YYYY-MM-DD");
      data.type = Number(data.type || newData.type || type);
      const params = { ...newData, ...data };
      const url = newData
        ? "reward-discipline/update"
        : "reward-discipline/create";

      const config = {
        url: url,
        data: params,
        method: newData ? "put" : "post",
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queriesClient.invalidateQueries("GET_LIST_REWARD_DISCIPLINE");
        message.success(
          `Bạn đã ${newData ? "sửa" : "thêm"} khen thưởng/kỷ luật thành công`
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
    if (action === "screen") {
      return;
    }
    form
      .validateFields()
      .then((values) => {
        mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [action, form, mutate]);

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
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal_contract"
        disabled={action === "screen"}
      >
        <Form.Item name="type" label="Loại quyết định:">
          <Radio.Group name="type">
            <Radio value={0} name="type" onChange={onChange}>
              Khen thưởng
            </Radio>
            <Radio value={1} name="type" onChange={onChange}>
              Kỷ luật
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="user_id" label="Người lao động:">
          <Select options={listUser} name="user_id" />
        </Form.Item>

        <Form.Item name="date" label="Ngày bắt đầu:">
          <DatePicker name="date" format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="money" label="Số tiền Thưởng/Phạt:">
          <Input name="money" />
        </Form.Item>
        <Form.Item name="reason" label="Lý do:">
          <TextArea name="reason" />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default FormRewardDiscipline;
