/**@format */

import { useMemo } from "react";
import { RootState, useTypedSelector } from "store";
import { useDefaultOrganization } from "./useDefaultOrganization";

export const useSharedOrganization = () => {
  const { organization_id, users_organizations = [] } = useTypedSelector(
    ({ authReducer }: RootState) => authReducer
  );

  const { current_User_Organization: { organizations: { module_permissions = [] } = {} } = {} } =
    useDefaultOrganization();

  const sharedOrg = useMemo(
    () => users_organizations.find((val) => val.id === +organization_id),
    [organization_id, users_organizations]
  );

  const ownerOrg = useMemo(
    () => users_organizations.find((val) => val.id === sharedOrg?.id),
    [sharedOrg?.id, users_organizations]
  );

  const checkModulePermission = (moduleSlug: string) => {
    return (
      !sharedOrg?.module_permissions?.find(({ slug }: { slug: string }) => slug === moduleSlug)
        ?.status || false
    );
  };

  const getCurrentModule = (slugs: string) => {
    return module_permissions?.find(({ slug }: { slug: string }) => slug === slugs);
  };

  const handleModulePermission = (module, general_modules) => {
    let all_modules = general_modules.map((val) => ({ ...val, status: false }));
    module?.forEach((ch) => {
      general_modules.forEach((md, i) => {
        if (md?.name === ch) {
          all_modules[i] = {
            ...all_modules[i],
            status: true,
          };
        }
      });
    });

    return all_modules;
  };

  return {
    ownerOrg,
    sharedOrg,
    organization_id,
    getCurrentModule,
    users_organizations,
    checkModulePermission,
    handleModulePermission,
  };
};
