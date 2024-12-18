/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EstimateForm } from "./EstimateForm";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import { Content, endpoints, routeNames } from "static";
import {
  setKeyInLS,
  setKeyInSS,
  getFullDateAndTime,
  getStringValueFromSS,
  setSessionAndLocalObj,
} from "utils";
import { SpinnerX } from "app/shared/PageLoader";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";
import { EstimateItemObjProps, EstimateSubmitProps } from "./Types";

const { ESTIMATES } = routeNames;
const { ESTIMATES: ESTIMATE_URL, ESTIMATE_CREATE } = endpoints;

const CreateEstimate = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const { callAxios, toggle, bool } = useAxios();
  const [contactObj, setContactObj] = useState<any>();
  const { data: terms = [] } = useGetPaymentTermsQuery("");
  const { checkPermission, fetchingRoles } = usePermissions();
  const [item, setItem] = useState<EstimateItemObjProps[]>([]);
  const [warehouseId, setWarehouseId] = useState<string | number>("");
  const { has_EstimatesCreate_permission } = checkPermission("EstimatesCreate");
  const [primaryWarehouseId, setPrimarywarehouseId] = useState<string | number>();

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: EstimateItemObjProps[]) => setItem(items), []);
  const handleWarehouseId = useCallback((primary: string | number) => setWarehouseId(primary), []);
  const handlePrimaryWarehouse = useCallback(
    (primary: string | number) => setPrimarywarehouseId(primary),
    []
  );
  const onSubmit = ({ values }: EstimateSubmitProps) => {
    const newPaymentTerm = {
      name: values?.payment_terms?.payment_term_name,
      value: values?.payment_terms?.payment_term_value,
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

      const warehouse = item.find((data) => data.warehouse_id);
      const new_values = {
        ...values,
        total: total,
        items: newItem,
        customer_id: contactObj?.id,
        adjustment: values.adjustment || 0,
        shipping_charge: values.shipping_charge || 0,
        warehouse_id: warehouseId || primaryWarehouseId || warehouse?.warehouse_id,
        estimate_date: getFullDateAndTime(values.estimate_date),
        expiry_date: getFullDateAndTime(values.expiry_date),
        sent: values?.saveAs === "sent" || values.saveAs === "email",
        billing_address_id: values?.billing_address_id?.id,
        payment_terms:
          typeof values.payment_terms !== "object"
            ? terms.find((val: { id: any }) => val.id === values.payment_terms) || {}
            : newPaymentTerm,
        discount_level: values?.discount_level,
        discount_type: values.transaction_level_discount_type ?? "percent",
        discount_transaction_level:
          values?.discount_level === "item"
            ? 0
            : values?.discount_level == null
            ? 0
            : values.discount_transaction_level,
      };

      toggle();
      callAxios({
        method: "post",
        url: ESTIMATE_URL,
        data: new_values,
      }).then(async (res) => {
        if (res) {
          if (values.saveAs === "email") {
            setKeyInLS("email", true);
          }
          Toast({ message: res.message });
          setSessionAndLocalObj(res?.data?.id, true, ESTIMATE_URL);
          const dataFromLS: any = getStringValueFromSS("params");
          const params = {
            ...dataFromLS,
            sort: "desc",
            sort_column: "created_at",
            search: "",
            date_range: "",
            start_range: "",
            end_range: "",
            contactId: "",
            filter: "",
          };
          await setKeyInSS("params", params);
          navigate(ESTIMATES);
        }
      });
    }
  };
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      {has_EstimatesCreate_permission ? (
        <EstimateForm
          create
          item={item}
          loading={bool}
          onSubmit={onSubmit}
          url={ESTIMATE_CREATE}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          handleWarehouseId={handleWarehouseId}
          handlePrimaryWarehouse={handlePrimaryWarehouse}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateEstimate;
