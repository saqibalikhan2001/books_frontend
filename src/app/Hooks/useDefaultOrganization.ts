import { RootState, useTypedSelector } from "store";
import { useGetOrganizationsQuery } from "store/query/organization";
import { useGetRolepermissionQuery } from "store/query/permissions";
import { useStore } from "app/Hooks";

export const useDefaultOrganization = (skip_Collapse?: boolean) => {
  const { organization_id = "" } = useStore();
  const { data } = useGetRolepermissionQuery("", { skip: !organization_id });
  const default_org = {} as any;
  const {
    data: { organizations = [], general_modules = [] } = {},
    isLoading,
    refetch,
  } = useGetOrganizationsQuery("", {
    skip: skip_Collapse,
  });

  const {
    details: { current_organization_id = null },
  } = useTypedSelector(({ authReducer }: RootState) => authReducer);

  const primary_organization = organizations.filter(
    (org: any) => org.organizations.is_default && org.organizations.is_owner
  )[0];

  if (!primary_organization?.id) {
    default_org.is_default = organizations.length ? organizations[0] : [];
  }

  const current_User_Organization = organizations?.find(
    (org) => org?.organizations?.id === current_organization_id
  );

  return {
    refetch,
    isLoading,
    organizations,
    ...default_org,
    general_modules,
    primary_organization,
    current_User_Organization,
    permissions: data?.permissions,
    country_id: current_User_Organization?.organizations?.country?.id,
    country_name: current_User_Organization?.organizations?.country?.country_name,
  };
};
