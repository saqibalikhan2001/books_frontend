/**@format */

import { useAxios, useStore, useTimeZone } from "app/Hooks";
import dayjs from "dayjs";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { AppliedModal } from "./Modal";
import { CreateInvoiceAppliedProps } from "./Types";
import { setKeyInLS } from "utils";

const { CREDIT_UTILIZE, STORE, CREATE } = endpoints;

export const CreateInvoiceApplied = ({
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
        appliedCreditNotes: 1,
        creditNotesList: values.invoices,
        credit_utilize_date: todayDate,
        invoiceBalanceDue: detail.creditNote?.balance,
        creditNoteId: detail.creditNote.id,
        amountToCredit: values?.invoices.reduce(
          (accumulator, currentValue) => accumulator + +currentValue.used_credits,
          0
        ),
      },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "2");
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
        url={`${CREDIT_UTILIZE}/${detail.creditNote.id}${CREATE}/credit`}
      />
    </>
  );
};
