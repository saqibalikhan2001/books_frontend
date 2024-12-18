/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Content, endpoints } from "static";
import { EstimateForm } from "./EstimateForm";
import { EstimateItemObjProps } from "./Types";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import { getFullDateAndTime, setKeyInLS } from "utils";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { SpinnerX } from "app/shared/PageLoader";

const { ESTIMATES: ESTIMATE_URL } = endpoints;

const EditEstimates = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const estimate_id = searchParams.get("id");
  const { checkPermission, fetchingRoles } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const [contactObj, setContactObj] = useState<any>();
  const { data: terms = [] } = useGetInvoiceTermsListQuery("");
  const [item, setItem] = useState<EstimateItemObjProps[]>([]);
  const [warehouseId, setWarehouseId] = useState<string | number>("");
  const { has_EstimatesEdit_permission } = checkPermission("EstimatesEdit");
  const [primaryWarehouseId, setPrimarywarehouseId] = useState<string | number>();

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: EstimateItemObjProps[]) => setItem(items), []);
  const handleWarehouseId = useCallback((primary: string | number) => setWarehouseId(primary), []);
  const handlePrimaryWarehouse = useCallback(
    (primary: string | number) => setPrimarywarehouseId(primary),
    []
  );

  const onSubmit = ({ values }: any) => {
    const newPaymentTerm = {
      name: values?.payment_terms?.payment_term_name ?? values?.payment_terms?.name,
      value: values?.payment_terms?.payment_term_value ?? values?.payment_terms?.value,
    };
    if (!item.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      const result = item.filter((obj) => obj.id !== null);
      const newItem = result.map((item: EstimateItemObjProps) => ({
        ...item,
        item_obj: null,
        warehouseId: item.warehouse_id,
      }));
      const new_values = {
        ...values,
        total: total,
        items: newItem,
        customer_id: contactObj?.id,
        adjustment: values.adjustment || 0,
        shipping_charge: values.shipping_charge || 0,
        warehouse_id: warehouseId || primaryWarehouseId,
        sent: values?.saveAs === "sent" || values.saveAs === "email",
        estimate_date: getFullDateAndTime(values.estimate_date),
        expiry_date: getFullDateAndTime(values.expiry_date),
        discount_type: values.transaction_level_discount_type ?? "percent",
        billing_address_id: values?.billing_address_id?.id,
        payment_terms:
          typeof values.payment_terms !== "object"
            ? terms.find((val: { id: any }) => val.id === values.payment_terms) || {}
            : newPaymentTerm,
        discount_level: values?.discount_level,
        discount_transaction_level:
          values?.discount_level === "item"
            ? 0
            : values?.discount_level == null
            ? 0
            : values.discount_transaction_level,
      };

      toggle();
      callAxios({
        method: "put",
        url: `${ESTIMATE_URL}/${estimate_id}`,
        data: new_values,
      }).then((res) => {
        // toggle();
        if (res) {
          toggle();
          if (values.saveAs === "email") 
            setKeyInLS("email", true);
          else setKeyInLS("email", false);
          Toast({ message: res.message });
          navigate(-1);
        }
      }).catch(() => {
        toggle();
      });
    }
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_EstimatesEdit_permission ? (
        <EstimateForm
          edit
          item={item}
          loading={bool}
          onSubmit={onSubmit}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          handleWarehouseId={handleWarehouseId}
          url={`${ESTIMATE_URL}/${estimate_id}/edit`}
          handlePrimaryWarehouse={handlePrimaryWarehouse}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditEstimates;
