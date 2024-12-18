/** @format */

import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import {
  Col,
  Row,
  Tag,
  Tabs,
  Table,
  Space,
  Image,
  Divider,
  Dropdown,
  MenuProps,
  Statistic,
  Typography,
} from "antd";
import { endpoints } from "static";
import POBill from "./POBill/Bill";
import { useAxios, useBool } from "app/Hooks";
import { History, Icons, Spinner, Toast } from "app/shared";
import { PODetailProps, PurchaseOrderDetailPageProps } from "./Types";
import {
  capitalize,
  getFullDate,
  getKeyFromSS,
  handletoggle,
  handleTabChange,
  getSubTotalForDetails,
} from "utils";
// import POReceive from "./POReceive/Receive";    Commented for purpose

const { VscClose, DownOutlined } = Icons;
const { Title, Text } = Typography;

const { PURCHASE_ORDERS, ACTIVITY, STATUS, ISSUED } = endpoints;

const DetailPage = ({
  detail,
  refetchPO,
  handleFullScreen,
  deleteItem,
  dataLength = 0,
}: PurchaseOrderDetailPageProps) => {
  const { callAxios } = useAxios();
  const tabkey = getKeyFromSS("tab_key");
  const [loader, setLoader] = useState(true);
  const { curr_id } = JSON.parse(getKeyFromSS("obj"));
  const [details, setDetails] = useState<PODetailProps>();
  const { bool: fetchList, setTrue: refetchBills, setFalse } = useBool();

  useLayoutEffect(() => {
    if (fetchList || ((!deleteItem || (deleteItem && dataLength > 1)) && details?.id !== curr_id)) {
      callAxios({
        url: `${PURCHASE_ORDERS}/${detail?.id || curr_id}`,
      }).then((res) => {
        setDetails(res);
        setLoader(false);
        setFalse();
      });
    }
    //eslint-disable-next-line
  }, [detail?.id, fetchList, curr_id, deleteItem, dataLength]); // use fetchList instead of bool if need be

  const memoColumns = useMemo(
    () => [
      {
        title: "Items",
        dataIndex: "",
        width: 130,
        ellipsis: true,
        render: (props: { item_name: string }) => (
          <Space>
            <Image
              style={{ width: 30 }}
              onClick={(e) => e.stopPropagation()}
              src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
              fallback="https://cdn-icons-png.flaticon.com/512/456/456283.png"
            />
            <Text>{props.item_name}</Text>
          </Space>
        ),
      },
      {
        title: "Account",
        dataIndex: "account",
        width: 60,
        ellipsis: true,
        render: (account: any) => <Text>{account?.title}</Text>,
      },
      {
        title: "Qty",
        dataIndex: "quantity",
        width: 30,
        ellipsis: true,
      },
      {
        title: "Price",
        dataIndex: "rate",
        width: 40,
        ellipsis: true,
        render: (rate: number) => (
          <Statistic
            value={rate || 0}
            valueStyle={{ fontSize: "14px" }}
            prefix={details?.currency?.symbol}
          />
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        width: 50,
        ellipsis: true,
        render: (amount: number) => (
          <Statistic
            value={amount || 0}
            valueStyle={{ fontSize: "14px" }}
            prefix={details?.currency?.symbol}
          />
        ),
      },
    ],
    [details?.currency?.symbol]
  );

  const MarkAsIssued = useCallback(
    () =>
      callAxios({
        url: `${PURCHASE_ORDERS}/${details?.id}${STATUS}${ISSUED}`,
        method: "put",
        data: details,
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetchPO();
          refetchBills(); // use refetch if need be
        }
      }),
    //eslint-disable-next-line
    [details, refetchPO, refetchBills]
  );

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "0",
        onClick: MarkAsIssued,
        label: "Mark as Issued",
        disabled: details?.status === "issued",
      },
    ],
    //eslint-disable-next-line
    [details?.status, MarkAsIssued]
  );

  const memoizeTabs = useMemo(
    () => [
      {
        key: "1",
        label: "History",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <History url={`${PURCHASE_ORDERS}/${details?.id}${ACTIVITY}`} />
            )}
          </>
        ),
      },
      // Commented for purpose
      // {
      //   key: "2",
      //   label: "Receives",
      //   children: (
      //     <>
      //       {details && Object.keys(details).length > 0 && (
      //         <POReceive url={`${PURCHASE_ORDERS}/${details?.id}`} detail={details} />
      //       )}
      //     </>
      //   ),
      // },
      {
        key: "3",
        label: "Bills",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <POBill
                POdetail={details}
                refetchPO={refetchPO}
                fetchList={fetchList}
                refetchBills={refetchBills}
                url={`${PURCHASE_ORDERS}/${details?.id}`}
              />
            )}
          </>
        ),
      },
    ],
    [details, fetchList, refetchBills, refetchPO]
  );
  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          <PageHeader
            title={details?.purchase_order_no}
            tags={
              <Dropdown menu={{ items }} trigger={["click"]}>
                <DownOutlined />
              </Dropdown>
            }
            extra={[
              <VscClose size={20} key="close" onClick={() => handletoggle(handleFullScreen)} />,
            ]}
            footer={
              <>
                <Tabs
                  items={memoizeTabs}
                  onChange={handleTabChange}
                  defaultActiveKey={tabkey || "0"}
                />
              </>
            }
          />
          <Divider />
          <Row>
            <Col offset={1}>
              <Title level={4} style={{ color: "green" }}>
                PURCHASE ORDER
              </Title>
              <Title level={5}>{details?.vendor?.display_name}</Title>
              <Title level={5}>Purchase Order No. {details?.purchase_order_no}</Title>
              <Tag color={details?.status === "draft" ? "red" : "green"}>
                {capitalize(details?.status)}
              </Tag>
            </Col>
            <Col offset={7}>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    Order Date
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "190px" }}>
                  <Text>{getFullDate(details?.order_date)}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    Delivery Date
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "170px" }}>
                  <Text>{getFullDate(details?.expected_delivery_date)}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ paddingTop: "20px" }}>
            <Col offset={1}>
              <Table
                bordered
                rowKey="id"
                pagination={false}
                columns={memoColumns}
                style={{ marginTop: "8px" }}
                dataSource={details?.purchase_order_item_details}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col offset={16}>
              <Row>
                <Col>
                  <Typography>Sub Total</Typography>
                  <Typography>Adjustment</Typography>
                </Col>
                <Col>
                  <Statistic
                    style={{ paddingLeft: "105px" }}
                    valueStyle={{ fontSize: "15px" }}
                    prefix={details?.currency?.symbol}
                    value={getSubTotalForDetails(details?.purchase_order_item_details) || 0}
                  />
                  <Statistic
                    style={{ paddingLeft: "105px" }}
                    value={details?.adjustment || 0}
                    valueStyle={{ fontSize: "15px" }}
                    prefix={details?.currency?.symbol}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col offset={16}>
              <Typography>Total</Typography>
            </Col>
            <Col offset={4}>
              <Statistic
                value={details?.total}
                prefix={details?.currency?.symbol}
                valueStyle={{ fontSize: "15px", paddingLeft: 30 }}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default DetailPage;
