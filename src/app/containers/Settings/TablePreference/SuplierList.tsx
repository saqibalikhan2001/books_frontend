/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const SupplierList = () => {
  const { checkPermission } = usePermissions();
  const { has_SupplierTablePreferenceEdit_permission } = checkPermission(
    "SupplierTablePreferenceEdit"
  );
  const { data, isLoading, refetch } = useGetTablePrefQuery("supplier", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        name="Suppliers"
        className="navigate"
        from="Table Preference"
      />
      <div className="_container">
        <LockPreference
          refetch={refetch}
          data={data}
          url="supplier"
          isLoading={isLoading}
          permission={has_SupplierTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
