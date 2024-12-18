/** @format */

import { useNavigate } from "react-router";
import { endpoints } from "static";
import { Toast } from "app/shared";
import { convertInNumber } from "utils";
import { AccountsModal } from "./AccountsModal";
import { useAxios, useLoading } from "app/Hooks";
import { CreateAccountProps, AccountSubmitProps } from "./types";

const { ACCOUNT_NAME } = endpoints;

export const CreateAccount = ({
  bool,
  query,
  toggle,
  refetch,
  from = "",
  isItemForm,
  has_permission,
}: CreateAccountProps) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [loading, , setTrue, setFalse] = useLoading();

  // const handleCancel = () => {
  //   toggle();
  //   !isItemForm && navigate("/accounts");
  // };
  const onSubmit = (values: AccountSubmitProps) => {
    setTrue();
    callAxios({
      method: "post",
      data: {
        ...values,
        currency: values?.currency?.id,
        account_type_id:
          typeof values?.account_type_id == "number"
            ? values?.account_type_id
            : values.account_type_id?.id,
        account_subtype_id:
          typeof values.account_subtype_id == "number"
            ? values.account_subtype_id
            : values.account_subtype_id?.id,
        balance: convertInNumber(values?.balance),
      },
      url: ACCOUNT_NAME,
    })
      .then((res) => {
        if (res) {
          setFalse();
          toggle?.(query, res?.data);
          refetch?.();
          Toast({ message: res.message });
          !from && navigate("/accounts");
        }
      })
      .catch((err) => {
        Toast({ message: err.message });
        setFalse();
      });
  };

  return (
    <>
      <AccountsModal
        bool={bool}
        toggle={toggle}
        loading={loading}
        onSubmit={onSubmit}
        isItemForm={isItemForm}
        has_permission={has_permission}
        url={`/accounts/create${query ? `?type=${query}` : ""}`}
      />
    </>
  );
};
