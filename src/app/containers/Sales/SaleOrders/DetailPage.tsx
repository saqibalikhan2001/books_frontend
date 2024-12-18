import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Col, Divider, Row, Image, Space, Statistic, Table, Tabs, Tag, Typography } from "antd";
import { endpoints } from "static";
import { useAxios, useBool } from "app/Hooks";
import SOInvoices from "./SOInvoice/Invoice";
import { History, Icons, Spinner } from "app/shared";
import { SalesOrderDetailPageProps, SODetailProps } from "./Types";
// import SOPackages from "./SOPackage/Package";  Commented for purpose
// import Attachment from "./Attachment/Attachment"; Comment temporary
import {
  capitalize,
  getFullDate,
  getKeyFromSS,
  handletoggle,
  handleTabChange,
  getSubTotalForDetails,
} from "utils";

const {
  //   TbEdit,
  VscClose,
  //   FaRegClone,
  //   GiConfirmed,
  //   AiOutlineMail,
  //   RiDeleteBinLine,
  //   AiOutlineFilePdf,
  //   AiOutlinePrinter,
} = Icons;

const { Title, Text } = Typography;
const { SALES_ORDERS, INVOICES, ACTIVITY } = endpoints;

const DetailPage = ({
  detail,
  refetchSO,
  deleteItem,
  dataLength = 0,
  handleFullScreen,
}: SalesOrderDetailPageProps) => {
  const { callAxios } = useAxios();
  const tabkey = getKeyFromSS("tab_key");
  const [loader, setLoader] = useState(true);
  const { curr_id } = JSON.parse(getKeyFromSS("obj"));
  const [details, setDetails] = useState<SODetailProps>();
  const { bool: fetchList, setTrue: refetchInvoices, setFalse } = useBool();

  useEffect(() => {
    if (fetchList || ((!deleteItem || (deleteItem && dataLength > 1)) && details?.id !== curr_id)) {
      callAxios({
        url: `${SALES_ORDERS}/${curr_id || detail?.id}`,
      }).then((res) => {
        setDetails(res);
        setLoader(false);
        setFalse();
      });
    } //eslint-disable-next-line
  }, [detail?.id, fetchList, curr_id, deleteItem, dataLength]);

  const memoColumns = useMemo(
    () => [
      {
        title: "Items",
        dataIndex: "",
        width: 100,
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
        width: 70,
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
        width: 40,
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
        width: 50,
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

  const memoizeTabs = useMemo(
    () => [
      {
        key: "1",
        label: "History",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <History url={`${SALES_ORDERS}/${details?.id}${ACTIVITY}`} />
            )}
          </>
        ),
      },
      // Commented for purpose
      // {
      //   key: "2",
      //   label: "Packages",
      //   children: (
      //     <>
      //       {details && Object.keys(details).length > 0 && (
      //         <SOPackages url={`${SALES_ORDERS}/${details?.id}${PACKAGES}`} detail={details} />
      //       )}
      //     </>
      //   ),
      // },
      {
        key: "3",
        label: "Invoices",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              <SOInvoices
                SOdetails={details}
                refetchSO={refetchSO}
                fetchList={fetchList}
                refetchInvoices={refetchInvoices}
                url={`${SALES_ORDERS}/${details?.id}${INVOICES}`}
              />
            )}
          </>
        ),
      },
      {
        key: "4",
        label: "Attachment",
        children: (
          <>
            {details && Object.keys(details).length > 0 && (
              // <Attachment url={``}/>
              <>Attachment in progress</>
            )}
          </>
        ),
      },
    ],
    [details, refetchInvoices, refetchSO, fetchList]
  );

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          <PageHeader
            title={details?.sales_order_no}
            subTitle={
              <Tag color={details?.status === "draft" ? "red" : "green"}>
                {capitalize(details?.status)}
              </Tag>
            }
            extra={[
              <VscClose size={20} key="close" onClick={() => handletoggle(handleFullScreen)} />,
              // <TbEdit key="edit" size={20} />,
              // <AiOutlineFilePdf key="pdf" size={20} />,
              // <AiOutlinePrinter key="print" size={20} />,
              // <AiOutlineMail key="mail" size={20} />,
              // <FaRegClone key="clone" size={20} />,
              // <RiDeleteBinLine key="del" size={20} />,
              // <Button key="1">+ Package</Button>,
              // <Button key="2">+ New</Button>,
            ]}
            footer={
              <>
                <Divider />
                <Tabs
                  defaultActiveKey={tabkey || "1"}
                  items={memoizeTabs}
                  onChange={handleTabChange}
                />
              </>
            }
          />
          <Divider />
          <Row>
            <Col offset={1}>
              <Title level={4} style={{ color: "green" }}>
                SALES ORDER
              </Title>
              <Title level={5}>{details?.display_name}</Title>
              <Title level={5}>Sales Order No. {details?.sales_order_no}</Title>
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
                <Col style={{ paddingLeft: "200px" }}>
                  <Text>{getFullDate(details?.order_date)}</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Title level={5} style={{ marginTop: 0 }}>
                    Expiry Date
                  </Title>
                </Col>
                <Col style={{ paddingLeft: "195px" }}>
                  <Text>{getFullDate(details?.expected_shipment_date)}</Text>
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
                dataSource={details?.sales_order_details}
              />
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col offset={1}>
              <Title level={5}>Total Items: {details?.sales_order_details?.length}</Title>
            </Col>
            <Col offset={16}>
              <Row>
                <Col>
                  <Typography>Sub Total</Typography>
                  <Typography>Adjustment</Typography>
                  <Typography>Shipping Charges</Typography>
                </Col>
                <Col>
                  <Statistic
                    style={{ paddingLeft: "80px" }}
                    valueStyle={{ fontSize: "15px" }}
                    prefix={details?.base_currency?.symbol}
                    value={getSubTotalForDetails(details?.sales_order_details) || 0}
                  />
                  <Statistic
                    style={{ paddingLeft: "80px" }}
                    value={details?.adjustment || 0}
                    valueStyle={{ fontSize: "15px" }}
                    prefix={details?.base_currency?.symbol}
                  />
                  <Statistic
                    style={{ paddingLeft: "80px" }}
                    valueStyle={{ fontSize: "15px" }}
                    value={details?.shipping_charge || 0}
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
                value={details?.total}
                valueStyle={{ fontSize: 15, paddingLeft: 35 }}
                prefix={details?.base_currency?.symbol}
              />
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col offset={1}>
              <Title level={5}>Terms & Conditions</Title>
              <Typography>{details?.terms_and_condition}</Typography>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default DetailPage;
