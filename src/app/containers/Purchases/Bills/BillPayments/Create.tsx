/**@format */

import { useNavigate } from "react-router";
import { Toast } from "app/shared";
import { useAxios } from "app/Hooks";
import { PaymentModal } from "./Modal";
import { endpoints, routeNames } from "static";
import { CreatePaymentProps, SubmitProps } from "./Types";
import { getFullDateAndTime, setKeyInLS, setSessionAndLocalObj } from "utils";

const { BILLS, PAYMENT_RECORDS } = endpoints;

export const CreatePayment = ({
  url,
  bill_id,
  showModal,
  toggleModal,
  refetchBills,
  has_permission,
  refetchBillPayments,
}: CreatePaymentProps) => {
  const navigate = useNavigate();
  const { callAxios, bool, toggle } = useAxios();

  const onSubmit = (values: SubmitProps) => {
    toggle();
    callAxios({
      method: "post",
      data: {
        ...values,
        balance_due: values.balance_due,
        payment_date: getFullDateAndTime(values.payment_date),
      },
      url: `${BILLS}/${bill_id}${PAYMENT_RECORDS}`,
    }).then((res) => {
      Toast({ message: res.message });
      setKeyInLS("tabKey", "2");
      if (values.saveAs === "new") {
        refetchBillPayments?.();
      } else if (values.saveAs === "email") {
        setKeyInLS("email", true);
        setSessionAndLocalObj(res.data.id, true, BILLS);
        navigate(routeNames.BILL_PAYMENTS);
      } else if (values.saveAs === "print") {
        setKeyInLS("print", true);
        setKeyInLS("email", false);
        setSessionAndLocalObj(res?.data.id, true, BILLS);
        navigate(routeNames.BILL_PAYMENTS);
      } else {
        toggleModal();
        refetchBills();
        refetchBillPayments?.();
      }
    });
  };

  return (
    <PaymentModal
      url={url}
      loading={bool}
      onSubmit={onSubmit}
      showModal={showModal}
      toggleModal={toggleModal}
      has_permission={has_permission}
    />
  );
};
