import { Col, Divider, Form, Input, Modal, Row, Select } from "antd";

import { FilePdfOutlined } from "@ant-design/icons";
import { Button } from "antd";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { useRecoilValue } from "recoil";
import { ListSpecializedAtom } from "state-management/recoil";

const FormScreenPayroll = forwardRef((_, ref) => {
  const [form] = Form.useForm();
  const [show, setShow] = useState(false);
  const listSpecialized = useRecoilValue(ListSpecializedAtom);
  const [dataForm, setDataForm] = useState(undefined);

  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    setValue: (value) => {
      const data = { ...value, ...value?.info_payroll };
      setDataForm(data);
      Object.entries(data).map(([formKey, value]) => {
        return form.setFields([{ name: formKey, value: value }]);
      });
    },
  }));
  const userData = [
    {
      title: "Mã nhân viên",
      key: "user_id",
    },
    {
      title: "Họ tên nhân viên",
      key: "name",
    },
    {
      title: "Phòng ban",
      key: "specialize_id",
      options: listSpecialized,
      type: "select",
    },
  ];
  const data = [
    { title: "Tổng lương  theo hợp đồng (đơn vị:VND)", key: "gross" },
    { title: "Lương cơ bản (đơn vị:VND)", key: "salary_basic" },
    { title: "Thưởng hiệu quả công việc (đơn vị:VND)", key: "bonus_money" },
    { title: "Khen thưởng (đơn vị:VND)", key: "reward" },
    { title: "Phụ cấp (đơn vị:VND)", key: "allowance_money" },
    { title: "Ngày công (đơn vị:Ngày)", key: "total_working_days_standard" },
    { title: "Ngày làm việc thực tế (đơn vị:Ngày)", key: "total_working_days" },
    { title: "Ngày nghỉ phép (đơn vị:Ngày)", key: "leave_paid" },
    { title: "Ngày nghỉ không lương (đơn vị:Ngày)", key: "leave_unpaid" },
    { title: "Tổng thu nhập (đơn vị:VND)", key: "total_money" },
    {
      title: "Trừ tiền đóng BHXH, BHYT, BHTN (đơn vị:VND)",
      key: "insurance_premium_salary",
    },
    { title: "Trừ tiền thuế TNCN (đơn vị:VND)", key: "tax" },
    { title: "Kỷ luật", key: "discipline" },
    { title: "Lương thực nhận (đơn vị:VND)", key: "real_money_received" },
  ];

  const download = useCallback(() => {
    const doc = new jsPDF({ orientation: "portrait" });
    const PADDING = 10;
    const LINE_HEIGHT = 8;
    const PAGE_WIDTH =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    const {
      bonus_money,
      total_money,
      leave_paid,
      leave_unpaid,
      reward,
      allowance_money,
      month_pay,
      gross,
      real_money_received,
      discipline,
      tax,
      total_working_days,
      total_working_days_standard,
      insurance_premium_salary,
      salary_basic,
    } = dataForm;
    let drawCell = function (data) {
      const doc = data.doc;
      console.log(data, doc);
      if ([0, 5, 10, 11, 16].includes(data.row.index)) {
        doc.setTextColor("#ff0000");
      }
    };

    let currentY = PADDING;
    doc.setFontSize(16);
    doc.setFont("", "", "bold");
    doc.text("Cong ty CP TRICO", PADDING, currentY);
    currentY += LINE_HEIGHT;
    doc.setFont("", "", "normal");
    doc.setFontSize(14);
    doc.text(
      "So 1 Nguyen Thuong Hien, P Nguyen Du, Q Hai Ba Trung, TP Ha Noi",
      PADDING,
      currentY
    );
    currentY += LINE_HEIGHT;
    doc.text("Tel: 0283983923, Fax: 0929828783", PADDING, currentY);
    currentY += LINE_HEIGHT * 2;
    doc.setFontSize(18);
    doc.setFont("", "", "bold");
    doc.text(
      `THONG BAO LUONG THANG ${dayjs(month_pay, "YYYY-MM").format("MM/YYYY")}`,
      PAGE_WIDTH / 2,
      currentY,
      {
        align: "center",
      }
    );
    currentY += LINE_HEIGHT * 4;
    doc.setFont("", "", "normal");
    doc.setFontSize(14);
    doc.text(
      PADDING,
      currentY,
      doc.splitTextToSize(
        `Phong nhan su gui Anh/Chi bang luong thang ${dayjs(
          month_pay,
          "YYYY-MM"
        ).format(
          "MM/YYYY"
        )}, neu co thac mac Anh/Chi vui long lien he voi phong nhan su de duoc giai dap.`,
        180
      )
    );
    currentY += LINE_HEIGHT * 2;
    doc.autoTable({
      styles: {
        fontSize: 9,
      },
      startY: currentY,
      head: [["So thu tu", "Muc", "Don vi", "So luong"]],
      body: [
        ["A", "Tong luong Gross theo hop dong", "Dong", gross],
        ["1", "Luong co ban", "Dong", salary_basic],
        ["2", "Thuong hieu qua cong viec", "Dong", bonus_money],
        ["3", "Khen thuong", "Dong", reward],
        ["4", "Phu cap", "Dong", allowance_money],
        ["B", "Ngay cong", "Ngay", total_working_days_standard],
        ["1", "Ngay lam viec thuc te", "Ngay", total_working_days],
        ["2", "Ngay nghi phep", "Ngay", leave_unpaid + leave_paid],
        ["3", "Ngay nghi khong luong", "Ngay", leave_unpaid],
        ["4", "Ngay nghi nguyen luong", "Ngay", leave_paid],
        ["C", "Tong thu nhap", "Dong", total_money],
        [
          "D",
          "Cac khoan khau tru ca nhan",
          "Dong",
          insurance_premium_salary + discipline + tax,
        ],
        [
          "1",
          "Tru tien dong BHXH, BHYT, BHTN",
          "Dong",
          insurance_premium_salary,
        ],
        ["2", "Tien phat", "Dong", discipline],
        ["3", "Tru tien khau tru thue TNCN", "Dong", tax],
        ["4", "Cac khoan tru khac", "Dong", 0],
        ["E", "Luong thuc nhan", "Dong", real_money_received],
      ],
      theme: "grid",
      rowPageBreak: "avoid",
      willDrawCell: drawCell,
    });
    currentY += LINE_HEIGHT * 18;
    doc.setTextColor("#ff0000");
    doc.setFontSize(12);
    doc.text(
      PADDING,
      currentY,
      doc.splitTextToSize(
        "*Day la thong tin bao mat, neu tiet lo duoi bat ky hinh thuc nao deu bi coi la vi pham ky luat va co the dan den cham dut hop dong lao dong!",
        180
      )
    );
    currentY += LINE_HEIGHT * 2;
    doc.setTextColor("#000");
    doc.setFontSize(14);
    doc.text("Tran trong,", PADDING, currentY);
    currentY += LINE_HEIGHT * 2;
    doc.setFont("", "", "bold");
    doc.text("Phong Nhan Su", PADDING, currentY);
    currentY += LINE_HEIGHT * 2;
    doc.save("test.pdf");
  }, [dataForm]);

  return (
    <Modal
      open={show}
      title="Xem chi tiết bảng lương"
      onCancel={() => {
        setShow(false);
      }}
      width={1000}
      footer={null}
    >
      <Form form={form} layout="vertical" name="form_screen_payroll">
        <Row gutter={24}>
          {userData.map((item) => {
            const { title, type, key, rules, options } = item;
            return (
              <Col span={8}>
                <Form.Item name={key} rules={rules} label={title}>
                  {type === "select" ? (
                    <Select name={key} options={options} />
                  ) : (
                    <Input name={key} />
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        <Divider style={{ marginTop: -8 }} />
        <Row gutter={24}>
          {data.map((item) => {
            const { title, key, rules } = item;
            return (
              <Col span={8}>
                <Form.Item name={key} rules={rules} label={title}>
                  <Input name={key} />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            danger
            style={{
              borderRadius: "4px",
            }}
            icon={<FilePdfOutlined />}
            onClick={download}
          >
            Tải về
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

export default FormScreenPayroll;
