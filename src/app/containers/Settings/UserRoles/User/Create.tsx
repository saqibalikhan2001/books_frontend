/** @format */

import { useNavigate } from "react-router-dom";
import { Toast } from "app/shared";
import { setKeyInLS } from "utils";
import { endpoints, routeNames } from "static";
import { useLoading, useAxios } from "app/Hooks";
import { InviteUserModal } from "./InviteUserModal";
import { CreateInviteUserProps, submitCreateUserProps } from "../Types";

const { USERS } = routeNames;
const { INVITE_USER } = endpoints;

export const CreateInviteUser = ({
  url,
  bool,
  //@ts-ignore
  refetch,
  toggle: Toggle,
  has_permission,
}: CreateInviteUserProps) => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [loading, toggle] = useLoading();

  const onSubmit = (values: submitCreateUserProps) => {
    toggle();
    callAxios({
      method: "post",
      data: { ...values },
      url: INVITE_USER,
    })
      .then((res) => {
        toggle();
        if (res) {
          Toast({ message: res.message });
          setKeyInLS("tabKey", "1");
          Toggle();
          // refetch();
          navigate(`${USERS}?tab=1`);
        }
      })
      .catch((error) => {
        Toast({ message: error.message });
        toggle();
      });
  };

  return (
    <>
      <InviteUserModal
        url={url}
        bool={bool}
        toggle={Toggle}
        loading={loading}
        onSubmit={onSubmit}
        has_permission={has_permission}
      />
    </>
  );
};
