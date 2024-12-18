/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { POItemObjProps } from "./Types";
import { useAxios, usePermissions } from "app/Hooks";
import { Content, endpoints, routeNames } from "static";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { ValuesProps } from "app/containers/Sales/Types";
import { AccessDenied, PageHeaderX, Toast } from "app/shared";
import { getFullDateAndTime, setSessionAndLocalObj } from "utils";

const { PURCHASE_ORDERS } = routeNames;
const { PURCHASE_ORDERS: PURCHASE_ORDERS_URL, PURCHASE_ORDERS_CREATE } = endpoints;

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const { checkPermission } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const [item, setItem] = useState<POItemObjProps[]>([]);
  const { has_PurchaseOrderCreate_permission } = checkPermission("PurchaseOrderCreate");

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: POItemObjProps[]) => setItem(items), []);
  const onSubmit = (values: ValuesProps) => {
    if (!item.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      const new_values = {
        ...values,
        items: item,
        total: total,
        discount_transaction_level: 0,
        adjustment: values.adjustment || 0,
        order_date: getFullDateAndTime(values.order_date),
        expected_delivery_date: getFullDateAndTime(values.expected_delivery_date),
      };
      toggle();
      callAxios({
        method: "post",
        url: PURCHASE_ORDERS_URL,
        data: new_values,
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          setSessionAndLocalObj(res?.data?.id, true, "purchaseorders");

          navigate(-1);
        }
      });
    }
  };

  return (
    <>
      {has_PurchaseOrderCreate_permission ? (
        <>
          <PageHeaderX title="Create Purchase Order" navigateTo={PURCHASE_ORDERS} />

          <PurchaseOrderForm
            loading={bool}
            onSubmit={onSubmit}
            handleTotal={handleTotal}
            url={PURCHASE_ORDERS_CREATE}
            handleItemList={handleItemList}
          />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreatePurchaseOrder;
