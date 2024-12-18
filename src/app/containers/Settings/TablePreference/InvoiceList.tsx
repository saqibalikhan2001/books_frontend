/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const InvoiceList = () => {
  const { checkPermission } = usePermissions();
  const { has_INVTablePreferenceEdit_permission } = checkPermission("INVTablePreferenceEdit");
  const { data, isLoading, refetch } = useGetTablePrefQuery("invoices", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        name="Invoices"
        className="navigate"
        from="Table Preference"
      />
      <div className="_container">
        <LockPreference
          data={data}
          url="invoices"
          refetch={refetch}
          isLoading={isLoading}
          permission={has_INVTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
