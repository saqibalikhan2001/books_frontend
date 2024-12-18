/** @format */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RolesListing from "./Listing";
import { AccessDenied } from "app/shared";
import { roleDetailProps } from "../Types";
import { endpoints, routeNames } from "static";
import { useAxios, usePermissions } from "app/Hooks";
import { SpinnerX } from "app/shared/PageLoader";

const { ROLE } = endpoints;
const { EDIT_ROLE } = routeNames;

// export const RoleDetails = ({ bool, toggle }: roleDetailProps) => {
export const RoleDetails = ({
  data,
  refetch,
  isLoading,
  isFetching,
  onChange,
}: roleDetailProps) => {
  const navigate = useNavigate();
  const { handleConfirm } = useAxios();
  // const [current, setCurrent] = useState({});
  const { checkPermission, fetchingRoles } = usePermissions();
  // const { bool: boolean, toggle: toggleEdit } = useBool();

  const { has_RoleView_permission } = checkPermission("RoleView");
  // const { has_RoleEdit_permission } = checkPermission("RoleEdit");
  // const { has_RoleCreate_permission } = checkPermission("RoleCreate");
  const { has_RoleDelete_permission } = checkPermission("RoleDelete");

  // useEffect(() => {
  //   setTotal(data?.total);
  //   //eslint-disable-next-line
  // }, [data?.total]);

  const handleClick = (curr: any) => {
    navigate(`${EDIT_ROLE}?id=${curr.id}`);
    // setCurrent({ ...curr, permissions: JSON.parse(curr.permissions) });
    // toggleEdit();
  };

  const memoizeClick = useCallback(handleClick, [navigate]);
  const memoizeConfirm = useCallback(
    (param) => handleConfirm(param, ROLE, refetch),
    [handleConfirm, refetch]
  );
  if (fetchingRoles) return <SpinnerX />;
  return (
    <>
      {/* <CreateRole
        // bool={bool}
        // toggle={toggle}
        refetch={refetch}
        dispatch={dispatch}
        setAlert={setAlert}
        roleAlert={roleAlert}
        itemPermissions={itemPermissions}
        has_permission={has_RoleCreate_permission}
      /> */}
      {has_RoleView_permission ? (
        <RolesListing
          // total={total}
          list={data || []}
          onChange={onChange}
          handleClick={memoizeClick}
          handleConfirm={memoizeConfirm}
          loading={isFetching || isLoading}
          has_permission={has_RoleDelete_permission}
        />
      ) : (
        <AccessDenied />
      )}
      {/* {boolean && (
        <EditRole
          // bool={boolean}
          refetch={refetch}
          current={current}
          setAlert={setAlert}
          // toggle={toggleEdit}
          dispatch={dispatch}
          roleAlert={roleAlert}
          itemPermissions={itemPermissions}
          has_permission={has_RoleEdit_permission}
        />
      )} */}
    </>
  );
};
