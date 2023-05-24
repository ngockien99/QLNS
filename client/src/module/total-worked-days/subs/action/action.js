import { FilterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Select, Space } from "antd";
import { Fragment, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FormVerify from "../form-verify";
import WorkedDaysApprove from "../worked-days-approve";

const Action = () => {
  const modalSendTimeSheetRef = useRef();
  const modalFormRef = useRef();
  const openModalSendTimeSheet = useCallback(
    () => modalSendTimeSheetRef.current.show(),
    []
  );

  const [showFillter, setShowFilter] = useState(false);
  const onShow = useCallback(() => {
    setShowFilter(true);
  }, []);
  const openModalForm = useCallback(() => modalFormRef.current.show(), []);
  return (
    <Fragment>
      <Form style={{ width: "100%" }}>
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 24,
            marginTop: 24,
          }}
          size="large"
        >
          <Space size="large">
            <Link to="/danh-sach-cong" target="blank">
              <Button type="primary" style={{ backgroundColor: "#1fae51" }}>
                Xem tổng hợp công
              </Button>
            </Link>
            <Button
              type="primary"
              //  backgroundColor: "#09aeae",
              style={{ minWidth: 60 }}
              onClick={onShow}
              icon={<FilterOutlined />}
            />
            <Button type="primary" onClick={openModalForm}>
              Thêm chờ duyệt công
            </Button>
          </Space>
        </Space>
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Form.Item label="Trạng thái:">
            <Select
              style={{ minWidth: 280 }}
              placeholder="Trạng thái..."
              options={[
                {
                  value: "Chờ duyệt",
                  label: "Chờ duyệt",
                },
                {
                  value: "Đã được duyệt",
                  label: "Đã được duyệt",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu:">
            <DatePicker placeholder="Ngày bắt đầu..." />
          </Form.Item>
          <Form.Item label="Ngày kết thúc:">
            <DatePicker placeholder="Ngày kết thúc..." />
          </Form.Item>
        </Space>
      </Form>
      <WorkedDaysApprove ref={modalSendTimeSheetRef} />
      <FormVerify ref={modalFormRef} />
    </Fragment>
  );
};

export default Action;
