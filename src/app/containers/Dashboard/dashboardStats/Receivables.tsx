//@ts-nocheck
import { useEffect, useLayoutEffect, useState } from "react";
import { Form, Card, Typography } from "antd";
import { useAxios } from "app/Hooks";
import { getFullDate } from "utils";
import { StatsHeader } from "./StatsHeader";
import { ProgressBar } from "../ProgressChart";

export const Receivables = ({ preferences }: any) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const date = Form.useWatch("date_range", form);
  const custom_ranges = Form.useWatch("custom_ranges", form);

  useLayoutEffect(() => {
    preferences && form.setFieldValue("date_range", preferences);
    //eslint-disable-next-line
  }, [form, preferences]);

  useEffect(() => {
    setLoading(true);
    let url;
    if (date && date === "custom" && custom_ranges) {
      url = `/dashboard/receive_ables/${`${date}?starting_date=${getFullDate(
        custom_ranges[0]
      )} 00:00:00&ending_date=${getFullDate(custom_ranges[1])} 23:59:59`}`;
    } else if (date && date !== "custom") url = `/dashboard/receive_ables/${date}`;
    if (url) {
      callAxios({ url }).then((res) => {
        if (res) {
          setData(res);
          setLoading(false);
        }
      });
    }
  }, [date, custom_ranges]);
  return (
    <Card className="card-layout">
      <StatsHeader
        tittle={
          <>
            Receivables{" "}
            <span>{data ? `( ${data?.currency} ${data?.receive_ables.toFixed(2)} )` : ""}</span>
          </>
        }
        form={form}
      />
      <ProgressBar subtitle={"invoices"} data={data} loading={loading} dueColor="#1677ff" />
    </Card>
  );
};
