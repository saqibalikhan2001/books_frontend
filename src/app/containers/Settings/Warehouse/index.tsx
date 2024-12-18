/** @format */

import { useState } from "react";
import { Listing } from "./Listing";
import { EditWarehouse } from "./Edit";
import { AccessDenied } from "app/shared";
import { CreateWarehouse } from "./Create";
import { useBool, usePermissions } from "app/Hooks";
import { useGetListQuery } from "store/query/organization";
import { useGetListingQuery } from "store/query/warehouse";

const Warehouse = () => {
  const { bool, toggle } = useBool();
  const [current, setCurrent] = useState({});
  const { checkPermission } = usePermissions();
  const { has_WarehouseView_permission } = checkPermission("WarehouseView");
  const { has_WarehouseEdit_permission } = checkPermission("WarehouseEdit");
  const { has_WarehouseCreate_permission } = checkPermission("WarehouseCreate");
  const { has_WarehouseDelete_permission } = checkPermission("WarehouseDelete");

  const { data, refetch } = useGetListingQuery("", {
    refetchOnMountOrArgChange: true,
    skip: !has_WarehouseView_permission,
  });
  const { data: { country_list = [] } = {} } = useGetListQuery("", {
    refetchOnMountOrArgChange: true,
    skip: !has_WarehouseView_permission,
  });

  const ctry_list =
    country_list?.map(({ id, country_name }: any) => ({
      id,
      label: country_name,
    })) || [];

  const editWarehouse = (id: number) => {
    const curr = data.filter((val: any) => val.id === id)[0];

    setCurrent(curr);
    toggle();
  };

  return (
    <>
      <CreateWarehouse
        refetch={refetch}
        ctry_list={ctry_list}
        has_permission={has_WarehouseCreate_permission}
      />
      {has_WarehouseView_permission ? (
        <Listing
          refetch={refetch}
          toggle={editWarehouse}
          warehouses={data || []}
          has_permission={has_WarehouseDelete_permission}
        />
      ) : (
        <AccessDenied />
      )}
      {bool && (
        <EditWarehouse
          bool={bool}
          toggle={toggle}
          current={current}
          refetch={refetch}
          ctry_list={ctry_list}
          has_permission={has_WarehouseEdit_permission}
        />
      )}
    </>
  );
};

export default Warehouse;
