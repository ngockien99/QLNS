import Highcharts from "highcharts";
import { memo, useEffect, useRef } from "react";

export default memo(() => {
  const refContainer = useRef();
  useEffect(() => {
    Highcharts.chart(refContainer.current, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: "Cơ cấu nhân sự theo phòng ban",
        align: "left",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: "Tỉ trọng",
          colorByPoint: true,
          data: [
            {
              name: "Khối Công Nghệ",
              y: 70.67,
              sliced: true,
              selected: true,
            },
            {
              name: "Khối Nhân Sự",
              y: 14.77,
            },
            {
              name: "Khối Kinh Doanh",
              y: 4.86,
            },
          ],
        },
      ],
    });
  });
  return (
    <div
      ref={refContainer}
      style={{
        borderRadius: 8,
        overflow: "hidden",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    />
  );
});
