/** @format */

import { useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { endpoints } from "static";
import { getFullDateAndTime } from "utils";
import { AccessDenied, Toast } from "app/shared";
import { RecurringInvoiceForm } from "./RecurringInvoiceForm";
import { useAxios, useLoading, usePermissions } from "app/Hooks";
import { RecurringInoviceSubmit, RecurringInvoiceDataSourceProps } from "./Types";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";

const { RECURRING_INVOICE } = endpoints;

const EditRecurringInvoices = () => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [total, setTotal] = useState(0);
  const [loading, toggle] = useLoading();
  const [searchParams] = useSearchParams();
  const { checkPermission } = usePermissions();
  const recurring_invoice_id = searchParams.get("id");
  const [item, setItem] = useState<RecurringInvoiceDataSourceProps[]>();
  const { has_RecurringInvoicesEdit_permission } = checkPermission("RecurringInvoicesEdit");
  const { data: terms = [] } = useGetInvoiceTermsListQuery("");
  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback(
    (items: RecurringInvoiceDataSourceProps[]) => setItem(items),
    []
  );

  const onSubmit = (values: RecurringInoviceSubmit) => {
    let final_string;
    let impureString = /\d/.test(values.repeat_duration);
    if (typeof values.repeat_duration === "string") {
      if (!impureString) {
        final_string = values.repeat_duration.split("(s)")[0].toLowerCase();
      } else {
        final_string =
          values.repeat_duration.split(" ")[0] +
          " " +
          values.repeat_duration.split(" ")[1].split("(s)")[0].toLowerCase();
      }
    }
    const repeatDuration = final_string || values.repeat_duration.value;
    const new_values = {
      ...values,
      items: item,
      total: total,
      discount_type: "",
      repeat_duration: repeatDuration,
      invoice_terms:
        typeof values.invoice_terms !== "object"
          ? terms.find((val: { id: any }) => val.id === values.invoice_terms) || {}
          : values.invoice_terms,
      discount_transaction_level: 0,
      adjustment: values.adjustment || 0,
      shipping_charge: values.shipping_charge || 0,
      customer_id:
        typeof values.customer_id === "object" ? values.customer_id?.id : values.customer_id,
      end_date: getFullDateAndTime(values.end_date),
      start_date: getFullDateAndTime(values.start_date),
    };
    toggle();
    callAxios({
      method: "put",
      url: `${RECURRING_INVOICE}/${recurring_invoice_id}/update`,
      data: new_values,
    }).then((res) => {
      toggle();
      if (res) {
        Toast({ message: res.message });
        navigate(-1);
      }
    });
  };
  return (
    <>
      {has_RecurringInvoicesEdit_permission ? (
        <RecurringInvoiceForm
          loading={loading}
          onSubmit={onSubmit}
          handleTotal={handleTotal}
          handleItemList={handleItemList}
          url={`${RECURRING_INVOICE}/${recurring_invoice_id}/edit`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditRecurringInvoices;
