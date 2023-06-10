import {
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
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
import { GET_LIST_CONTACT } from "util/const";

const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "application/msword" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/pdf";
  if (!isJpgOrPng) {
    message.error("You can only upload docx, doc, pdf file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const FormContract = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState("");
  const queriesClient = useQueryClient();
  const listUser = useRecoilValue(ListUserAtom);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleChange = (e) => {
    console.log(e);
    setFile(e?.file?.name);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      value.start_work = dayjs(value.start_work, "YYYY-MM-DD");
      value.end_work = dayjs(value.end_work, "YYYY-MM-DD");
      setNewData(value);
      Object.entries(value).map(([formKey, value]) => {
        if (formKey === "file") {
          return;
        }
        return form.setFields([{ name: formKey, value: value }]);
      });
    },
  }));
  const title = useMemo(
    () => (newData ? `Chỉnh sửa hợp đồng` : "Thêm hợp đồng"),
    [newData]
  );

  const { mutate } = useMutation(
    (data) => {
      let formData = new FormData();
      data.start_work = dayjs(data?.start_work || newData?.start_work).format(
        "YYYY-MM-DD"
      );
      data.end_work = dayjs(data?.end_work || newData?.end_work).format(
        "YYYY-MM-DD"
      );
      if (data.file) {
        data.file = data?.file?.[0].originFileObj;
      } else {
        delete data.file;
      }
      const url = newData ? "contract/update" : "contract/create";
      Object.entries(data).map(([key, value]) => {
        formData.append(key, value);
      });
      if (newData) {
        formData.append("_method", "PUT");
      }

      const config = {
        url: url,
        data: formData,
        method: "post",
        header: { "Content-Type": "multipart/form-data" },
      };
      return API.request(config);
    },
    {
      onSuccess: () => {
        queriesClient.invalidateQueries(GET_LIST_CONTACT);
        message.success(
          `Bạn đã ${newData ? "sửa" : "thêm"} hợp đồng thành công`
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
        <Form.Item name="user_id" label="Người lao động:">
          <Select options={listUser} name="user_id" />
        </Form.Item>
        <Form.Item name="type_of_contract" label="Loại hợp đồng:">
          <Input name="type_of_contract" />
        </Form.Item>
        <Space justyfy="between">
          <Form.Item name="start_work" label="Ngày bắt đầu:">
            <DatePicker name="start_work" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="end_work" label="Ngày kết thúc:">
            <DatePicker name="end_work" format="DD/MM/YYYY" />
          </Form.Item>
        </Space>
        <Form.Item
          name="file"
          label="File hợp đồng"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            accept=".doc,.docx,.pdf"
            maxCount={1}
          >
            {uploadButton}
          </Upload>
          {file && file}
          {newData?.file && !file && (
            <a href={newData?.file} download target="_blank" rel="noreferrer">
              {newData?.file}
            </a>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default FormContract;
