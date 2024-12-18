/** @format */

import { useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { endpoints } from "static";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import { PaymentReceivedForm } from "./PaymentReceivedForm";
import { InvoiceDataSourceProps } from "./Types";
import { setKeyInLS, setSessionAndLocalObj } from "utils";
import { SpinnerX } from "app/shared/PageLoader";

const { ADVANCE_PAYMENT: ADVANCE_PAYMENT_URL } = endpoints;

const EditPaymentReceived = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkPermission, fetchingRoles } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const [UsedAmount, setUsedAmount] = useState(0);
  const [contactObj, setContactObj] = useState<any>();
  const [paymentId, setPaymentId] = useState<number | string>("");
  const [invoices, setInvoices] = useState<InvoiceDataSourceProps[]>([]);
  const { has_PaymentReceiptsEdit_permission } = checkPermission("PaymentReceiptsEdit");
  const id = searchParams.get("id");

  const handleUsedAmount = useCallback((usedAmount: number) => setUsedAmount(usedAmount), []);
  const handlePaymentId = useCallback((paymentId: number | string) => setPaymentId(paymentId), []);
  const handleInvoiceList = useCallback(
    (invoices: InvoiceDataSourceProps[]) => setInvoices(invoices),
    []
  );

  const onSubmit = (values) => {
    const new_invoices = invoices
      .map(({ id, payment }: InvoiceDataSourceProps) => ({
        invoice_id: id,
        payment,
      }))
      .filter((item: { payment: number }) => {
        return item.payment;
      });
    toggle();
    callAxios({
      method: "put",
      url: `${ADVANCE_PAYMENT_URL}/${paymentId}/update`,
      data: {
        ...values,
        invoices: new_invoices,
        used_amount: UsedAmount,
        customer_id: contactObj.id,
        id: paymentId,
        refund_amount: 0,
      },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        if (values?.saveAs === "email") {
          setKeyInLS("email", true);
          setSessionAndLocalObj(res?.data?.advance_payment?.payment_no, true, "paymentreceived");
          navigate(-1);
        } else if (values?.saveAs !== "email") {
          setSessionAndLocalObj(res?.data?.advance_payment?.payment_no, true, "paymentreceived");
          navigate(-1);
        }
      }
    });
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_PaymentReceiptsEdit_permission ? (
        <PaymentReceivedForm
          loading={bool}
          onSubmit={onSubmit}
          invoiceData={invoices}
          contactObj={contactObj}
          UsedAmount={UsedAmount}
          setContactObj={setContactObj}
          handlePaymentId={handlePaymentId}
          handleUsedAmount={handleUsedAmount}
          handleInvoiceList={handleInvoiceList}
          url={`${ADVANCE_PAYMENT_URL}/${id}/edit`}
          edit={true}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditPaymentReceived;
