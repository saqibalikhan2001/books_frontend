/** @format */

import { useCallback, useEffect, useState } from "react";
import { endpoints } from "static";
import { AccessDenied } from "app/shared";
import UsersListing from "./UsersListing";
import { EditInviteUserForm } from "../User/Edit";
import { useGetUserListingQuery } from "store/query/user";
import { useAxios, useBool, usePermissions, useSearchParam } from "app/Hooks";

const { USERS, ORGANIZATIONS } = endpoints;

export const UsersDetails = () => {
  const { checkPermission } = usePermissions();
  const [current, setCurrent] = useState<any>();
  const { bool: deleteBool, handleConfirm } = useAxios();
  const { bool: editUser, toggle: toggleUser } = useBool();
  const { total, getParams, setTotal } = useSearchParam("");
  const { has_UserView_permission } = checkPermission("UserView");
  const { has_UserEdit_permission } = checkPermission("UserEdit");
  const { has_UserDelete_permission } = checkPermission("UserDelete");
  const {
    data = {},
    refetch,
    isLoading,
  } = useGetUserListingQuery(getParams(), {
    refetchOnMountOrArgChange: true,
    skip: !has_UserView_permission,
  });

  useEffect(() => {
    setTotal(data?.total);
    //eslint-disable-next-line
  }, [data?.total]);

  const handleClick = (data: any) => {
    setCurrent(data);
    toggleUser();
  };

  const memoizeClick = useCallback(handleClick, [toggleUser]);
  const memoizeConfirm = useCallback(
    (params) => handleConfirm(params, `${ORGANIZATIONS}${USERS}`, refetch),
    [handleConfirm, refetch]
  );

  return (
    <>
      {has_UserView_permission ? (
        <UsersListing
          total={total}
          list={data?.data || []}
          handleClick={memoizeClick}
          handleConfirm={memoizeConfirm}
          loading={deleteBool || isLoading}
          has_permission={has_UserDelete_permission}
        />
      ) : (
        <AccessDenied />
      )}
      {editUser && (
        <EditInviteUserForm
          bool={editUser}
          current={current}
          refetch={refetch}
          toggle={toggleUser}
          has_permission={has_UserEdit_permission}
          url={`${ORGANIZATIONS}${USERS}/${current.id}/edit`}
        />
      )}
    </>
  );
};
