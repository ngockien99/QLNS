import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Select, Space } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import {
  EndDateKeyAtom,
  ManagerKeyAtom,
  MixKeyAtom,
  StartDateKeyAtom,
  TypeKeyAtom,
} from "../recoil";

const { RangePicker } = DatePicker;

const FilterComponent = () => {
  const managerList = useRecoilValue(ListUserAtom);
  const typeOption = [
    { value: 0, label: "Khen thưởng" },
    { value: 1, label: "Kỷ luật" },
  ];

  const setManagerKey = useSetRecoilState(ManagerKeyAtom);
  const setMixKey = useSetRecoilState(MixKeyAtom);
  const setTypeKey = useSetRecoilState(TypeKeyAtom);
  const setEndDateKey = useSetRecoilState(EndDateKeyAtom);
  const setStartDateKey = useSetRecoilState(StartDateKeyAtom);

  const onChangeType = useCallback((value) => setTypeKey(value), [setTypeKey]);
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

  const onChangeMix = useCallback(
    (e) => {
      const value = e?.target?.value;
      if (!!value?.trim()) {
        setMixKey(value);
      }
    },
    [setMixKey]
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
          placeholder="Lọc theo loại"
          options={typeOption}
          onChange={onChangeType}
        />
        <Select
          placeholder="Lọc theo tên nhân viên"
          options={managerList}
          onChange={onChangeManager}
        />
        <RangePicker
          format="DD/MM/YYYY"
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          onChange={onChangeRangerDate}
        />
      </Space>

      <Input
        placeholder="Tìm kiếm...."
        enterButton=""
        onChange={onChangeMix}
        suffix={
          <SearchOutlined
            style={{
              fontSize: 16,
              color: "#1677ff",
            }}
          />
        }
        style={{
          width: 360,
        }}
      />
    </div>
  );
};

export default FilterComponent;
