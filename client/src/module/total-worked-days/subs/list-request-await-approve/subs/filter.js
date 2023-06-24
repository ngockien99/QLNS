import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import {
  EndDateKeyAtom,
  StartDateKeyAtom,
  TypeKeyAtom,
  UserKeyAtom,
} from "../recoil";

const { RangePicker } = DatePicker;

const FilterComponent = () => {
  const managerList = useRecoilValue(ListUserAtom);
  const typeOption = [
    { value: 0, label: "Nghỉ phép" },
    { value: 1, label: "Làm thêm giờ" },
  ];

  const setManagerKey = useSetRecoilState(UserKeyAtom);

  const setTypeKey = useSetRecoilState(TypeKeyAtom);
  const setEndDateKey = useSetRecoilState(EndDateKeyAtom);
  const setStartDateKey = useSetRecoilState(StartDateKeyAtom);
  const onChangeType = useCallback((value) => setTypeKey(value), [setTypeKey]);
  const onChangeManager = useCallback(
    (value) => setManagerKey(value),
    [setManagerKey]
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
        justifyContent: "space-between",
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
          placeholder="Lọc theo tên nhân viên"
          options={managerList}
          onChange={onChangeManager}
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
