import { FilePdfOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import Header from "component/header-component/header";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";

const Salary = () => {
  const userInfo = useRecoilValue(UserInfoAtom);

  const { id } = userInfo?.user;
  const { data: queryData } = useQuery("QUERY_PAYROLL_LIST", () => {
    const config = {
      url: "payroll/list",
      params: { user_id: id },
    };
    return API.request(config);
  });

  const download = useCallback((data) => {
    const newData = {
      ...data,
      ...data.info_payroll,
    };

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
    } = newData;
    let drawCell = function (data) {
      const doc = data.doc;
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
  }, []);

  const data = queryData?.data.map((e) => {
    return { ...e.payroll, ...e.salary, ...e.user };
  });

  console.log(data);

  const columns = [
    {
      title: "Mã Nhân Viên",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Lương tháng",
      dataIndex: "month_pay",
      key: "month_pay",
    },

    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          style={{
            borderRadius: "4px",
          }}
          icon={<FilePdfOutlined />}
          onClick={() => download(record)}
        >
          Tải về
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Header content="Bảng lương" noButton />
      <Table columns={columns} dataSource={data} bordered />;
    </div>
  );
};

export default Salary;
