/** @format */

import { endpoints } from "static";
import { Toast } from "app/shared";
import { PaymentMethodForm } from "./Form";
import { useAxios, useCreateFormApi } from "app/Hooks";
import { PaymentMethodSubmitProps, EditPaymentMethodprops } from "./Types";

const { PAYMENT_METHOD, EDIT } = endpoints;

export const EditPaymentMethod = ({
  refetch,
  paymentMethod,
  has_permission,
  bool: showModal,
  toggle: closeModal,
}: EditPaymentMethodprops) => {
  const { callAxios, toggle, bool } = useAxios();
  const { details } = useCreateFormApi(`${PAYMENT_METHOD}/${paymentMethod.id}${EDIT}`);

  const onSubmit = (values: PaymentMethodSubmitProps) => {
    toggle();
    callAxios({
      method: "put",
      data: values,
      url: `${PAYMENT_METHOD}/${paymentMethod.id}`,
    }).then((res) => {
      if (res) {
        closeModal();
        refetch();
        Toast({ message: res.message });
      }
    });
  };
  return (
    <>
      <PaymentMethodForm
        loading={bool}
        bool={showModal}
        current={details}
        toggle={closeModal}
        onSubmit={onSubmit}
        has_permission={has_permission}
      />
    </>
  );
};
