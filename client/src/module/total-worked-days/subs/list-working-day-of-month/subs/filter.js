import { Select } from "antd";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { TypeKeyAtom } from "../recoil";

const FilterComponent = () => {
  const typeOption = [
    { value: 0, label: "Ngày làm việc hợp lệ" },
    { value: 1, label: "Ngày làm việc không hợp lệ" },
  ];

  const setTypeKey = useSetRecoilState(TypeKeyAtom);

  const onChangeType = useCallback((value) => setTypeKey(value), [setTypeKey]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        margin: "16px 0",
      }}
    >
      <Select
        placeholder="Lọc theo loại ngày làm việc"
        options={typeOption}
        onChange={onChangeType}
        allowClear
      />
    </div>
  );
};

export default FilterComponent;
