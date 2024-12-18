/**@format */

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Divider, Tabs, Tag } from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { DetailPageProps } from "./Types";
import { History, Icons } from "app/shared";
import {
  capitalize,
  getKeyFromSS,
  getIntValueFromSS,
  handleTabChange,
  handletoggle,
} from "utils";

const { VscClose } = Icons;
const { PACKAGES, ACTIVITY } = endpoints;

const DetailPage = ({ detail, handleFullScreen }: DetailPageProps) => {
  const { callAxios } = useAxios();
  const tabkey = getKeyFromSS("tab_key");
  const package_id = getIntValueFromSS("id");
  const [details, setDetails] = useState<any>();

  useEffect(() => {
    callAxios({
      url: `${PACKAGES}/${package_id || detail?.id}`,
    }).then((res: any) => {
      setDetails(res);
    });
    //eslint-disable-next-line
  }, [detail?.id]);

  const memoizeTabs = useMemo(
    () => [
      {
        key: "1",
        label: "History",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <History url={`${PACKAGES}/${details?.id}${ACTIVITY}`} />
            )}
            ,
          </>
        ),
      },
    ],
    //eslint-disable-next-line
    [details]
  );

  return (
    <>
      <PageHeader
        title={details?.package_no}
        subTitle={<Tag>{capitalize(details?.status)}</Tag>}
        extra={[
          <VscClose
            size={20}
            key="close"
            onClick={() => handletoggle(handleFullScreen)}
          />,
        ]}
        footer={
          <>
            <Divider />
            <Tabs
              defaultActiveKey={tabkey || "1"}
              items={memoizeTabs}
              onChange={handleTabChange}
            />
            <Divider />
          </>
        }
      />
    </>
  );
};

export default DetailPage;
