/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SalesOrderForm } from "./SalesOrderForm";
import { useAxios, usePermissions } from "app/Hooks";
import { Content, endpoints, routeNames } from "static";
import { SOItemObjProps, SOsubmitProps } from "./Types";
import { AccessDenied, PageHeaderX, Toast } from "app/shared";
import { getFullDateAndTime, setSessionAndLocalObj } from "utils";

const { SALES_ORDERS } = routeNames;
const { SALES_ORDERS: SALES_ORDERS_URL, SALES_ORDERS_CREATE } = endpoints;

const CreateSalesOrder = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const { checkPermission } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const [item, setItem] = useState<SOItemObjProps[]>([]);
  const [warehouseId, setWarehouseId] = useState<string | number>("");
  const { has_SalesOrderCreate_permission } = checkPermission("SalesOrderCreate");
  const [primaryWarehouseId, setPrimarywarehouseId] = useState<string | number>();

  const handleItemList = useCallback((items: any) => setItem(items), []);
  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleWarehouseId = useCallback((primary: string | number) => setWarehouseId(primary), []);
  const handlePrimaryWarehouse = useCallback(
    (primary: string | number) => setPrimarywarehouseId(primary),
    []
  );

  const onSubmit = (values: SOsubmitProps) => {
    if (!item.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      const newItem = item.map((item: SOItemObjProps) => ({
        ...item,
        warehouseId: item.warehouse_id,
      }));
      const new_values = {
        ...values,
        total: total,
        items: newItem,
        discount_transaction_level: 0,
        adjustment: values.adjustment || 0,
        shipping_charge: values.shipping_charge || 0,
        warehouse_id: warehouseId || primaryWarehouseId,
        order_date: getFullDateAndTime(values.order_date),
        expected_shipment_date: getFullDateAndTime(values.expected_shipment_date),
      };
      toggle();
      callAxios({
        method: "post",
        url: SALES_ORDERS_URL,
        data: new_values,
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          setSessionAndLocalObj(res?.data?.id, true, "salesOrder");
          navigate(-1);
        }
      });
    }
  };

  return (
    <>
      {has_SalesOrderCreate_permission ? (
        <>
          <PageHeaderX title="Create SalesOrder" navigateTo={SALES_ORDERS} />

          <SalesOrderForm
            loading={bool}
            onSubmit={onSubmit}
            handleTotal={handleTotal}
            url={SALES_ORDERS_CREATE}
            handleItemList={handleItemList}
            handleWarehouseId={handleWarehouseId}
            handlePrimaryWarehouse={handlePrimaryWarehouse}
          />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateSalesOrder;
