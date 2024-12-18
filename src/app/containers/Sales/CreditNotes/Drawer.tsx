import { useEffect, useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Empty, Typography } from "antd";
import { getOrganizationDate } from "utils";
import { useAxios, useStore } from "app/Hooks";
import { Buttonx, Icons, Selectx, Spinner } from "app/shared";
import { linkedInvoiceOptions } from "./filterOption";

export const InvoiceList = ({
  form,
  customerId,
  selectedInvoices,
  setLoadingInvoice,
  handleSelectedInvoices,
}: any) => {
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any>([]);
  const [currency, setCurrency] = useState<any>(null);
  const [dateRange, setDateRange] = useState("today");

  useEffect(() => {
    if (customerId) {
      setLoading(true);
      callAxios({
        url: `/creditnotes/create?customer_id=${customerId}&date_range=${dateRange}`,
      }).then((res) => {
        if (res) {
          setInvoices(res?.invoice_list);
          setCurrency(res?.currency);
          setLoading(false);
        }
      });
    }
  }, [customerId, dateRange]);

  const addInvoice = (invoice: any) => {
    setLoadingInvoice(true);
    handleSelectedInvoices(invoice);
    form.setFieldsValue({
      billing_address_id: invoice?.billing_address
        ? {
          ...invoice?.billing_address,
          id: invoice?.billing_address?.id,
          label: invoice?.billing_address?.attention
            ? invoice?.billing_address?.attention
            : invoice?.billing_address?.country_name,
        }
        : null,
    });
    setLoadingInvoice(false);
  };

  return (
    <>
      <div className="invoices-list">
        <div className="form_group ">
          <label className="filter">Filter by</label>
          <Selectx
            valueLabel
            size="large"
            allowClear={false}
            defaultValue={dateRange}
            className="input_field"
            popupClassName="link-invoices-menu dropdown--scroll"
            handleChange={(value: any) => setDateRange(value)}
            options={linkedInvoiceOptions.sort((a, b) => a.key - b.key)}

          />
        </div>

        {loading ? (
          <div className="_spinner-main">
            <Spinner />
          </div>
        ) : invoices?.length > 0 ? (
          invoices?.map((invoice, index) => (
            <div key={index} className="invoice-box">
              <Typography.Title className="total-payment" level={4}>
                {currency?.symbol}
                {invoice?.total.toFixed(2)}
              </Typography.Title>
              <span className="payment-paid">
                {currency?.symbol ?? ""}
                {invoice?.paid_amount ? invoice?.paid_amount.toFixed() : "0.00"} paid
              </span>
              <Typography.Title className="invoice-no" level={5}>
                {invoice?.invoice_no}
              </Typography.Title>
              <span className="payment-date">
                {getOrganizationDate(invoice?.invoice_date, org_date_format)}
              </span>
              <Buttonx
                type="default"
                btnText="Add"
                htmlType="button"
                className="btn-default btn-form-size "
                clickHandler={() => addInvoice(invoice)}
              />
              {selectedInvoices[0]?.id === invoice?.id && (
                <BsCheckCircleFill size="20" className="selected-invoice" />
              )}
            </div>
          ))
        ) : (
          <Empty
            image={<Icons.TbFileInvoice size={50} />}
            description={
              <label>
                There is no invoice available for{" "}
                <strong>
                  {linkedInvoiceOptions.find((date) => date.value === dateRange)?.label}
                </strong>
              </label>
            }
          />
        )}
      </div>
    </>
  );
};
