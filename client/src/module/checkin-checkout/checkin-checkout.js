import { Button, Space, message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import API from "util/api";

const CheckInCheckOut = () => {
  const [disabledCheckIn, setDisableCheckIn] = useState(false);
  const [disabledCheckOut, setDisableCheckOut] = useState(false);
  const { mutate: checkInMutate, isLoading: checkInLoading } = useMutation(
    () => {
      const config = { url: "checkin", method: "post" };
      return API.request(config);
    },
    {
      onSuccess: () => {
        message.success("Bạn đã chấm công vào thành công!");
        localStorage.setItem(
          `${dayjs().format("DD/MM/YYYY")}-checkin`,
          "checked"
        );
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
        localStorage.setItem(
          `${dayjs().format("DD/MM/YYYY")}-checkout`,
          "checked"
        );
      },
      onError: (reason) => {
        message.error(reason);
      },
    }
  );

  const checkedIn = localStorage.getItem(
    `${dayjs().format("DD/MM/YYYY")}-checkin`
  );
  const checkedOut = localStorage.getItem(
    `${dayjs().format("DD/MM/YYYY")}-checkout`
  );

  useEffect(() => {
    if (checkedIn !== null) {
      setDisableCheckIn(true);
    }
  }, [checkedIn]);

  useEffect(() => {
    if (checkedOut !== null) {
      setDisableCheckOut(true);
    }
  }, [checkedOut]);

  return (
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
  );
};

export default CheckInCheckOut;
