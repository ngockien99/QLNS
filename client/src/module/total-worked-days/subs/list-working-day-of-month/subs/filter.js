import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { EndDateKeyAtom, StartDateKeyAtom, TypeKeyAtom } from "../recoil";

const { RangePicker } = DatePicker;

const FilterComponent = () => {
  const typeOption = [
    { value: 0, label: "Ngày làm việc hợp lệ" },
    { value: 1, label: "Ngày làm việc không hợp lệ" },
  ];

  const setTypeKey = useSetRecoilState(TypeKeyAtom);
  const setEndDateKey = useSetRecoilState(EndDateKeyAtom);
  const setStartDateKey = useSetRecoilState(StartDateKeyAtom);

  const onChangeType = useCallback((value) => setTypeKey(value), [setTypeKey]);

  const onChangeRangerDate = useCallback(
    ([start, end]) => {
      if (start) {
        setStartDateKey(dayjs(start).format("YYYY-MM-DD"));
      }
      if (end) {
        setEndDateKey(dayjs(end).format("YYYY-MM-DD"));
      }
    },
    [setEndDateKey, setStartDateKey]
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "16px 0",
      }}
    >
      <Space>
        <Select
          placeholder="Lọc theo loại ngày làm việc"
          options={typeOption}
          onChange={onChangeType}
        />
        <RangePicker
          format="DD/MM/YYYY"
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          onChange={onChangeRangerDate}
        />
      </Space>
    </div>
  );
};

export default FilterComponent;
