/**@format */

import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints, routeNames } from "static";
import { UserOrganizations } from "store/types";
import { RootState, useTypedDispatch, useTypedSelector } from "store";
import { currentUserRole, setDetails } from "store/slices/authSlice";
import getDateFormat from "utils/GetDateFormat";

export const useStore = () => {
  const navigate = useNavigate();
  let is_default = {} as UserOrganizations;
  const dispatch = useTypedDispatch();
  const {
    drawer,
    organization_id,
    modulePermissionModal,
    users_organizations = [],
    token: { access_token, id_token },
    details: { current_organization_id = null, id: user_id = null, ...rest },
    role,
  } = useTypedSelector(({ authReducer }: RootState) => authReducer);
  const primary_organization: UserOrganizations = useMemo(
    () =>
      users_organizations.filter((org: any) => org.id === current_organization_id)?.[0] ||
      ({} as UserOrganizations),
    [current_organization_id, users_organizations]
  );

  if (!primary_organization?.id) {
    is_default = users_organizations.length ? users_organizations[0] : ({} as UserOrganizations);
  }

  const handleUpdateUserWithRoles = useCallback((detail, status = false) => {
    const { users_organizations = [] } = detail || {};
    const orgs = users_organizations.filter((val) => !val.is_unshared);
    dispatch(setDetails(detail));
    detail?.current_organization_id &&
      dispatch(
        currentUserRole({
          url: endpoints.CURRENT_USER_ROLE,
        })
      );
    if (status && !orgs.length)
      navigate(routeNames.REGISTER_ORGANIZATION, {
        replace: true,
      });
    //eslint-disable-next-line
  }, []);

  const created_by_platform = users_organizations.find(
    (org) => Number(org.id) === Number(organization_id)
  )?.created_by_platform;

  const org_date_format = getDateFormat(
    users_organizations.find((org) => Number(org.id) === Number(organization_id))
  );

  const country_id = users_organizations.find(
    (org) => Number(org.id) === Number(organization_id)
  )?.country_id;

  const country_name = users_organizations.find(
    (org) => Number(org.id) === Number(organization_id)
  );
  const TimeZone = users_organizations.find((org) => org.id === current_organization_id)?.time_zone;

  return {
    drawer,
    id_token,
    country_id,
    is_default,
    access_token,
    //@ts-ignore
    country_name: country_name?.country?.country_name,
    org_date_format,
    organization_id,
    created_by_platform,
    users_organizations,
    primary_organization,
    modulePermissionModal,
    current_organization_id,
    currentOrganization: rest,
    currentUserOrganization: users_organizations?.find((org) => org.id === current_organization_id),
    handleUpdateUserWithRoles,
    TimeZone,
    role,
    user_id,
  };
};
