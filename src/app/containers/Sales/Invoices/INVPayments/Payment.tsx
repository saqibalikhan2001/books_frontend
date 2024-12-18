/**@format */

import { useCallback } from "react";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { CreatePayment } from "./Create";
import { INVPaymentProps } from "./Types";
import { PaymentsListing } from "./Listing";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { setKeyInLS } from "utils";
import { CreditApplied } from "../AppliedOnCredit";
const { PAYMENT_RECEIVED, INVOICE_PAYMENT_RECEIVED, CREATE } = endpoints;

const INVPayment = ({
  url,
  from,
  detail,
  refetch,
  fetchList,
  dashboardProp,
  refetchInvoices,
  isModal = false,
}: INVPaymentProps) => {
  const { checkPermission } = usePermissions();
  const { bool, toggle: toggleModal } = useBool();
  const { bool: showAppliedModal, toggle: toggleAppliedModal } = useBool();
  const { callAxios, bool: loading, toggle } = useAxios();
  const { has_InvoicePaymentRecordCreate_permission } = checkPermission(
    "InvoicePaymentRecordCreate"
  );
  const { has_InvoicePaymentRecordDelete_permission } = checkPermission(
    "InvoicePaymentRecordDelete"
  );
  const handleConfirm = (data: { id: number }) => {
    toggle();
    callAxios({
      method: "delete",
      url: `${INVOICE_PAYMENT_RECEIVED}/${data.id}`,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "2");
        refetch();
        refetchInvoices();
      }
    });
  };
  const handleConfirmCredit = (data: { id: number }) => {
    toggle();
    callAxios({
      method: "delete",
      url: `creditutilize/${data.id}`,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "2");
        refetch();
        refetchInvoices();
      }
    });
  };

  const memoizeConfirm = useCallback(
    handleConfirm,

    //eslint-disable-next-line
    [refetch, refetchInvoices]
  );
  const memoizeConfirmCredit = useCallback(
    handleConfirmCredit,

    //eslint-disable-next-line
    [refetch, refetchInvoices]
  );

  return (
    <>
      {bool && (
        <CreatePayment
          showModal={bool}
          refetch={refetch}
          toggleModal={toggleModal}
          refetchInvoices={refetchInvoices}
          invoice_id={detail?.invoice_info?.id}
          has_permission={has_InvoicePaymentRecordCreate_permission}
          url={`${PAYMENT_RECEIVED}/${detail?.invoice_info?.id}${CREATE}`}
        />
      )}
      {showAppliedModal && (
        <CreditApplied
          detail={detail}
          showModal={showAppliedModal}
          refetchApplied={refetchInvoices}
          toggleModal={toggleAppliedModal}
          refetchPaymentReceived={() => null}
          //@ts-ignore
          has_permission={!detail?.details?.utilizeableCredits}
        />
      )}
      <>
        <PaymentsListing
          url={url}
          from={from}
          detail={detail}
          toggle={toggle}
          loading={loading}
          dashboardProp={dashboardProp}
          isModal={isModal}
          fetchList={fetchList}
          toggleModal={toggleModal}
          toggleAppliedModal={toggleAppliedModal}
          handleConfirm={memoizeConfirm}
          handleConfirmCredit={memoizeConfirmCredit}
          showButton={detail?.invoice_info?.status !== "paid"}
          has_permission={has_InvoicePaymentRecordDelete_permission}
        />
      </>
    </>
  );
};

export default INVPayment;
