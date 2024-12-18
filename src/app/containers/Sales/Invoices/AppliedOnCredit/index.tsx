/**@format */

import { useAxios, useStore, useTimeZone } from "app/Hooks";
import dayjs from "dayjs";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { AppliedModal } from "./Modal";
import { CreateInvoiceAppliedProps } from "./Types";

const { CREDIT_UTILIZE, STORE, CREATE } = endpoints;
export const convertValues = (values, type) => {
  return values.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue[type] || 0);
  }, 0);
};
export const CreditApplied = ({
  detail,
  showModal,
  toggleModal,
  refetchApplied,
  has_permission,
  refetchPaymentReceived,
}: CreateInvoiceAppliedProps) => {
  const { TimeZone } = useStore();
  const { callAxios, toggle, bool } = useAxios();
  const { dateWithOrgTZ } = useTimeZone(`${TimeZone}`);
  const todayDate = dayjs(dateWithOrgTZ(dayjs(new Date())));

  const onSubmit = (values: any) => {
    toggle();
    callAxios({
      method: "post",
      url: `${CREDIT_UTILIZE}${STORE}`,
      data: {
        invoiceId: detail.invoice_info.id,
        creditNotesList: values,
        appliedCreditNotes: 1,
        amountToCredit: convertValues(values, "used_credits"),
        invoiceBalanceDue: detail.invoice_info.total,
        // invoiceBalanceDue:convertValues(values, "issued_credits") - convertValues(values, "balance"),
        credit_utilize_date: todayDate,
      },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        toggleModal();
        refetchApplied();
        refetchPaymentReceived();
      }
    });
  };
  return (
    <>
      <AppliedModal
        loading={bool}
        onSubmit={onSubmit}
        showModal={showModal}
        toggleModal={toggleModal}
        has_permission={has_permission}
        url={`${CREDIT_UTILIZE}/${detail?.invoice_info?.id}${CREATE}/invoice`}
      />
    </>
  );
};
