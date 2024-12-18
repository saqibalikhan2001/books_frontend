import { useEffect, useState } from "react";
import { Timeline, Typography } from "antd";
import { useAxios } from "app/Hooks";
import { getDateAndTime } from "utils";

const History = ({ url }: { url: string }) => {
  const [activity, setActivity] = useState([]);
  const { callAxios } = useAxios();
  useEffect(() => {
    callAxios({
      url: url,
    }).then((res: any) => {
      setActivity(res);
    });
    //eslint-disable-next-line
  }, [url]);
  return (
    <>
      <Timeline mode="left">
        {activity?.map(
          (item: {
            id: number;
            created_at: string;
            description: string;
            creator: string;
            time: string;
          }) => (
            <Timeline.Item key={item.id} label={getDateAndTime(item.created_at)}>
              {item.description}
              <br />
              <Typography.Text style={{ color: "gray" }}>By {item.creator}</Typography.Text>
            </Timeline.Item>
          )
        ) || []}
      </Timeline>
    </>
  );
};

export default History;
