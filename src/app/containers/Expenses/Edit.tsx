/** @format */

import { useNavigate, useSearchParams } from "react-router-dom";
import { getTotal } from "utils";
import { Toast } from "app/shared";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import ExpenseForm from "./ExpenseForm";
import { ValuesProps } from "../Sales/Types";

const { EXPENSES } = endpoints;

const EditExpense = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expense_id = searchParams.get("id");
  const { callAxios, toggle, bool } = useAxios();

  const handlePayload = (data) => {
    let payload: any;
    if (data.itemize) {
      //for future use

      // let newArray = data?.expense_details.map((expense: any) => {
      //   return {
      //     ...expense,
      //     expense_tags: tag_menupulation(expense?.expense_tags),
      //   };
      // });

      payload = {
        ...data,
        total_amount: data?.itemize && getTotal(data?.expense_details),
      };
    } else {
      payload = {
        ...data,
      };
    }
    return payload;
  };

  const handleSubmit = (values: ValuesProps) => {
    const payload = handlePayload(values);
    toggle();
    callAxios({
      method: "put",
      url: `${EXPENSES}/${expense_id}`,
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        navigate(-1);
      }
    });
  };

  return (
    <>
      <ExpenseForm loading={bool} url={`${EXPENSES}/${expense_id}/edit`} onSubmit={handleSubmit} />
    </>
  );
};

export default EditExpense;
