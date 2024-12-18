/**@format */

import { Breadcrumbx } from "app/shared";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";
import { usePermissions } from "app/Hooks";

export const CustomerList = () => {
  const { checkPermission } = usePermissions();
  const { data, isLoading, refetch } = useGetTablePrefQuery("customer", {
    refetchOnMountOrArgChange: true,
  });
  const { has_CustomerTablePreferenceEdit_permission } = checkPermission(
    "CustomerTablePreferenceEdit"
  );

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        name="Customers"
        className="navigate"
        from="Table Preference"
      />
      <div className="_container">
        <LockPreference
          data={data}
          url="customer"
          refetch={refetch}
          isLoading={isLoading}
          permission={has_CustomerTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
