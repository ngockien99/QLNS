import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { NewUserInfoAtom, StepAtom } from "../recoil";
import ButtonComponent from "./button";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const Step1 = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const currentStep = useRecoilValue(StepAtom);
  const newStaffInfo = useRecoilValue(NewUserInfoAtom);
  const {
    name,
    gender,
    date_of_birth,
    address,
    phone,
    email,
    marital_status,
    mst,
    cccd,
    avatar,
  } = newStaffInfo ?? {};

  const data = useMemo(
    () => [
      {
        title: "Tên nhân viên",
        key: "name",
        value: name,
        rules: [{ required: true, message: "Vui lòng nhập tên nhân viên!" }],
      },
      {
        title: "Giới tính",
        type: "radio",
        key: "gender",
        value: gender,
        rules: [{ required: true, message: "Vui lòng nhập giới tính!" }],
      },
      {
        title: "Ngày sinh",
        key: "date_of_birth",
        type: "date",
        value: !isEmpty(date_of_birth)
          ? dayjs(date_of_birth, "YYYY-MM-DD")
          : "",
        rules: [{ required: true, message: "Vui lòng nhập ngày sinh" }],
      },
      {
        title: "Địa chỉ",
        key: "address",
        value: address,
        rules: [{ required: true, message: "Vui lòng nhập địa chỉ!" }],
      },
      {
        title: "Số điện thoại",
        key: "phone",
        value: phone,
        rules: [{ required: true, message: "Vui lòng nhập số điện thoại!" }],
      },
      {
        title: "Email",
        key: "email",
        value: email,
        rules: [{ required: true, message: "Vui lòng nhập email!" }],
      },
      {
        title: "CCCD",
        key: "cccd",
        value: cccd,
        rules: [{ required: true, message: "Vui lòng nhập CCCD!" }],
      },
      {
        title: "Mã số thuế",
        key: "mst",
        value: mst,
        rules: [{ required: true, message: "Vui lòng nhập mã số thuế!" }],
      },

      {
        title: "Tình trạng hôn nhân",
        key: "marital_status",
        type: "select",
        value: marital_status,
        options: [
          { label: "Độc thân", value: 0 },
          { label: "Đã kết hôn", value: 1 },
          { label: "Khác", value: 2 },
        ],
        rules: [
          { required: true, message: "Vui lòng nhập tình trạng hôn nhân!" },
        ],
      },
    ],
    [
      address,
      cccd,
      date_of_birth,
      email,
      gender,
      marital_status,
      mst,
      name,
      phone,
    ]
  );

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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
    console.log("kienn", e);
    setImageUrl(e?.fileList?.[0]?.originFileObj);
  };

  useEffect(() => {
    if (!isEmpty(newStaffInfo)) {
      data.forEach((e) => {
        form.setFieldsValue({ [e.key]: e.value });
      });
    }
  }, [data, form, newStaffInfo]);

  return (
    <Form form={form} name="form-create-staff-step-1" layout="vertical">
      <div
        style={{
          gap: 12,
          display: currentStep !== 0 ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <Form.Item
          name="avatar"
          label="Ảnh nhân sự"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            accept="image/*"
            maxCount={1}
          >
            {imageUrl ? (
              <img
                src={URL.createObjectURL(imageUrl)}
                alt="avatar"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                }}
              />
            ) : !isEmpty(avatar) ? (
              <img
                src={avatar}
                alt="avatar"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Row gutter={24}>
          {data.map((item) => {
            const { title, type, key, rules, options } = item;
            return (
              <Col span={12}>
                <Form.Item name={key} rules={rules} label={title}>
                  {type === "radio" ? (
                    <Radio.Group name={key}>
                      <Radio value={0}>Nam </Radio>
                      <Radio value={1}> Nữ</Radio>
                    </Radio.Group>
                  ) : type === "select" ? (
                    <Select name={key} options={options} />
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonComponent />
        </div>
      </div>
    </Form>
  );
};

export default Step1;
