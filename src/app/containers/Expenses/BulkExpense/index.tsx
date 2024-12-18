/** @format */

import { useNavigate } from "react-router";
import { Toast } from "app/shared";
import { endpoints } from "static";
import { BulkExpenseForm } from "./Form";
import { useAxios, useCreateFormApi } from "app/Hooks";

const { BULK_EXPENSES } = endpoints;

const BulkExpense = () => {
  const navigate = useNavigate();
  const { callAxios, toggle, bool } = useAxios();
  const { details } = useCreateFormApi("expenses/create");

  const handleSubmit = (values) => {
    toggle();
    callAxios({
      method: "post",
      url: BULK_EXPENSES,
      data: values,
    }).then((res) => {
      if (res) {
        Toast({ message: res.message });
        navigate(-1);
      }
    });
  };
  return <BulkExpenseForm loading={bool} onSubmit={handleSubmit} createFormData={details} />;
};

export default BulkExpense;
