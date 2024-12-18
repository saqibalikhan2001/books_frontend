/** @format */

import { useEffect, useMemo, useState } from "react";
import { Form, Table, Typography } from "antd";
import dayjs from "dayjs";
import { StatementProps } from "./Types";
import { endpoints, Labels } from "static";
import { TooltipX } from "app/shared/ToolTip";
import { useAxios, useStore } from "app/Hooks";
import { getFullDate, getOrganizationDate } from "utils";
import { Buttonx, DatePickerx, PdfViewer, Spinner } from "app/shared";

const { Title, Text } = Typography;
const todayDate = dayjs(new Date());

const { CUSTOMERS_STATEMENT } = endpoints;
const { DATE, TRANSACTION, DETAILS, AMOUNT, PAYMENTS, BALANCE } = Labels;

const Statement = ({
  url,
  name,
  setEmail,
  supplier,
  setIsDate,
  setUploading,
  isModal = false,
}: StatementProps) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  // const { toggle } = useBool();
  const { org_date_format } = useStore();
  const [loading, setLoading] = useState(true);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [statement, setStatement] = useState<any>();
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const [fromDate, setFromDate] = useState(dayjs(new Date()));

  const to = getFullDate(Form.useWatch("to", form));
  const from = getFullDate(Form.useWatch("from", form));

  useEffect(() => {
    callAxios({
      url: `${url}${CUSTOMERS_STATEMENT}?starting_date=${`${getFullDate(
        todayDate as any
      )} 00:00:00`}&ending_date=${`${getFullDate(todayDate as any)} 23:59:59`}`,
    }).then((res) => {
      setLoading(false);
      setStatement(res);
    });
    form.setFieldsValue({
      from: dayjs(getFullDate(todayDate as any)),
      to: dayjs(getFullDate(toDate as any)),
    });

    //eslint-disable-next-line
  }, [url, form]);

  const togglePdfModal = () => setPdfModal(!pdfModal);
  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (dayjs(date).startOf("day") > dayjs(toDate).startOf("day")) {
      form.setFieldValue("to", date);
    }
  };
  const handletoDateChange = (date) => {
    setToDate(date);
  };
  const pdfDownload = () => {
    setUploading(true);
    callAxios({
      url: `${url}/pdf?starting_date=${`${from} 00:00:00`}&ending_date=${`${to} 23:59:59`}&download=true`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res;
        element.download = `${name} .pdf`;
        element.click();
        setUploading(false);
      }
    });
  };

  const onPrint = () => {
    setPdfUrl(`${url}/pdf?starting_date=${`${from} 00:00:00`}&ending_date=${`${to} 23:59:59`}`);
    togglePdfModal();
  };

  const onSubmit = (values) => {
    setLoading(true);
    const from = getFullDate(values.from);
    const to = getFullDate(values.to);
    // toggle();
    callAxios({
      url: `${url}${CUSTOMERS_STATEMENT}?starting_date=${`${from} 00:00:00`}&ending_date=${`${to} 23:59:59`}`,
    }).then((res) => {
      // toggle();
      setStatement(res);
      setLoading(false);
    });
  };

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "date",
        key: DATE,
        width: 90,
        ellipsis: true,
        render: (date: string) => getOrganizationDate(date, org_date_format),
      },
      {
        title: TRANSACTION,
        dataIndex: "transaction",
        key: TRANSACTION,
        width: 103,
        ellipsis: true,
      },
      {
        title: DETAILS,
        dataIndex: "details",
        key: DETAILS,
        width: 90,
        ellipsis: true,
      },
      {
        title: AMOUNT,
        dataIndex: "",
        key: AMOUNT,
        width: 80,
        ellipsis: true,
        className: "text-right",
        render: (props: any) => (
          <Typography>
            <Text>{statement?.base_currency?.symbol}</Text>
            {parseFloat(props.total ?? 0)?.toFixed(2)}
          </Typography>
        ),
      },
      {
        title: PAYMENTS,
        dataIndex: "",
        key: PAYMENTS,
        width: 90,
        ellipsis: true,
        className: "text-right",
        render: (props: any) => (
          <Typography>
            <Text>{statement?.base_currency?.symbol}</Text>
            {parseFloat(props?.payments ?? 0)?.toFixed(2)}
          </Typography>
        ),
      },
      {
        title: BALANCE,
        dataIndex: "",
        key: BALANCE,
        width: 80,
        ellipsis: true,
        className: "text-right",
        render: (props: any) => (
          <Typography>
            <Text>{statement?.base_currency?.symbol}</Text>
            {parseFloat(props.balance ?? 0)?.toFixed(2)}
          </Typography>
        ),
      },
    ],
    [org_date_format, statement]
  );
  return (
    <>
      <div className="__report_tabs_align mb-30 customer-details __calander-fields-space">
        <Form form={form} onFinish={onSubmit} className="date_picker_form">
          <div className="flexbox  justify-content-between">
            <div className="form_group  resp-viewport--dynamics">
              <DatePickerx
                label="From"
                name="from"
                allowClear={false}
                disabled={isModal}
                format={org_date_format}
                disableDate={(current: any) => current && current > dayjs().endOf("day")}
                onChange={handleFromDateChange}
              />
            </div>
            <div className="form_group  resp-viewport--dynamics viewport--adjustments">
              <DatePickerx
                name="to"
                label="To"
                allowClear={false}
                disabled={isModal}
                disableDate={(current: any) =>
                  current &&
                  (current > dayjs().endOf("day") || current < dayjs(fromDate).startOf("day"))
                }
                format={org_date_format}
                onChange={handletoDateChange}
              />
            </div>
            <Buttonx
              // loading={bool}
              disabled={isModal}
              btnText="Run report"
              className="btn-primary h-36px ml-8 btn-report"
            />
          </div>
        </Form>
        {!isModal && (
          <div className="account_receipt d-flex">
            <TooltipX title="PDF">
              <img
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/pdf_icon.svg`}
                alt="pdf icon"
                onClick={pdfDownload}
                className="hover-effect"
              />
            </TooltipX>
            <TooltipX title="Print">
              <img
                alt="print icon"
                onClick={onPrint}
                className="hover-effect"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/print.svg`}
              />
            </TooltipX>
            <TooltipX title="Email">
              <img
                alt="Email icon"
                className="hover-effect"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/email.svg`}
                onClick={() => {
                  setIsDate({
                    to: to,
                    from: from,
                    url: true,
                  });
                  setEmail(true);
                }}
              />
            </TooltipX>
          </div>
        )}
      </div>
      {loading ? (
        <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />
      ) : (
        <div>
          <Typography.Title level={4} className="main_heading customer-heading">
            Statement Summary
          </Typography.Title>
          <div className="summary_list customer-summary">
            <div className="product_row w-100">
              <div className="product_key">
                <Title level={5}>Opening balance</Title>
              </div>
              <div className="product_value">
                <Text>
                  {statement?.base_currency?.symbol}
                  {parseFloat(statement?.openingBalance ?? 0).toFixed(2)}
                </Text>
              </div>
            </div>
            {!supplier && (
              <>
                <div className="product_row w-100">
                  <div className="product_key">
                    <Title level={5}>Total credit sales</Title>
                  </div>
                  <div className="product_value">
                    <Text>
                      {statement?.base_currency?.symbol}
                      {parseFloat(statement?.creditSales).toFixed(2)}
                    </Text>
                  </div>
                </div>
                <div className="product_row w-100 divider pb-5">
                  <div className="product_key">
                    <Title level={5}>Total credit notes</Title>
                  </div>
                  <div className="product_value">
                    <Text>
                      {statement?.base_currency?.symbol}
                      {parseFloat(statement?.creditNotes).toFixed(2)}
                    </Text>
                  </div>
                </div>
              </>
            )}
            <div className="customer-sales--main divider">
              <div className="product_row w-100 ">
                <div className="product_key">
                  <Title level={5}>{supplier ? "Net credit purchases" : "Net credit sales"}</Title>
                </div>
                <div className="product_value">
                  <Text>
                    {statement?.base_currency?.symbol}
                    {supplier
                      ? parseFloat(statement?.totalAmount ?? 0).toFixed(2)
                      : parseFloat(statement?.creditNetSales ?? 0).toFixed(2)}
                  </Text>
                </div>
              </div>
              <div className="product_row w-100 ">
                <div className="product_key">
                  <Title level={5}>
                    {supplier ? "Total payments made" : "Total payments received"}
                  </Title>
                </div>
                <div className="product_value">
                  <Text>
                    {statement?.base_currency?.symbol}
                    {parseFloat(statement?.totalPaid ?? 0).toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
            <div className="product_row w-100 divider">
              <div className="product_key">
                <Title level={5}>Closing balance</Title>
              </div>
              <div className="product_value">
                <Text>
                  {statement?.base_currency?.symbol}
                  {parseFloat(statement?.totalDue ?? 0).toFixed(2)}
                </Text>
              </div>
            </div>
          </div>
          <Typography.Title level={4} className="main_heading customer-heading mb-10">
            Statement Detail
          </Typography.Title>
          <Table
            bordered={false}
            rowKey="key"
            pagination={false}
            columns={memoColumns}
            dataSource={statement?.statement}
            className="generic-table no-radius __shipment-details--customer"
          />
          <div className="product_row  closing_balance customer-details--balance">
            <div className="product_key">
              <Title level={5}>Closing balance</Title>
            </div>
            <div className="product_value">
              <Text>
                {statement?.base_currency?.symbol}
                {parseFloat(statement?.totalDue ?? 0).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>
      )}
      {pdfModal && (
        <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
      )}
    </>
  );
};
export default Statement;
