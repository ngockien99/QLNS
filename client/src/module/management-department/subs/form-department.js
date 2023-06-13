import { Form, Input, Modal, Radio, Select, message } from "antd";
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
import { GET_LIST_DEPARTMENT, QUERY_DEPARTMENT_LIST } from "util/const";

const FormDepartment = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const managerList = useRecoilValue(ListUserAtom);
  console.log(managerList);
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
    () =>
      newData
        ? `Chỉnh sửa thông tin phòng ban ${newData?.name}`
        : "Thêm phòng ban",
    [newData]
  );

  const formConfig = useMemo(
    () => [
      { key: "name", title: "Tên phòng ban" },
      { key: "code", title: "Mã phòng ban" },
      { key: "description", title: "Miêu tả" },
      { key: "status", title: "Trạng thái", type: "radio" },
      {
        key: "head_of_department_id",
        title: "Trưởng phòng",
        type: "select",
        option: managerList,
      },
    ],

    [managerList]
  );

  const { mutate } = useMutation(
    (data) => {
      const method = newData ? "put" : "post";
      const url = newData ? "department/update" : "department/create";
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
        queriesClient.invalidateQueries(GET_LIST_DEPARTMENT);
        queriesClient.invalidateQueries(QUERY_DEPARTMENT_LIST);
        message.success(
          `Bạn đã ${newData ? "sửa" : "thêm"} phòng ban ${name} thành công`
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
      <Form form={form} layout="vertical" name="form_in_modal_department">
        {formConfig.map((e) => {
          const { key, title, type, option } = e;
          return (
            <Form.Item name={key} label={title}>
              {type === "radio" ? (
                <Radio.Group>
                  <Radio value={1}>Đang hoạt động</Radio>
                  <Radio value={0}>Giải thể</Radio>
                </Radio.Group>
              ) : type === "select" ? (
                <Select name={key} options={option} />
              ) : (
                <Input name={key} />
              )}
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
});

export default FormDepartment;
