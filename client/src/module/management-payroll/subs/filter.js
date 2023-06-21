import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Input, Select, Space } from "antd";
import dayjs from "dayjs";
import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListDepartmentAtom, ListUserAtom } from "state-management/recoil";
import {
  DateKeyAtom,
  DepartmentKeyAtom,
  ManagerKeyAtom,
  MixKeyAtom,
} from "../recoil";

const FilterComponent = () => {
  const managerList = useRecoilValue(ListUserAtom);
  const departmentList = useRecoilValue(ListDepartmentAtom);

  const setManagerKey = useSetRecoilState(ManagerKeyAtom);
  const setMixKey = useSetRecoilState(MixKeyAtom);
  const setDateKey = useSetRecoilState(DateKeyAtom);
  const setDepartmentKey = useSetRecoilState(DepartmentKeyAtom);

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

  const onChangeDepartment = useCallback(
    (value) => {
      setDepartmentKey(value);
    },
    [setDepartmentKey]
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
          placeholder="Lọc theo tên nhân viên"
          options={managerList}
          onChange={onChangeManager}
        />
        <Select
          placeholder="Lọc theo phòng ban"
          options={departmentList}
          onChange={onChangeDepartment}
        />
        <DatePicker
          format="MM/YYYY"
          placeholder="Lọc theo tháng"
          onChange={onChangeDate}
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
