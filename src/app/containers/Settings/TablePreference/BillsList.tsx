/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const BillsList = () => {
  const { checkPermission } = usePermissions();
  const { has_BillTablePreferenceEdit_permission } = checkPermission("BillTablePreferenceEdit");
  const { data, isLoading, refetch } = useGetTablePrefQuery("bills", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx from="Table Preference " className="navigate" name="Bills" setting={true} show />
      <div className="_container">
        <LockPreference
          data={data}
          url="bills"
          refetch={refetch}
          isLoading={isLoading}
          permission={has_BillTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
