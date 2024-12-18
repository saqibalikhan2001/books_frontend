import { Result } from "antd";
import { StatusProps } from "./types";

export const Status = ({ title, subTitle, status, extra }: StatusProps) => (
  <Result status={status} title={title} subTitle={subTitle} extra={[extra]} />
);
