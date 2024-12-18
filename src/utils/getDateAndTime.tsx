import { Typography } from "antd";
import dayjs from "dayjs";
export const getDateAndTime = (createdAt: string) => {
  const date = dayjs(createdAt).format("YYYY-MM-DD");
  const time = dayjs(createdAt).format("hh:mm:ss a");
  return (
    <>
      <Typography.Text>{date}</Typography.Text>
      <br />
      <Typography.Text style={{ color: "gray" }}>{time}</Typography.Text>
    </>
  );
};
