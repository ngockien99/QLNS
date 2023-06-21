import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space } from "antd";
import { useCallback } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ListUserAtom } from "state-management/recoil";
import { ManagerKeyAtom, MixKeyAtom, TypeKeyAtom } from "../recoil";

const FilterComponent = () => {
  const managerList = useRecoilValue(ListUserAtom);
  const typeOption = [
    { value: 0, label: "Đang hoạt động" },
    { value: 1, label: "Giải thể" },
  ];

  const setManagerKey = useSetRecoilState(ManagerKeyAtom);
  const setMixKey = useSetRecoilState(MixKeyAtom);
  const setTypeKey = useSetRecoilState(TypeKeyAtom);

  const onChangeType = useCallback((value) => setTypeKey(value), [setTypeKey]);
  const onChangeManager = useCallback(
    (value) => setManagerKey(value),
    [setManagerKey]
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
          placeholder="Lọc theo tên trưởng phòng"
          options={managerList}
          onChange={onChangeManager}
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
