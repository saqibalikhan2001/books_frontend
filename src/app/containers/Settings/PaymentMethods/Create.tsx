import { useAxios } from "app/Hooks";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { PaymentMethodForm } from "./Form";
import { CreatePaymentMethodProps, PaymentMethodSubmitProps } from "./Types";

const { PAYMENT_METHOD } = endpoints;

export const CreatePaymentMethod = ({
  refetch,
  has_permission,
  bool: showModal,
  toggle: closeModal,
  memoizehandleCreate,
}: CreatePaymentMethodProps) => {
  const { callAxios, bool, toggle } = useAxios();
  const onSubmit = (values: PaymentMethodSubmitProps) => {
    toggle();
    callAxios({ method: "post", data: values, url: PAYMENT_METHOD }).then((res) => {
      if (res) {
        refetch();
        closeModal();
        memoizehandleCreate(false);
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <PaymentMethodForm
        loading={bool}
        bool={showModal}
        toggle={closeModal}
        onSubmit={onSubmit}
        has_permission={has_permission}
      />
    </>
  );
};
