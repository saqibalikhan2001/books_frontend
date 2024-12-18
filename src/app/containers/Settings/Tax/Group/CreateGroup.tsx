/** @format */

import { useState } from "react";
import { Toast } from "app/shared";
import { endpoints } from "static";
import { GroupForm } from "./GroupForm";
import { useAxios, useLoading } from "app/Hooks";
import { CreateTaxGroupFormProps, TaxDataSource, TaxGroupSubmitProps } from "../Types";

const { TAX_GROUP } = endpoints;

export const CreateTaxGroup = ({
  bool,
  toggle,
  refetch,
  listing,
  setCurrent,
  currSelected,
  has_permission,
  setCurrSelected,
}: CreateTaxGroupFormProps) => {
  const { callAxios } = useAxios();
  const [loading, , setTrue, setFalse] = useLoading();
  const [selectedRows, setSelected] = useState<TaxDataSource[]>([]);

  const onSubmit = (values: TaxGroupSubmitProps) => {
    const data = { ...values, _ids: selectedRows };
    setTrue();
    callAxios({
      method: "post",
      data,
      url: TAX_GROUP,
    }).then((res) => {
      setFalse();
      if (res) {
        setSelected([]);
        toggle();
        refetch?.();
        Toast({ message: res.message, type: "success" });
      }
    });
  };

  return (
    <GroupForm
      bool={bool}
      toggle={toggle}
      listing={listing}
      loading={loading}
      onSubmit={onSubmit}
      setCurrent={setCurrent}
      setSelected={setSelected}
      currSelected={currSelected}
      has_permission={has_permission}
      setCurrSelected={setCurrSelected}
    />
  );
};
