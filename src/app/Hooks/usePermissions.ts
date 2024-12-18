/**@format */

import { useGetRolepermissionQuery } from "store/query/permissions";
import { generateRoleOptions } from "utils";
import { useStore } from "app/Hooks";

export const usePermissions = () => {
  const { organization_id = "" } = useStore();
  const { data: { permissions = {} } = {}, isLoading } = useGetRolepermissionQuery("", {
    skip: !organization_id,
    refetchOnFocus: true,
  });
  const checkPermission = (name: string) => {
    let arr = Object.entries(permissions);
    var has_permission = false,
      key_name = "";
    for (const [key, value] of arr) {
      if (key === "superAccess" && value) {
        has_permission = value as boolean;
        key_name = name;
        break;
      } else if (name === key) {
        has_permission = value as boolean;
        key_name = key;
        break;
      }
    }
    return { [`has_${key_name}_permission`]: has_permission };
  };

  const checkAllPermissions = (moduleName: string) => {
    let arr = Object.entries(permissions);

    const roles = generateRoleOptions([moduleName]);
    var has_permission = false;
    for (const [key, value] of arr) {
      if (key === "superAccess" && value) {
        has_permission = value as boolean;
        break;
      }
    }
    return {
      ...roles.map((val) => has_permission && { [`has_${val}_permission`]: has_permission }),
    };
  };

  return { permissions, checkPermission, checkAllPermissions, fetchingRoles: isLoading };
};
