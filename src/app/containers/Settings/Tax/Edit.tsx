/** @format */

import { TaxForm } from "./Form";
import { Toast } from "app/shared";
import { endpoints } from "static";
import { EditTaxProps, TaxSubmitProps } from "./Types";
import { useAxios, useCreateFormApi, useLoading } from "app/Hooks";

const { TAXES, EDIT } = endpoints;

export const EditTax = ({
  bool,
  toggle,
  current,
  refetch,
  setCurrent,
  has_permission,
}: EditTaxProps) => {
  const [loading] = useLoading();
  const { callAxios } = useAxios();
  const { details } = useCreateFormApi(`${TAXES}/${current?.id}${EDIT}`);

  const onSubmit = (values: TaxSubmitProps) => {
    toggle();
    callAxios({
      method: "put",
      data: values,
      url: `${TAXES}/${current?.id}`,
    }).then((res) => {
      toggle();
      if (res) {
        toggle();
        refetch?.();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <TaxForm
        bool={bool}
        toggle={toggle}
        loading={loading}
        current={details}
        onSubmit={onSubmit}
        setCurrent={setCurrent}
        has_permission={has_permission}
      />
    </>
  );
};
