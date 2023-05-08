import { useMemo } from "react";
import { convertDayofWeek } from "util/helper.js";

export const useColumn = (data) => {
  const children = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((e, index) => {
        const { date, checkin, checkout, work_day } = e;
        const dayOfWeek = convertDayofWeek(date);
        const noWorkingDay = ["T7", "CN"].includes(dayOfWeek);
        const className =
          index % 2 === 0 && noWorkingDay
            ? "background_element background_not_working_day"
            : noWorkingDay
            ? "background_not_working_day"
            : index % 2 === 0
            ? "background_element"
            : "";

        return {
          title: date,
          key: `date_of_month_${date}`,
          className: className,
          width: 100,
          children: [
            {
              title: dayOfWeek,
              key: `date_of_week_${date}`,
              className: className,
              width: 120,
              height: 10,
              children: [
                {
                  title: "Giờ vào",
                  key: `login_${date}`,
                  className: className,
                  width: 40,
                  render: () => {
                    if (noWorkingDay) {
                      return;
                    }
                    return checkin;
                  },
                },
                {
                  title: "Giờ ra",
                  key: `logout_${date}`,
                  className: className,
                  width: 40,
                  render: () => {
                    if (noWorkingDay) {
                      return;
                    }
                    return checkout;
                  },
                },
                {
                  title: "Tổng",
                  dataIndex: work_day * 8,
                  className: className,
                  key: `word_day_${date}`,
                  width: 40,
                  render: () => {
                    if (noWorkingDay) {
                      return "Nghỉ";
                    }
                    return work_day * 8;
                  },
                },
              ],
            },
          ],
        };
      });
    }
    return [];
  }, [data]);

  const column = useMemo(
    () => [
      {
        title: "STT",
        dataIndex: "index",
        width: 50,
        key: "index",
        fixed: "left",
      },
      {
        title: "Mã nhân viên",
        dataIndex: "id",
        width: 100,
        key: "id",
        fixed: "left",
      },
      {
        title: "Họ và tên",
        dataIndex: "name",
        width: 100,
        key: "name",
        fixed: "left",
      },
      {
        title: "Phòng ban",
        dataIndex: "department",
        width: 60,
        key: "department",
        fixed: "left",
      },
      {
        title: "Ngày trong tháng",
        dataIndex: "date",
        key: "date",
        children: children,
      },
      {
        title: "Tổng hợp ngày công",
        dataIndex: "date_offer",
        key: "date_offer",
        fixed: "right",
        children: [
          {
            title: "Ngày đi làm",
            dataIndex: "24",
            key: `date`,
            className: "background_total",
            width: 100,
          },
          {
            title: "Ngày nghỉ không lý do",
            dataIndex: "24",
            className: "background_total",
            key: `date`,
            width: 100,
          },
          {
            title: "Tổng ngày không được tính lương",
            dataIndex: "24",
            className: "background_total",
            key: `date`,
            width: 100,
          },
          {
            title: "Tổng ngày được tính lương",
            dataIndex: "24",
            className: "background_total",
            key: `date`,
            width: 100,
          },
        ],
      },
    ],
    [children]
  );
  return column;
};
