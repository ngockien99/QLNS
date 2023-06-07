import { Steps } from "antd";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { IsEditAtom, StepAtom } from "../recoil";

const StepComponent = () => {
  const currenStep = useRecoilValue(StepAtom);
  const isEdit = useRecoilValue(IsEditAtom);
  const items = useMemo(
    () => [
      {
        description: `${isEdit ? "Sửa" : "Thêm"} thông tin cá nhân`,
        title: "Bước 1",
      },
      {
        description: `${isEdit ? "Sửa" : "Thêm"}  thông tin làm việc`,
        title: "Bước 2",
      },
      {
        description: `${isEdit ? "Sửa" : "Thêm"}  thông tin lương thưởng`,
        title: "Bước 3",
      },
      {
        description: `${isEdit ? "Sửa" : "Thêm"}  quá trình đào tạo`,
        title: "Bước 4",
      },
    ],
    [isEdit]
  );

  return (
    <Steps
      current={currenStep}
      labelPlacement="vertical"
      items={items}
      size="small"
    />
  );
};

export default StepComponent;
