/**@format */

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import {
  Row,
  Tag,
  Col,
  // Tabs,
  Table,
  Divider,
  // Dropdown,
  Statistic,
  Typography,
  Space,
  Image,
} from "antd";
import { endpoints } from "static";
import { DetailPageProps } from "./Types";
import { useAxios, useBool } from "app/Hooks";
import { Icons, Spinner } from "app/shared";
import {
  capitalize,
  getFullDate,
  handletoggle,
  getKeyFromSS,
  // handleTabChange,
  getSubTotalForDetails,
} from "utils";

const { VscClose } = Icons;
const { Text, Title } = Typography;
const { RECURRING_INVOICE } = endpoints;

const DetailPage = ({ detail, deleteItem, dataLength = 0, handleFullScreen }: DetailPageProps) => {
  const { callAxios } = useAxios();
  const { bool: fetchList } = useBool();
  // const tabkey = getKeyFromSS("tab_key");
  const [loader, setLoader] = useState(true);
  const { curr_id } = JSON.parse(getKeyFromSS("obj"));
  const [details, setDetails] = useState<any>();

  useEffect(() => {
    if ((!deleteItem || (deleteItem && dataLength > 1)) && details?.invoice_info?.id !== curr_id) {
      callAxios({
        url: `${RECURRING_INVOICE}/${curr_id || detail?.id}`,
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
        width: 150,
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
        title: "Tax",
        dataIndex: "tax",
        width: 30,
        ellipsis: true,
        render: (tax: { name: string; rate: number }) => (
          <Statistic
            value={tax?.rate || 0}
            suffix={tax && `(${tax.name})`}
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
  //             <History
  //               url={`${RECURRING_INVOICE}/${details?.invoice_info?.id}${ACTIVITY_LOG}`}
  //             />
  //           )}
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
            title={capitalize(details?.invoice_info?.profile_name)}
            subTitle={
              <Tag color={details?.invoice_info?.status === "draft" ? "red" : "green"}>
                {capitalize(details?.invoice_info?.status)}
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
          <Row>
            <Col offset={1}>
              <Title level={4} style={{ color: "green" }}>
                INOVICE
              </Title>
              <Title level={5}>{details?.invoice_info?.customer?.display_name}</Title>
              <Title level={5}>Invoice No. {details?.invoice_info?.invoice_no}</Title>
              <Tag color={details?.invoice_info?.status === "draft" ? "red" : "green"}>
                {capitalize(details?.invoice_info?.status)}
              </Tag>
            </Col>
            <Col offset={7}>
              <Row>
                <Col>
                  <Title level={5}>Start Date</Title>
                </Col>
                <Col style={{ paddingLeft: "200px", marginTop: "30px" }}>
                  <Text>{getFullDate(details?.invoice_info?.start_date)}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5}>End Date</Title>
                </Col>
                <Col style={{ paddingLeft: "208px", marginTop: "30px" }}>
                  <Text>{getFullDate(details?.invoice_info?.end_date)}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5}>Order No</Title>
                </Col>
                <Col style={{ paddingLeft: "208px", marginTop: "30px" }}>
                  <Text>{details?.invoice_info?.order_no}</Text>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row style={{ paddingTop: "30px" }}>
            <Col offset={1}>
              <Table
                bordered
                rowKey="id"
                pagination={false}
                columns={memoColumns}
                style={{ marginTop: "8px" }}
                dataSource={details?.invoice_info?.invoice_details}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            {/* <Col offset={1}>
              <Title level={5}>Total Items: {details?.invoice_info?.invoice_details?.length}</Title>
            </Col> */}
            <Col offset={16}>
              <Row>
                <Col>
                  <Typography>Sub Total</Typography>
                  <Typography>Adjustment</Typography>
                  <Typography>Shipping Charges</Typography>
                </Col>
                <Col>
                  <Statistic
                    valueStyle={{ fontSize: "15px" }}
                    style={{ paddingLeft: "70px" }}
                    value={getSubTotalForDetails(details?.invoice_info?.invoice_details) || 0}
                    prefix={details?.base_currency?.symbol}
                  />
                  <Statistic
                    valueStyle={{ fontSize: "15px" }}
                    style={{ paddingLeft: "70px" }}
                    value={details?.invoice_info?.adjustment || 0}
                    prefix={details?.base_currency?.symbol}
                  />
                  <Statistic
                    valueStyle={{ fontSize: "15px" }}
                    style={{ paddingLeft: "70px" }}
                    value={details?.invoice_info?.shipping_charge || 0}
                    prefix={details?.base_currency?.symbol}
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
                valueStyle={{ fontSize: "15px" }}
                style={{ paddingLeft: "24px" }}
                value={details?.invoice_info?.total}
                prefix={details?.base_currency?.symbol}
              />
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col offset={1}>
              <Title level={5}>Terms & Conditions</Title>
              <Typography>{details?.invoice_info?.terms_and_condition}</Typography>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default DetailPage;
