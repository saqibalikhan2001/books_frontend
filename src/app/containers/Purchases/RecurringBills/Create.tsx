/** @format */

import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecurringBillForm } from "./Form";
import { useAxios, usePermissions } from "app/Hooks";
import { Content, endpoints, routeNames } from "static";
import { AccessDenied, PageHeaderX, Toast } from "app/shared";
import { RecurringBillDataSource, SubmitValues } from "./Types";
import { getFullDateAndTime, setSessionAndLocalObj } from "utils";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";

const { RECURRING_BILLS } = routeNames;
const { RECURRING_BILL, CREATE } = endpoints;

const CreateRecurringBill = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const { checkPermission } = usePermissions();
  const { callAxios, bool, toggle } = useAxios();
  const [item, setItem] = useState<RecurringBillDataSource[]>();
  const { has_RecurringBillsCreate_permission } = checkPermission("RecurringBillsCreate");

  const { data: terms = [] } = useGetInvoiceTermsListQuery("");
  const handleTotal = useCallback((total: number) => setTotal(total), []);
  const handleItemList = useCallback((items: RecurringBillDataSource[]) => setItem(items), []);

  const onSubmit = (values: SubmitValues) => {
    let final_string;
    if (typeof values.repeat_duration === "string") {
      const repeat = values.repeat_duration.split(" ");
      final_string = repeat[0] + " " + repeat[1].split("(s)")[0].toLowerCase();
    }
    const repeatDuration = final_string || values.repeat_duration.value;
    if (!item?.length) {
      Toast({ message: Content.select_item, type: "error" });
    } else {
      const new_values = {
        ...values,
        repeat_duration: repeatDuration,
        bill_terms:
          typeof values.bill_terms !== "object"
            ? terms.find((val: { id: number }) => val.id === values.bill_terms) || {}
            : values.bill_terms,
        start_date: getFullDateAndTime(values.start_date),
        end_date: getFullDateAndTime(values.end_date),
        items: item,
        total: total,
        discount_transaction_level: 0,
        adjustment: values.adjustment || 0,
      };
      toggle();
      callAxios({
        method: "post",
        url: RECURRING_BILL,
        data: new_values,
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          setSessionAndLocalObj(res?.data?.id, true, "recurringbills");
          navigate(-1);
        }
      });
    }
  };

  return (
    <>
      {has_RecurringBillsCreate_permission ? (
        <>
          <PageHeaderX title="Create Recurring Bill" navigateTo={RECURRING_BILLS} />

          <RecurringBillForm
            create
            loading={bool}
            onSubmit={onSubmit}
            handleTotal={handleTotal}
            handleItemList={handleItemList}
            url={`${RECURRING_BILL}${CREATE}`}
          />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};

export default CreateRecurringBill;
