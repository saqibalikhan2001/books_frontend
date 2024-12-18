/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Content, endpoints, routeNames } from "static";
import { EstimateForm } from "../EstimateForm";
import { AccessDenied, Toast } from "app/shared";
import { EstimateItemObjProps } from "../Types";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, usePermissions } from "app/Hooks";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { getFullDateAndTime, setKeyInLS, setSessionAndLocalObj } from "utils";

const { ESTIMATES } = routeNames;
const { ESTIMATES: ESTIMATE_URL } = endpoints;

const CloneEstimates = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const clone_id = searchParams.get("id");
  const { callAxios, toggle, bool } = useAxios();
  const [contactObj, setContactObj] = useState<any>();
  const { checkPermission, fetchingRoles } = usePermissions();
  const { data: terms = [] } = useGetInvoiceTermsListQuery("");
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
        is_cloned: true,
        clone_status: 1,
        cloned_id: clone_id,
        customer_id: contactObj.id,
        adjustment: values.adjustment || 0,
        shipping_charge: values.shipping_charge || 0,
        discount_transaction_level:
          values?.discount_level === "item"
            ? 0
            : values?.discount_level == null
            ? 0
            : values.discount_transaction_level,
        warehouse_id: warehouseId || primaryWarehouseId,
        discount_type: values.transaction_level_discount_type ?? "percent",
        billing_address_id: values?.billing_address_id?.id,
        expiry_date: getFullDateAndTime(values.expiry_date),
        estimate_date: getFullDateAndTime(values.estimate_date),
        sent: values?.saveAs === "sent" || values.saveAs === "email",
        payment_terms:
          typeof values.payment_terms !== "object"
            ? terms.find((val: { id: any }) => val.id === values.payment_terms) || {}
            : newPaymentTerm,
      };
      toggle();
      callAxios({
        method: "post",
        data: new_values,
        url: ESTIMATE_URL,
      }).then(async (res) => {
        toggle();
        if (res) {
          if (values.saveAs === "email") {
            setKeyInLS("email", true);
          }
          Toast({ message: res.message });
          setSessionAndLocalObj(res?.data?.id, true, ESTIMATES);
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
          item={item}
          loading={bool}
          onSubmit={onSubmit}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          handleWarehouseId={handleWarehouseId}
          url={`${ESTIMATE_URL}/${clone_id}/clone`}
          handlePrimaryWarehouse={handlePrimaryWarehouse}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CloneEstimates;
