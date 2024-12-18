/** @format */

import { endpoints } from "static";
import { Toast } from "app/shared";
import { useAxios } from "app/Hooks";
import { useLoading } from "app/Hooks/useLoading";
import { InviteUserModal } from "./InviteUserModal";
import { EditInviteUserFormProps } from "../Types";

const { ORGANIZATIONS, USERS } = endpoints;

export const EditInviteUserForm = ({
  url,
  bool,
  toggle,
  current,
  refetch,
  has_permission,
}: EditInviteUserFormProps) => {
  const { callAxios } = useAxios();
  const [loading, , setTrue, setFalse] = useLoading();

  const onSubmit = (values: any) => {
    setTrue();
    callAxios({
      method: "put",
      data: values,
      url: `${ORGANIZATIONS}${USERS}/${current.id}`,
    }).then((res) => {
      setFalse();
      if (res) {
        toggle();
        refetch();
        Toast({ message: res.message });
      }
    });
  };

  return (
    <>
      <InviteUserModal
        isEdit
        url={url}
        bool={bool}
        toggle={toggle}
        loading={loading}
        onSubmit={onSubmit}
        has_permission={has_permission}
      />
    </>
  );
};
