/**@format */

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Col, Divider, Image, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import { endpoints } from "static";
import { useAxios, useBool } from "app/Hooks";
import { Icons, Spinner } from "app/shared";
import {
  capitalize,
  getKeyFromSS,
  // handleTabChange,
  handletoggle,
  getFullDate,
  getSubTotalForDetails,
} from "utils";
import { DetailPageProps, RecrringBillDetail } from "./Types";

const { VscClose } = Icons;
const { Title, Text } = Typography;
const { RECURRING_BILL } = endpoints;

const DetailPage = ({
  detail,
  deleteItem,
  // refetchBills,
  dataLength = 0,
  handleFullScreen,
}: DetailPageProps) => {
  const { callAxios } = useAxios();
  // const tabkey = getKeyFromSS("tab_key");
  const [loader, setLoader] = useState(true);
  const { curr_id } = JSON.parse(getKeyFromSS("obj"));
  const [details, setDetails] = useState<RecrringBillDetail>();
  const {
    bool: fetchList,
    // toggle: refetchBillPayments
  } = useBool();

  useEffect(() => {
    if ((!deleteItem || (deleteItem && dataLength > 1)) && details?.bill_info?.id !== curr_id) {
      callAxios({
        url: `${RECURRING_BILL}/${curr_id || detail?.id}`,
      }).then((res) => {
        setDetails(res);
        setLoader(false);
      });
    }
    //eslint-disable-next-line
  }, [detail?.id, fetchList, deleteItem, dataLength, curr_id]);

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
        title: "Warehouse",
        dataIndex: "warehouses",
        width: 80,
        ellipsis: true,
        render: (warehouse: { name: string }) => <Text>{warehouse?.name}</Text>,
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
        width: 50,
        ellipsis: true,
        render: (rate: number) => (
          <Statistic
            value={rate || 0}
            valueStyle={{ fontSize: "14px" }}
            prefix={details?.base_currency?.symbol}
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
            prefix={details?.base_currency?.symbol}
          />
        ),
      },
    ],
    [details?.base_currency?.symbol]
  );

  // const memoizeTabs = useMemo(
  //   () => [
  //     {
  //       key: "1",
  //       label: "History",
  //       children: (
  //         <>
  //           {details && Object.keys(details).length > 0 && (
  //             <History url={`${RECURRING_BILL}/${details?.bill_info?.id}${ACTIVITY_LOG}`} />
  //           )}
  //         </>
  //       ),
  //     },
  //     {
  //       key: "2",
  //       label: "Payments",
  //       children: (
  //         <>
  //           {/* {details && Object.keys(details).length > 0 && (
  //             <Payment
  //               detail={details}
  //               fetchList={fetchList}
  //               refetchBills={refetchBills}
  //               refetchBillPayments={refetchBillPayments}
  //               url={`${BILLS}/${details?.bill_info?.id}${PAYMENT_RECORDS}`}
  //             />
  //           )} */}
  //         </>
  //       ),
  //     },
  //   ],
  //   //eslint-disable-next-line
  //   [details]
  // );
  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          <PageHeader
            title={capitalize(details?.bill_info?.profile_name)}
            subTitle={
              <Tag color={details?.bill_info?.status === "draft" ? "red" : "green"}>
                {capitalize(details?.bill_info?.status)}
              </Tag>
            }
            extra={[
              <VscClose size={20} key="close" onClick={() => handletoggle(handleFullScreen)} />,
            ]}
            // footer={
            //   <>
            //     <Tabs
            //       defaultActiveKey={tabkey || "1"}
            //       items={memoizeTabs}
            //       onChange={handleTabChange}
            //     />
            //   </>
            // }
          />
          <Divider />
          <Row>
            <Col offset={1}>
              <Title level={4} style={{ color: "green" }}>
                Recurring BILL DETAILS
              </Title>
              <Title level={5}>{details?.bill_info?.vendor?.display_name}</Title>
              <Title level={5}>Bill No. {details?.bill_info?.bill_no}</Title>
              <Tag color={details?.bill_info?.status === "draft" ? "red" : "green"}>
                {capitalize(details?.bill_info?.status)}
              </Tag>
            </Col>
            <Col offset={5} span={10}>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    Start Date
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "143px" }}>
                  <Text>{getFullDate(details?.bill_info?.start_date)}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    End Date
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "148px" }}>
                  <Text>{getFullDate(details?.bill_info?.end_date)}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    Created By
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "138px" }}>
                  <Text>{capitalize(details?.bill_info?.bill_created_by?.name)}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    Total
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "180px" }}>
                  <Text>{details?.bill_info?.total}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    Balance Due
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "130px" }}>
                  <Text>{details?.bill_info?.balance_due}</Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col offset={1}>
              <Table
                bordered
                rowKey="id"
                pagination={false}
                columns={memoColumns}
                style={{ marginTop: "8px" }}
                dataSource={details?.bill_info?.bill_item_details}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col offset={16}>
              <Row>
                <Col>
                  <Typography>Sub Total</Typography>
                  <Typography>Adjustment</Typography>
                  <Typography>Total</Typography>
                  <Typography>Payment Made</Typography>
                </Col>
                <Col>
                  <Statistic
                    style={{ paddingLeft: "95px" }}
                    valueStyle={{ fontSize: "15px" }}
                    prefix={details?.base_currency?.symbol}
                    value={getSubTotalForDetails(details?.bill_info?.bill_item_details) || 0}
                  />
                  <Statistic
                    style={{ paddingLeft: "95px" }}
                    valueStyle={{ fontSize: "15px" }}
                    prefix={details?.base_currency?.symbol}
                    value={details?.bill_info?.adjustment || 0}
                  />
                  <Statistic
                    style={{ paddingLeft: "95px" }}
                    valueStyle={{ fontSize: "15px" }}
                    value={details?.bill_info?.total || 0}
                    prefix={details?.base_currency?.symbol}
                  />
                  <Statistic
                    style={{ paddingLeft: "95px" }}
                    valueStyle={{ fontSize: "15px" }}
                    value={details?.bill_info?.total || 0}
                    prefix={details?.base_currency?.symbol}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col offset={16}>
              <Typography>Balance Due</Typography>
            </Col>
            <Col offset={3}>
              <Statistic
                value={details?.bill_info?.balance_due}
                prefix={details?.base_currency?.symbol}
                valueStyle={{ fontSize: 15, paddingLeft: 23 }}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default DetailPage;
