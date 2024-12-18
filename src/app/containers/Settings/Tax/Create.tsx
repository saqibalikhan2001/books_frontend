/** @format */

import { TaxForm } from "./Form";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { useBool, useAxios } from "app/Hooks";
import { CreateTaxProps, TaxSubmitProps } from "./Types";

const { TAXES } = endpoints;

export const CreateTax = ({
  bool,
  toggle,
  taxObj,
  setTaxObj,
  setTaxList,
  has_permission,
}: CreateTaxProps) => {
  const { callAxios } = useAxios();
  //@ts-ignore
  const { bool: createBool, toggle: createToggle } = useBool();

  const onSubmit = (values: TaxSubmitProps) => {
    // createToggle();
    callAxios({
      method: "post",
      data: values,
      url: TAXES,
    }).then((res) => {
      // createToggle();
      if (res) {
        setTaxObj?.({ ...taxObj, ...res?.data });
        setTaxList?.((prev) => [...prev, res?.data]);
        toggle();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <TaxForm
        bool={bool}
        toggle={toggle}
        onSubmit={onSubmit}
        loading={createBool}
        has_permission={has_permission}
      />
    </>
  );
};
