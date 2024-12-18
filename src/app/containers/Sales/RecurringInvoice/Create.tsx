/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routeNames, endpoints, Content } from "static";
import { AccessDenied, PageHeaderX, Toast } from "app/shared";
import { RecurringInvoiceForm } from "./RecurringInvoiceForm";
import { useLoading, useAxios, usePermissions } from "app/Hooks";
import { getFullDateAndTime, setSessionAndLocalObj } from "utils";
import { RecurringInvoiceDataSourceProps, RecurringInoviceSubmit } from "./Types";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";

const { RECURRING_INVOICES } = routeNames;
const { new_recurring_invoice } = Content;
const { RECURRING_INVOICE, RECURRING_INVOICE_CREATE } = endpoints;

const CreateRecurringInvoice = () => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [total, setTotal] = useState(0);
  const [loading, toggle] = useLoading();
  const { checkPermission } = usePermissions();
  const [item, setItem] = useState<RecurringInvoiceDataSourceProps[]>();
  const { has_RecurringInvoicesCreate_permission } = checkPermission("RecurringInvoicesCreate");

  const { data: terms = [] } = useGetInvoiceTermsListQuery("");
  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback(
    (items: RecurringInvoiceDataSourceProps[]) => setItem(items),
    []
  );

  const onSubmit = (values: RecurringInoviceSubmit) => {
    let final_string;
    if (typeof values.repeat_duration === "string") {
      const repeat = values.repeat_duration.split(" ");
      final_string = repeat[0] + " " + repeat[1].split("(s)")[0].toLowerCase();
    }
    const repeatDuration = final_string || values.repeat_duration.value;
    if (!item?.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      toggle();
      callAxios({
        method: "post",
        url: `${RECURRING_INVOICE}`,
        data: {
          ...values,
          total: total,
          items: item,
          discount_type: "",
          repeat_duration: repeatDuration,
          adjustment: values.adjustment || 0,
          shipping_charge: values.shipping_charge || 0,
          invoice_terms:
            typeof values.invoice_terms !== "object"
              ? terms.find((val: { id: any }) => val.id === values.invoice_terms) || {}
              : values.invoice_terms,
          end_date: getFullDateAndTime(values.end_date),
          start_date: getFullDateAndTime(values.start_date),
        },
      }).then((res) => {
        toggle();
        if (res) {
          Toast({ message: res.message });
          setSessionAndLocalObj(res?.data?.id, true, "Recurringinvoices");
          navigate(-1);
        }
      });
    }
  };

  return (
    <>
      {has_RecurringInvoicesCreate_permission ? (
        <>
          <PageHeaderX title={new_recurring_invoice} navigateTo={RECURRING_INVOICES} />

          <RecurringInvoiceForm
            create
            loading={loading}
            onSubmit={onSubmit}
            handleTotal={handleTotal}
            url={RECURRING_INVOICE_CREATE}
            handleItemList={handleItemList}
          />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default CreateRecurringInvoice;
