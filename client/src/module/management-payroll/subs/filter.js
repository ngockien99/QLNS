import { DatePicker, Select, Space } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import { DateKeyAtom, ManagerKeyAtom } from "../recoil";

const FilterComponent = () => {
  const managerList = useRecoilValue(ListUserAtom);
  const setManagerKey = useSetRecoilState(ManagerKeyAtom);
  const setDateKey = useSetRecoilState(DateKeyAtom);

  const onChangeManager = useCallback(
    (value) => setManagerKey(value),
    [setManagerKey]
  );

  const onChangeDate = useCallback(
    (date) => {
      if (date) {
        setDateKey(dayjs(date).format("YYYY-MM"));
      }
    },
    [setDateKey]
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
        <DatePicker
          format="MM/YYYY"
          placeholder="Lọc theo tháng"
          onChange={onChangeDate}
        />
      </Space>
    </div>
  );
};

export default FilterComponent;
