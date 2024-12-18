/** @format */
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "static";
import { getFullDateAndTime } from "utils";
import { AccessDenied, Toast } from "app/shared";
import { SalesOrderForm } from "./SalesOrderForm";
import { useAxios, usePermissions } from "app/Hooks";
import { SOItemObjProps, SOsubmitProps } from "./Types";

const { SALES_ORDERS: SALES_ORDERS_URL } = endpoints;

const EditSalesOrder = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const sale_order_id = searchParams.get("id");
  const { checkPermission } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const [item, setItem] = useState<SOItemObjProps[]>([]);
  const [warehouseId, setWarehouseId] = useState<string | number>("");
  const { has_SalesOrderEdit_permission } = checkPermission("SalesOrderEdit");
  const [primaryWarehouseId, setPrimarywarehouseId] = useState<string | number>("");

  const handleItemList = useCallback((items: any) => setItem(items), []);
  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleWarehouseId = useCallback((primary: string | number) => setWarehouseId(primary), []);
  const handlePrimaryWarehouse = useCallback(
    (primary: string | number) => setPrimarywarehouseId(primary),
    []
  );

  const onSubmit = (values: SOsubmitProps) => {
    const newItem = item.map((item: SOItemObjProps) => ({
      ...item,
      warehouseId: item.warehouse_id,
    }));
    toggle();
    callAxios({
      method: "put",
      url: `${SALES_ORDERS_URL}/${sale_order_id}`,
      data: {
        ...values,
        total: total,
        items: newItem,
        discount_transaction_level: 0,
        adjustment: values.adjustment || 0,
        shipping_charge: values.shipping_charge || 0,
        warehouse_id: warehouseId || primaryWarehouseId,
        order_date: getFullDateAndTime(values.order_date),
        customer_id:
          typeof values.customer_id === "object" ? values.customer_id?.id : values.customer_id,
        expected_shipment_date: getFullDateAndTime(values.expected_shipment_date),
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
      {has_SalesOrderEdit_permission ? (
        <SalesOrderForm
          loading={bool}
          onSubmit={onSubmit}
          handleTotal={handleTotal}
          handleItemList={handleItemList}
          url={`${SALES_ORDERS_URL}/${sale_order_id}/edit`}
          handleWarehouseId={handleWarehouseId}
          handlePrimaryWarehouse={handlePrimaryWarehouse}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditSalesOrder;
