/** @format */

import { endpoints } from "static";
import { Toast } from "app/shared";
import { AccountSubmitProps } from "./types";
import { AccountsModal } from "./AccountsModal";
import { useAxios, useLoading } from "app/Hooks";

const { ACCOUNT_NAME } = endpoints;

export const EditAccount = ({
  bool,
  toggle,
  refetch,
  account,
  has_permission,
  setEditAccount,
}: any) => {
  const { callAxios } = useAxios();
  const [loading, , setTrue, setFalse] = useLoading();

  const onSubmit = (values: AccountSubmitProps) => {
    setTrue();
    callAxios({
      method: "put",
      data: {
        ...values,
        currency: values?.currency?.id,
        tax_id: values?.tax_id === undefined ? null : values?.tax_id,
        account_type_id:
          //@ts-ignore
          typeof values.account_type_id == "number"
            ? //@ts-ignore
              values.account_type_id
            : //@ts-ignore
              values.account_type_id?.id,
        //@ts-ignore
        account_subtype_id:
          //@ts-ignore
          typeof values.account_subtype_id == "number"
            ? //@ts-ignore
              values.account_subtype_id
            : //@ts-ignore
              values.account_subtype_id?.id,
      },
      url: `${ACCOUNT_NAME}/${account.id}`,
    }).then((res) => {
      setFalse();
      if (res) {
        toggle?.();
        refetch();
        setEditAccount?.(null);
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <AccountsModal
        edit
        bool={bool}
        toggle={toggle}
        account={account}
        loading={loading}
        onSubmit={onSubmit}
        setEditAccount={setEditAccount}
        has_permission={has_permission}
        url={`/accounts/${account?.id}/edit`}
      />
    </>
  );
};
