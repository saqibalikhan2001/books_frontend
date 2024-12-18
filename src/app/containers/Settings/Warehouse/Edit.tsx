/** @format */

import { endpoints } from "static";
import { Toast } from "app/shared";
import { WrEditProps } from "./Type";
import { WarehouseForm } from "./Form";
import { useAxios, useLoading } from "app/Hooks";

const { WAREHOUSE } = endpoints;

export const EditWarehouse = ({
  bool,
  toggle,
  refetch,
  current,
  ctry_list,
  has_permission,
}: WrEditProps) => {
  const [loading] = useLoading();
  const { callAxios } = useAxios();

  const onSubmit = (values: object) => {
    toggle();
    callAxios({
      method: "put",
      data: values,
      url: `${WAREHOUSE}/${current.id}`,
    }).then((res) => {
      toggle();
      if (res) {
        toggle();
        refetch();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <WarehouseForm
        bool={bool}
        toggle={toggle}
        loading={loading}
        current={current}
        onSubmit={onSubmit}
        ctry_list={ctry_list}
        has_permission={has_permission}
      />
    </>
  );
};
