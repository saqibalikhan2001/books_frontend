/** @format */

import { useCallback, useState } from "react";
import { endpoints } from "static";
import UsersListing from "./Listing";
import { AccessDenied } from "app/shared";
import { EditInviteUserForm } from "./Edit";
// import { CreateInviteUser } from "./Create";
import { inviteUserDetailProps } from "../Types";
import { SpinnerX } from "app/shared/PageLoader";
import { useAxios, useBool, usePermissions } from "app/Hooks";

const { INVITE_USER, DELETE_BOOKS_INVITE_USER } = endpoints;

export const UserDetails = ({
  data,
  refetch,
  onChange,
  isLoading,
  isFetching,
}: inviteUserDetailProps) => {
  const { handleConfirm } = useAxios();
  const [current, setCurrent] = useState({});
  const { checkPermission, fetchingRoles } = usePermissions();
  const { bool: editInvite, toggle: toggleInvite } = useBool();

  const { has_UserView_permission } = checkPermission("UserView");
  const { has_UserEdit_permission } = checkPermission("UserEdit");
  const { has_UserDelete_permission } = checkPermission("UserDelete");
  // const { has_InviteCreate_permission } = checkPermission("InviteCreate");

  // useEffect(() => {
  //   setTotal(data?.total);
  //   //eslint-disable-next-line
  // }, [data?.total]);

  const handleClick = (data: any) => {
    setCurrent(data);
    toggleInvite();
  };

  const memoizeClick = useCallback(handleClick, [toggleInvite]);
  const memoizeConfirm = useCallback(
    (params) => {
      const Url = params?.is_invited === 0 ? DELETE_BOOKS_INVITE_USER : INVITE_USER;
      handleConfirm(params, Url, refetch);
    },
    [handleConfirm, refetch]
  );
  if (fetchingRoles) return <SpinnerX />;

  return (
    <>
      {/* <CreateInviteUser
        bool={bool}
        toggle={toggle}
        refetch={refetch}
        url={`${INVITE_USER}${CREATE}`}
        has_permission={has_InviteCreate_permission}
      /> */}
      {has_UserView_permission ? (
        <UsersListing
          // total={total}
          list={data || []}
          refetch={refetch}
          onChange={onChange}
          handleClick={memoizeClick}
          handleConfirm={memoizeConfirm}
          loading={isFetching || isLoading}
          has_permission={has_UserDelete_permission}
        />
      ) : (
        <AccessDenied />
      )}
      {editInvite && (
        <EditInviteUserForm
          url=""
          bool={editInvite}
          refetch={refetch}
          current={current}
          toggle={toggleInvite}
          has_permission={has_UserEdit_permission}
        />
      )}
    </>
  );
};
