/**@format */
import RefundModal from "./Modal";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { useAxios } from "app/Hooks";
import { getFullDateAndTime, setKeyInLS } from "utils";
import { CreateRefundProps, RefundOnSubmitProps } from "./Types";

const { ADVANCE_REFUND, CREDIT_REFUND, STORE } = endpoints;

export const CreateRefund = ({
  url,
  PRdetail,
  showModal,
  toggleModal,
  toggleFetch,
  refetchRefund,
  has_permission,
  refetchPaymentReceived,
  PaymentRefund = false,
}: CreateRefundProps) => {
  const { callAxios, bool, toggle } = useAxios();

  const onSubmit = (values: RefundOnSubmitProps) => {
    let payload;
    if (PaymentRefund) {
      payload = {
        ...values,
        type: PRdetail?.type,
        mode: values?.refund_mode,
        amount: values?.refund_credits,
        advance_payment_id: PRdetail?.id,
        refund_date: getFullDateAndTime(values.refund_date),
      };
    } else {
      payload = {
        ...values,
        credit_note_id: PaymentRefund ? PRdetail?.id : PRdetail.creditNote.id,
        refund_date: getFullDateAndTime(values.refund_date),
      };
    }
    toggle();
    callAxios({
      method: "post",
      url: `${PaymentRefund ? ADVANCE_REFUND : CREDIT_REFUND}${STORE}`,
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "3");
        toggleModal();
        refetchRefund();
        refetchPaymentReceived();
        toggleFetch();
      }
    });
  };
  return (
    <RefundModal
      url={url}
      loading={bool}
      onSubmit={onSubmit}
      PRdetail={PRdetail}
      showModal={showModal}
      toggleModal={toggleModal}
      moduleendpoint={PaymentRefund}
      has_permission={has_permission}
    />
  );
};
