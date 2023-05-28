import { FilePdfOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";

const Salary = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const {
    allowance_money,
    insurance_premium_salary,
    salary_basic,
    salary_factor,
  } = userInfo?.salary ?? {};
  console.log(userInfo);
  const { data: queryData } = useQuery("QUERY_PAYROLL_LIST", () => {
    const config = {
      url: "payroll/list",
    };
    return API.request(config);
  });

  const download = useCallback((data) => {
    const doc = new jsPDF({ orientation: "portrait" });
    const PADDING = 10;
    const LINE_HEIGHT = 8;
    const PAGE_WIDTH =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    const {
      bonus_money,
      month_pay,
      tax,
      total_money_actual_receive,
      total_working_days,
      total_working_days_standard,
    } = data;
    let drawCell = function (data) {
      const doc = data.doc;
      console.log(data, doc);
      if ([0, 4, 9, 10, 14].includes(data.row.index)) {
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
    doc.text("THONG BAO LUONG THANG 03/2021", PAGE_WIDTH / 2, currentY, {
      align: "center",
    });
    currentY += LINE_HEIGHT * 4;
    doc.setFont("", "", "normal");
    doc.setFontSize(14);
    doc.text(
      PADDING,
      currentY,
      doc.splitTextToSize(
        `Phong nhan su gui Anh/Chi bang luong thang ${month_pay}, neu co thac mac Anh/Chi vui long lien he voi phong nhan su de duoc giai dap.`,
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
        ["A", "Tong luong Gross theo hop dong", "Dong", "15400000"],
        ["1", "Luong co ban", "Dong", salary_basic],
        ["2", "Thuong hieu qua cong viec", "Dong", bonus_money],
        ["B", "Ngay cong", "Ngay", total_working_days_standard],
        ["1", "Ngay lam viec thuc te", "Ngay", total_working_days],
        ["2", "Ngay nghi phep", "Ngay", "18000"],
        ["3", "Ngay nghi khong luong", "Ngay", "1800"],
        ["4", "Ngay nghi nguyen luong", "Ngay", "18000000"],
        ["C", "Tong thu nhap", "Dong", total_money_actual_receive],
        ["D", "Cac khoan khau tru ca nhan", "Dong", "50000"],
        [
          "1",
          "Tru tien dong BHXH, BHYT, BHTN",
          "Dong",
          insurance_premium_salary,
        ],
        ["3", "Tru tien khau tru thue TNCN", "Dong", tax],
        ["4", "Cac khoan tru khac", "Dong", "18000000"],
        ["E", "Luong thuc nhan", "Dong", "1800"],
      ],
      theme: "grid",
      rowPageBreak: "avoid",
      willDrawCell: drawCell,
    });
    currentY += LINE_HEIGHT * 16;
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

  return <Table columns={columns} dataSource={data} bordered />;
};

export default Salary;
