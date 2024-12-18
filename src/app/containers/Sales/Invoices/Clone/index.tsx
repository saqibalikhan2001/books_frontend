/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InvoiceForm } from "../InvoiceForm";
import { AccessDenied, Toast } from "app/shared";
import { SpinnerX } from "app/shared/PageLoader";
import { InvoiceDataSourceProps } from "../Types";
import { endpoints, Content, routeNames } from "static";
import { useLoading, useAxios, usePermissions } from "app/Hooks";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";
import { setKeyInLS, getFullDateAndTime, setSessionAndLocalObj, convertInNumber } from "utils";

const { INVOICES } = routeNames;
const { INVOICES: INVOICES_URL } = endpoints;

const InvoiceClone = () => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [total, setTotal] = useState(0);
  const [loading, toggle] = useLoading();
  const [searchParams] = useSearchParams();
  const clone_id = searchParams.get("id");
  const [contactObj, setContactObj] = useState<any>();
  const { data: terms = [] } = useGetPaymentTermsQuery("");
  const { checkPermission, fetchingRoles } = usePermissions();
  const [item, setItem] = useState<InvoiceDataSourceProps[]>([]);
  const { has_InvoiceCreate_permission } = checkPermission("InvoiceCreate");

  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: InvoiceDataSourceProps[]) => setItem(items), []);

  const onSubmit = ({ values }: any) => {
    if (!item?.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      const itemObj = item.filter((data) => data.id !== null);
      const newItem = itemObj.map((item: any) => ({
        ...item,
        item_obj: null,
        amount: 0,
      }));
      const new_values = {
        ...values,
        total: total,
        is_cloned: true,
        items: newItem,
        // discount_type: "",
        // discount_level: "",
        cloned_id: clone_id,
        customer_id: contactObj?.id,
        discount_transaction_level:
          values?.discount_level === "item"
            ? 0
            : values?.discount_level == null
            ? 0
            : values.discount_transaction_level,
        adjustment: convertInNumber(values?.adjustment),
        shipping_charge: values?.shipping_charge || 0,
        billing_address_id: values?.billing_address_id?.id,
        invoice_terms:
          typeof values?.invoice_terms !== "object"
            ? terms.find((val: { id: any }) => val.id === values?.invoice_terms) || {}
            : values.invoice_terms,
        discount_type: values.transaction_level_discount_type,
        due_date: getFullDateAndTime(values?.due_date),
        invoice_date: getFullDateAndTime(values?.invoice_date),
        status: values?.saveAs === "sent" ? "sent" : "draft",
      };
      toggle();
      callAxios({
        method: "post",
        url: `${INVOICES_URL}`,
        data: new_values,
      })
        .then(async (res) => {
          toggle();
          if (res) {
            Toast({ message: res.message });
            if (values?.saveAs === "email") setKeyInLS("email", true);
            else setKeyInLS("email", false);
            setSessionAndLocalObj(res?.data?.id, true, INVOICES);
            navigate(INVOICES);
          }
        })
        .catch(() => toggle());
    }
  };
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {has_InvoiceCreate_permission ? (
        <InvoiceForm
          item={item}
          loading={loading}
          onSubmit={onSubmit}
          contactObj={contactObj}
          handleTotal={handleTotal}
          setContactObj={setContactObj}
          handleItemList={handleItemList}
          url={`${INVOICES_URL}/${clone_id}/clone`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default InvoiceClone;
