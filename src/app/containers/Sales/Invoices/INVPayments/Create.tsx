/**@format */

import { endpoints } from "static";
import { Toast } from "app/shared";
import { useAxios } from "app/Hooks";
import { PaymentModal } from "./Modal";
import { getFullDateAndTime, setKeyInLS } from "utils";
import { CreatePaymentProps, SubmitProps } from "./Types";

const { INVOICE_PAYMENT_RECEIVED } = endpoints;
export const CreatePayment = ({
  url,
  refetch,
  showModal,
  toggleModal,
  invoice_id,
  has_permission,
  refetchInvoices,
}: CreatePaymentProps) => {
  const { callAxios, toggle, bool } = useAxios();
  const onSubmit = (values: SubmitProps) => {
    toggle();
    callAxios({
      method: "post",
      url: INVOICE_PAYMENT_RECEIVED,
      data: { ...values, invoice_id, payment_date: getFullDateAndTime(values.payment_date) },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        setKeyInLS("tabKey", "2");
        toggleModal();
        refetchInvoices();
        refetch();
      }
    });
  };
  return (
    <>
      <PaymentModal
        url={url}
        loading={bool}
        onSubmit={onSubmit}
        showModal={showModal}
        toggleModal={toggleModal}
        has_permission={has_permission}
      />
    </>
  );
};
