/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints, routeNames } from "static";
import { InvoiceDataSourceProps } from "./Types";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import { PaymentReceivedForm } from "./PaymentReceivedForm";
import { setKeyInLS, setKeyInSS, getStringValueFromSS, setSessionAndLocalObj } from "utils";
import { SpinnerX } from "app/shared/PageLoader";

const { PAYMENTS_RECEIVED } = routeNames;
const { CRETAE_PAYMENT_RECEIVED, PAYMENT_RECEIVED_CREATE } = endpoints;

const CreateEstimate = () => {
  const navigate = useNavigate();
  const { checkPermission, fetchingRoles } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const [UsedAmount, setUsedAmount] = useState(0);
  const [contactObj, setContactObj] = useState<any>();
  const [invoice, setInvoices] = useState<InvoiceDataSourceProps[]>([]);
  const { has_PaymentReceiptsCreate_permission } = checkPermission("PaymentReceiptsCreate");

  const handleUsedAmount = useCallback((usedAmount: number) => setUsedAmount(usedAmount), []);
  const handleInvoiceList = useCallback(
    (invoices: InvoiceDataSourceProps[]) => setInvoices(invoices),
    []
  );
  const handleListingParams = () => {
    const dataFromLS: any = getStringValueFromSS("params");
    const params = {
      ...dataFromLS,
      sort: "desc",
      sort_column: "created_at",
      search: "",
      filter: "",
      date_range: "",
      start_range: "",
      end_range: "",
      contactId: "",
    };
    setKeyInSS("params", params);
  };
  const onSubmit = (values) => {
    const new_invoices = invoice
      .map(({ id, payment }: InvoiceDataSourceProps) => ({
        invoice_id: id,
        payment,
      }))
      .filter((item: { payment: number }) => {
        return item.payment;
      });
    toggle();
    callAxios({
      method: "post",
      data: {
        ...values,
        customer_id: contactObj.id,
        invoices: new_invoices,
        used_amount: UsedAmount,
        status: values?.saveAs,
      },
      url: CRETAE_PAYMENT_RECEIVED,
    }).then(async (res) => {
      if (res) {
        Toast({ message: res.message });
        if (values?.saveAs === "email") {
          setKeyInLS("email", true);
          setSessionAndLocalObj(res?.data?.advance_payment?.payment_no, true, "paymentreceived");
          await handleListingParams();
          navigate(PAYMENTS_RECEIVED);
        } else if (values?.saveAs !== "email") {
          setSessionAndLocalObj(res?.data?.advance_payment?.payment_no, true, "paymentreceived");
          await handleListingParams();
          navigate(PAYMENTS_RECEIVED);
        }
      }
    });
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_PaymentReceiptsCreate_permission ? (
        <>
          <PaymentReceivedForm
            loading={bool}
            onSubmit={onSubmit}
            invoiceData={invoice}
            contactObj={contactObj}
            UsedAmount={UsedAmount}
            setContactObj={setContactObj}
            url={PAYMENT_RECEIVED_CREATE}
            handleUsedAmount={handleUsedAmount}
            handleInvoiceList={handleInvoiceList}
          />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateEstimate;
