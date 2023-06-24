import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import {
  EndDateKeyAtom,
  StartDateKeyAtom,
  StatusKeyAtom,
  TypeKeyAtom,
} from "../recoil";

const { RangePicker } = DatePicker;

const FilterComponent = () => {
  const typeOption = [
    { value: 0, label: "Nghỉ phép" },
    { value: 1, label: "Làm thêm giờ" },
  ];
  const statusOption = [
    { value: 0, label: "Chờ phê duyệt" },
    { value: 1, label: "Đã phê duyệt" },
    { value: 2, label: "Từ chối  phê duyệt" },
  ];

  const setTypeKey = useSetRecoilState(TypeKeyAtom);
  const setStatusKey = useSetRecoilState(StatusKeyAtom);
  const setEndDateKey = useSetRecoilState(EndDateKeyAtom);
  const setStartDateKey = useSetRecoilState(StartDateKeyAtom);

  const onChangeType = useCallback((value) => setTypeKey(value), [setTypeKey]);
  const onChangeStatus = useCallback(
    (value) => setStatusKey(value),
    [setStatusKey]
  );

  const onChangeRangerDate = useCallback(
    (value) => {
      if (Array.isArray(value)) {
        const start = value?.[0];
        const end = value?.[1];
        setStartDateKey(dayjs(start || "").format("YYYY-MM-DD"));
        setEndDateKey(dayjs(end).format("YYYY-MM-DD"));
      } else {
        setStartDateKey("");
        setEndDateKey("");
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
          placeholder="Lọc theo loại báo cáo"
          options={typeOption}
          onChange={onChangeType}
          allowClear
        />
        <Select
          placeholder="Lọc theo trạng thái phê duyệt"
          options={statusOption}
          onChange={onChangeStatus}
          allowClear
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
