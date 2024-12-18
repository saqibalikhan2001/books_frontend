/** @format */

import { useState } from "react";
import { Toast } from "app/shared";
import { endpoints } from "static";
import { GroupForm } from "./GroupForm";
import { useAxios, useCreateFormApi, useLoading } from "app/Hooks";
import { TaxDataSource, TaxGroupEditProps, TaxGroupSubmitProps } from "../Types";

const { TAX_GROUP, EDIT } = endpoints;

export const EditTaxGroup = ({
  bool,
  toggle,
  current,
  refetch,
  listing,
  setCurrent,
  currSelected,
  has_permission,
  setCurrSelected,
}: TaxGroupEditProps) => {
  const { callAxios } = useAxios();
  const [loading, , setTrue, setFalse] = useLoading();
  const [selectedRows, setSelected] = useState<TaxDataSource[]>([]);
  const { details } = useCreateFormApi(`${TAX_GROUP}/${current?.id}${EDIT}`);

  const onSubmit = (values: TaxGroupSubmitProps) => {
    const data = { ...values, _ids: selectedRows };
    setTrue();
    callAxios({
      method: "put",
      data,
      url: `${TAX_GROUP}/${current?.id}`,
    }).then((res) => {
      setFalse();
      if (res) {
        toggle();
        refetch?.();
        Toast({ message: res.message });
      }
    });
  };
  return (
    <>
      <GroupForm
        bool={bool}
        toggle={toggle}
        listing={listing}
        loading={loading}
        current={details}
        onSubmit={onSubmit}
        setCurrent={setCurrent}
        setSelected={setSelected}
        currSelected={currSelected}
        has_permission={has_permission}
        setCurrSelected={setCurrSelected}
      />
    </>
  );
};
