/** @format */

import { useMemo } from "react";
import { Table, Divider } from "antd";
import { getFullDate } from "utils";
// import { useAxios } from "app/Hooks";
import {
  Labels,
  // endpoints,
} from "static";

// const { CUSTOMERS_STATEMENT } = endpoints;
const { LINKS, TRANSACTION } = Labels;

const Attachment = () => {
  // const [attachment, setAttachment] = useState([]);
  // const { callAxios } = useAxios();
  // useEffect(() => {
  //     callAxios({
  //       url: `${url}${CUSTOMERS_STATEMENT}?starting_date`,
  //     }).then((res: any) => {
  //         setAttachment(res);
  //     });
  //     //eslint-disable-next-line
  // }, [url]);


  const memoColumns = useMemo(
    () => [
      {
        title: LINKS,
        dataIndex: "links",
        key: LINKS,
        width: 90,
        ellipsis: true,
        render: (date: string) => getFullDate(date),
      },
      {
        title: TRANSACTION,
        dataIndex: "transaction",
        key: TRANSACTION,
        width: 103,
        ellipsis: true,
      },
    ],
    []
  );
  return (
    <>
      <Divider style={{ borderWidth: 1, borderColor: "black", margin: "4px 0 5px 0" }} />

      <Table bordered rowKey="key" pagination={false} columns={memoColumns} dataSource={[]} />
    </>
  );
};
export default Attachment;
