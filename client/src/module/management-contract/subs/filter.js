import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import { EndDateKeyAtom, ManagerKeyAtom, StartDateKeyAtom } from "../recoil";

const { RangePicker } = DatePicker;

const FilterComponent = () => {
  const managerList = useRecoilValue(ListUserAtom);
  const setManagerKey = useSetRecoilState(ManagerKeyAtom);
  const setEndDateKey = useSetRecoilState(EndDateKeyAtom);
  const setStartDateKey = useSetRecoilState(StartDateKeyAtom);

  const onChangeManager = useCallback(
    (value) => setManagerKey(value),
    [setManagerKey]
  );

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
          placeholder="Lọc theo tên nhân viên"
          options={managerList}
          onChange={onChangeManager}
          allowClear
        />
        <RangePicker
          format="DD/MM/YYYY"
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          onChange={onChangeRangerDate}
          allowClear
        />
      </Space>
    </div>
  );
};

export default FilterComponent;
