import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space } from "antd";
import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  ListDepartmentAtom,
  ListPositionAtom,
  ListUserAtom,
} from "state-management/recoil";
import {
  DepartmentKeyAtom,
  ManagerKeyAtom,
  MixKeyAtom,
  PositionKeyAtom,
} from "../recoil";

const FilterComponent = () => {
  const managerList = useRecoilValue(ListUserAtom);
  const departmentList = useRecoilValue(ListDepartmentAtom);
  const positionList = useRecoilValue(ListPositionAtom);

  const setManagerKey = useSetRecoilState(ManagerKeyAtom);
  const setDepartmentKey = useSetRecoilState(DepartmentKeyAtom);
  const setPositionKey = useSetRecoilState(PositionKeyAtom);
  const setMixKey = useSetRecoilState(MixKeyAtom);

  const onChangeManager = useCallback(
    (value) => setManagerKey(value),
    [setManagerKey]
  );
  const onChangeDepartment = useCallback(
    (value) => setDepartmentKey(value),
    [setDepartmentKey]
  );
  const onChangePosition = useCallback(
    (value) => setPositionKey(value),
    [setPositionKey]
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
          placeholder="Lọc theo người quản lý"
          options={managerList}
          onChange={onChangeManager}
        />
        <Select
          placeholder="Lọc theo phòng ban"
          options={departmentList}
          onChange={onChangeDepartment}
        />
        <Select
          placeholder="Lọc theo vị trí"
          options={positionList}
          onChange={onChangePosition}
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
