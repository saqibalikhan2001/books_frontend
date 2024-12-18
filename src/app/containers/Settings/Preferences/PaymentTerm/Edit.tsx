import { Toast } from "app/shared";
import { PaymentTermModal } from "./Modal";
import { useAxios } from "app/Hooks";

export const EditPaymentTerm = ({
  refetch,
  handleToggle,
  paymentModal,
  setPaymentData,
  bool,
  toggle,
  current,
}: any) => {
  const { callAxios } = useAxios();

  const onFinish = (values: any) => {
    toggle();
    callAxios({
      method: "put",
      url: `/terms/${current?.id}`,
      data: values,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        handleToggle();
        refetch();
      }
      toggle();
    });
    // .catch(() => toggle());
  };
  return (
    <PaymentTermModal
      edit
      setPaymentData={setPaymentData}
      paymentModal={paymentModal}
      onFinish={onFinish}
      handleToggle={handleToggle}
      bool={bool}
      current={current}
    />
  );
};
