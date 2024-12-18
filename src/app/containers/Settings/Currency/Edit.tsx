/** @format */

import { endpoints } from "static";
import { Toast } from "app/shared";
import { CurrencyForm } from "./Form";
import { useAxios, useBool } from "app/Hooks";
import { CurrencySubmitProps, EditCurrencyProps } from "./Types";

const { CURRENCY } = endpoints;

export const EditCurrency = ({
  bool,
  toggle,
  loading,
  refetch,
  current,
  currncy_list,
  has_permission,
}: EditCurrencyProps) => {
  const { callAxios } = useAxios();
  const { setTrue, setFalse } = useBool();

  const onSubmit = (values: CurrencySubmitProps) => {
    setTrue();
    callAxios({
      method: "put",
      data: { ...values, currency_code: `${values.currency_code}` },
      url: `${CURRENCY}/${current.id}`,
    }).then((res) => {
      if (res) {
        setFalse();
        toggle();
        refetch();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <CurrencyForm
        bool={bool}
        toggle={toggle}
        loading={loading}
        current={current}
        onSubmit={onSubmit}
        currncy_list={currncy_list}
        has_permission={has_permission}
      />
    </>
  );
};
