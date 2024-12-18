/** @format */

import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { endpoints } from "static";
import { getFullDateAndTime } from "utils";
import { RecurringBillForm } from "./Form";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import { RecurringBillDataSource, SubmitValues } from "./Types";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";

const { RECURRING_BILL, EDIT, UPDATE } = endpoints;

const EditRecurringBill = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const { checkPermission } = usePermissions();
  const { callAxios, bool, toggle } = useAxios();
  const recurring_bill_id = searchParams.get("id");
  const [item, setItem] = useState<RecurringBillDataSource[]>();
  const { has_RecurringBillsEdit_permission } = checkPermission("RecurringBillsEdit");

  const { data: terms = [] } = useGetInvoiceTermsListQuery("");
  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: RecurringBillDataSource[]) => setItem(items), []);

  const onSubmit = (values: SubmitValues) => {
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
      repeat_duration: repeatDuration,
      bill_terms:
        typeof values.bill_terms !== "object"
          ? terms.find((val: { id: number }) => val.id === values.bill_terms) || {}
          : values.bill_terms,
      vendor_id: typeof values.vendor_id === "object" ? values.vendor_id?.id : values.vendor_id,
      start_date: getFullDateAndTime(values.start_date),
      end_date: getFullDateAndTime(values.end_date),
      items: item,
      total: total,
      discount_transaction_level: 0,
      adjustment: values.adjustment || 0,
    };
    toggle();
    callAxios({
      method: "put",
      url: `${RECURRING_BILL}/${recurring_bill_id}${UPDATE}`,
      data: new_values,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        navigate(-1);
      }
    });
  };
  return (
    <>
      {has_RecurringBillsEdit_permission ? (
        <RecurringBillForm
          loading={bool}
          onSubmit={onSubmit}
          handleTotal={handleTotal}
          handleItemList={handleItemList}
          url={`${RECURRING_BILL}/${recurring_bill_id}${EDIT}`}
        />
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default EditRecurringBill;
