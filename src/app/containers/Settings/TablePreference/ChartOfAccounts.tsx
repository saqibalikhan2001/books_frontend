/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const ChartOFAccountsList = () => {
  const { checkPermission } = usePermissions();
  const { has_AccountsTablePreferenceEdit_permission } = checkPermission(
    "AccountsTablePreferenceEdit"
  );
  const { data, isLoading, refetch } = useGetTablePrefQuery("accounts", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        className="navigate"
        name="Chart of accounts"
        from="Table Preference "
      />
      <div className="_container">
        <LockPreference
          data={data}
          url="accounts"
          refetch={refetch}
          isLoading={isLoading}
          permission={has_AccountsTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
