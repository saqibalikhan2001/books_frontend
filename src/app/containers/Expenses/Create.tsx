/** @format */

import { useNavigate } from "react-router-dom";
import { Tabs, TabsProps } from "antd";
import { getTotal } from "utils";
import { endpoints } from "static";
import BulkExpense from "./BulkExpense";
import ExpenseForm from "./ExpenseForm";
import { AccessDenied, Toast } from "app/shared";
import { useAxios, usePermissions } from "app/Hooks";
import { ValuesProps } from "app/containers/Sales/Types";

const { EXPENSES, CREATE_EXPENSES } = endpoints;

const CreateExpenses = () => {
  const navigate = useNavigate();
  const { checkPermission } = usePermissions();
  const { callAxios, toggle, bool } = useAxios();
  const { has_PurchaseOrderCreate_permission } = checkPermission("PurchaseOrderCreate");

  const handlePayload = (data: any) => {
    let payload: any;
    if (data.itemize) {
      payload = {
        ...data,
        total_amount: data?.itemize && getTotal(data?.expense_details),
        currency_id: data?.currency_id[0]?.id ? data?.currency_id[0]?.id : data?.currency_id,
      };
    } else {
      payload = {
        ...data,
        currency_id: data?.currency_id[0]?.id ? data?.currency_id[0]?.id : data?.currency_id,
      };
    }
    return payload;
  };
  const onSubmit = (values: ValuesProps) => {
    const payload = handlePayload(values);
    toggle();
    callAxios({
      method: "post",
      url: EXPENSES,
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        navigate(-1);
      }
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Expense`,
      children: <ExpenseForm loading={bool} onSubmit={onSubmit} url={CREATE_EXPENSES} />,
    },
    {
      key: "2",
      label: `Bulk Expense`,
      children: <BulkExpense />,
    },
  ];

  return (
    <>
      {has_PurchaseOrderCreate_permission ? (
        <>
          <Tabs defaultActiveKey="1" items={items} />
        </>
      ) : (
        <AccessDenied />
      )}
    </>
  );
};
export default CreateExpenses;
