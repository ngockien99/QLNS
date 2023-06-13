import { Button, Space, message } from "antd";
import imageClock from "assets/image/clock.png";
import { useState } from "react";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "state-management/recoil";
import API from "util/api";
import Clock from "./subs/clock";

const CheckInCheckOut = () => {
  const userInfo = useRecoilValue(UserInfoAtom);
  const { checkin, checkout } = userInfo;
  const [disabledCheckIn, setDisableCheckIn] = useState(checkin);
  const [disabledCheckOut, setDisableCheckOut] = useState(checkout);
  const { mutate: checkInMutate, isLoading: checkInLoading } = useMutation(
    () => {
      const config = { url: "checkin", method: "post" };
      return API.request(config);
    },
    {
      onSuccess: () => {
        message.success("Bạn đã chấm công vào thành công!");
        setDisableCheckIn(true);
      },
      onError: (reason) => {
        message.error(reason);
      },
    }
  );
  const { mutate: checkOutMutate, isLoading: checkOutLoading } = useMutation(
    () => {
      const config = { url: "checkout", method: "post" };
      return API.request(config);
    },
    {
      onSuccess: () => {
        message.success("Bạn đã chấm công về thành công");
        setDisableCheckOut(true);
      },
      onError: (reason) => {
        message.error(reason);
      },
    }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Space>
        <img src={imageClock} width={40} height={40} alt="" />
        <Clock />
      </Space>
      {!disabledCheckIn && !disabledCheckOut && (
        <span>{`Cảm ơn bạn đã tham gia chấm công trước khi vào làm việc, chúc bạn có một ngày làm việc hiệu quả.... 🚀🚀🚀🚀`}</span>
      )}
      {((!disabledCheckOut && disabledCheckIn) || disabledCheckOut) && (
        <span>{`Cảm ơn sự cố gắng của bạn trong ngày làm việc vừa qua, chúc bạn có một buổi tối vui vẻ.... 🙆‍♂️🙆‍♂️🙆‍♂️`}</span>
      )}
      <Space>
        <Button
          onClick={checkInMutate}
          loading={checkInLoading}
          disabled={disabledCheckIn}
          type="primary"
        >
          CheckIn
        </Button>
        <Button
          onClick={checkOutMutate}
          loading={checkOutLoading}
          disabled={disabledCheckOut}
        >
          CheckOut
        </Button>
      </Space>
    </div>
  );
};

export default CheckInCheckOut;
