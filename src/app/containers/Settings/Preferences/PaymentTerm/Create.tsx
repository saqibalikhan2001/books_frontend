import { Toast } from "app/shared";
import { PaymentTermModal } from "./Modal";
import { useAxios } from "app/Hooks";
import { useState } from "react";

export const CreatePaymentTerm = ({
  // bool,
  pref = false,
  toggle,
  refetch,
  handleToggle,
  paymentModal,
  setPaymentData,
}: any) => {
  const { callAxios } = useAxios();
  const [loading, setLoading] = useState(false);
  const onFinish = (values: any) => {
    setLoading(true);
    toggle?.();
    callAxios({
      method: "post",
      url: "/terms",
      data: values,
    })
      .then((res) => {
        if (res) {
          Toast({ message: res.message });
          handleToggle();
          refetch?.();
          pref ? setPaymentData?.("") : setPaymentData?.(res.data);
        }
        setLoading(false);
        toggle?.();
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <PaymentTermModal
      bool={loading}
      toggle={toggle}
      onFinish={onFinish}
      paymentModal={paymentModal}
      handleToggle={handleToggle}
      setPaymentData={setPaymentData}
    />
  );
};
