import dayjs from "dayjs";
import { useState } from "react";

const Clock = () => {
  let time = dayjs().format("HH:mm:ss DD/MM/YYYY");
  const [ctime, setTime] = useState(time);
  const UpdateTime = () => {
    time = dayjs().format("HH:mm:ss DD/MM/YYYY");
    setTime(time);
  };
  setInterval(UpdateTime);
  return <h1>{ctime}</h1>;
};

export default Clock;
