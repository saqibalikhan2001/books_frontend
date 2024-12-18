/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const EstimateList = () => {
  const { checkPermission } = usePermissions();
  const { has_ESTTablePreferenceEdit_permission } = checkPermission("ESTTablePreferenceEdit");
  const { data, isLoading, refetch } = useGetTablePrefQuery("estimates", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        name="Estimates"
        className="navigate"
        from="Table Preference"
      />
      <div className="_container">
        <LockPreference
          data={data}
          url="estimates"
          refetch={refetch}
          isLoading={isLoading}
          permission={has_ESTTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
