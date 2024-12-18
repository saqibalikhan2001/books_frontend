/** @format */

import { useEffect, useMemo, useState } from "react";
import { Form, Table, Typography } from "antd";
import dayjs from "dayjs";
import { endpoints, Labels } from "static";
import { useAxios, useBool, useStore } from "app/Hooks";
import { getFullDate, getOrganizationDate } from "utils";
import { Buttonx, DatePickerx, Spinner } from "app/shared";

const { Title, Text } = Typography;
const todayDate = dayjs(new Date());

const { CUSTOMERS_STATEMENT } = endpoints;
const { DATE, TRANSACTION, DETAILS, AMOUNT, PAYMENTS, BALANCE } = Labels;

const Statement = ({ url, supplier }: { url: string; supplier?: boolean }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { org_date_format } = useStore();
  const [loading, setLoading] = useState(true);
  const [statement, setStatement] = useState<any>();
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
      to: dayjs(getFullDate(todayDate as any)),
      from: dayjs(getFullDate(todayDate as any)),
    });

    //eslint-disable-next-line
  }, [url, form]);

  const onSubmit = (values) => {
    setLoading(true);
    const from = getFullDate(values.from);
    const to = getFullDate(values.to);
    toggle();
    callAxios({
      url: `${url}${CUSTOMERS_STATEMENT}?starting_date=${`${from} 00:00:00`}&ending_date=${`${to} 23:59:59`}`,
    }).then((res) => {
      toggle();
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
        className: "text-right color-dark white-space-unset",
        render: (props: any) => (
          <Typography className="color-dark amount-truncation">
            <Text className="color-dark">{statement?.base_currency?.symbol}</Text>
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
        className: "text-right white-space-unset",
        render: (props: any) => (
          <Typography className="color-dark amount-truncation">
            <Text className="color-dark">{statement?.base_currency?.symbol}</Text>
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
        className: "text-right color-dark white-space-unset",
        render: (props: any) => (
          <Typography className="color-dark amount-truncation">
            <Text className="color-dark">{statement?.base_currency?.symbol}</Text>
            {parseFloat(props.balance ?? 0)?.toFixed(2)}
          </Typography>
        ),
      },
    ],
    [org_date_format, statement]
  );
  return (
    <>
      <div className="__report_tabs_align mb-20 customer-details account-statement">
        <Form form={form} onFinish={onSubmit} className="date_picker_form">
          <div className="flexbox">
            <div className="form_group">
              <DatePickerx
                label="From"
                name="from"
                allowClear={false}
                format={org_date_format}
                popupClassName="overlap"
                disableDate={(current: any) => current && current > dayjs().endOf("day")}
              />
            </div>
            <div className="form_group">
              <DatePickerx
                name="to"
                label="To"
                allowClear={false}
                format={org_date_format}
                popupClassName="overlap"
                disableDate={(current: any) =>
                  current &&
                  (current > dayjs().endOf("day") || current < dayjs(from).startOf("day"))
                }
              />
            </div>
            <Buttonx
              loading={bool}
              btnText="Apply"
              className="btn-primary h-36px ml-8 btn-report"
            />
          </div>
        </Form>
      </div>
      {loading ? (
        <div className="vh-30">
          <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />
        </div>
      ) : (
        <div>
          <Typography.Title level={4} className="main_heading customer-heading summary">
            Account Summary
          </Typography.Title>
          <div className="summary_list bill--ls">
            <div className="product_row w-100">
              <div className="product_key">
                <Title level={5}>Opening balance</Title>
              </div>
              <div className="product_value">
                <Text>
                  {statement?.base_currency?.symbol}
                  {parseFloat(statement?.openingBalance ?? 0)?.toFixed(2)}
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
                      {parseFloat(statement?.creditSales ?? 0)?.toFixed(2)}
                    </Text>
                  </div>
                </div>
                <div className="product_row w-100">
                  <div className="product_key">
                    <Title level={5}>Total credit notes</Title>
                  </div>
                  <div className="product_value">
                    <Text>
                      {statement?.base_currency?.symbol}
                      {parseFloat(statement?.creditNotes ?? 0)?.toFixed(2)}
                    </Text>
                  </div>
                </div>
              </>
            )}
            <div className="product_row w-100 ">
              <div className="product_key">
                <Title level={5}>{supplier ? "Total amount" : "Net credit sales"}</Title>
              </div>
              <div className="product_value">
                <Text>
                  {statement?.base_currency?.symbol}
                  {supplier
                    ? parseFloat(statement?.totalAmount ?? 0)?.toFixed(2)
                    : parseFloat(statement?.creditNetSales ?? 0)?.toFixed(2)}
                </Text>
              </div>
            </div>
            <div className="product_row w-100 statements--border">
              <div className="product_key">
                <Title level={5}>{supplier ? "Total paid" : "Total payments received"}</Title>
              </div>
              <div className="product_value">
                <Text>
                  {statement?.base_currency?.symbol}
                  {parseFloat(statement?.totalPaid ?? 0)?.toFixed(2)}
                </Text>
              </div>
            </div>
            <div className="product_row w-100 statements--border supplier_closing_balance">
              <div className="product_key">
                <Title level={5} style={{ fontWeight: "bold" }}>
                  Total due
                </Title>
              </div>
              <div className="product_value">
                <Text>
                  {statement?.base_currency?.symbol}
                  {parseFloat(statement?.totalDue ?? 0)?.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>

          {/* <Typography.Title level={4} className="main_heading customer-heading  summary">
            Statement Detail
          </Typography.Title> */}

          <Table
            bordered={false}
            rowKey="key"
            pagination={false}
            columns={memoColumns}
            dataSource={statement?.statement}
            className="generic-table no-radius"
          />
          {/* <div className="product_row  closing_balance">
            <div className="product_key">
              <Title level={5}>Closing balance</Title>
            </div>
            <div className="product_value">
              <Text>
                {statement?.base_currency?.symbol}
                {statement?.totalDue}
              </Text>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};
export default Statement;
