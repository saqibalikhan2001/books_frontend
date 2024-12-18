/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "static";
import { POItemObjProps } from "./Types";
import { getFullDateAndTime } from "utils";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { ValuesProps } from "app/containers/Sales/Types";

const { PURCHASE_ORDERS: PURCHASE_ORDERS_URL } = endpoints;

function EditPurchaseOrder() {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const { checkPermission } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const purchase_order_id = searchParams.get("id");
  const [item, setItem] = useState<POItemObjProps[]>([]);
  const { has_PurchaseOrderEdit_permission } = checkPermission("PurchaseOrderEdit");

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: POItemObjProps[]) => setItem(items), []);
  const onSubmit = (values: ValuesProps) => {
    toggle();
    callAxios({
      method: "put",
      url: `${PURCHASE_ORDERS_URL}/${purchase_order_id}`,
      data: {
        ...values,
        items: item,
        total: total,
        discount_transaction_level: 0,
        adjustment: values.adjustment || 0,
        order_date: getFullDateAndTime(values.order_date),
        expected_delivery_date: getFullDateAndTime(values.expected_delivery_date),
        vendor_id: typeof values.vendor_id === "object" ? values.vendor_id?.id : values.vendor_id,
      },
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        navigate(-1);
      }
    });
  };

  return (
    <>
      {has_PurchaseOrderEdit_permission ? (
        <PurchaseOrderForm
          loading={bool}
          onSubmit={onSubmit}
          handleTotal={handleTotal}
          handleItemList={handleItemList}
          url={`${PURCHASE_ORDERS_URL}/${purchase_order_id}/edit`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
}

export default EditPurchaseOrder;
