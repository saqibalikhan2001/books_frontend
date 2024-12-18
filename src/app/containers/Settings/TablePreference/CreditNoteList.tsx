/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const CreditNoteList = () => {
  const { checkPermission } = usePermissions();
  const { has_CNTablePreferenceEdit_permission } = checkPermission("CNTablePreferenceEdit");
  const { data, isLoading, refetch } = useGetTablePrefQuery("credit-notes", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        name="Credit notes"
        className="navigate"
        from="Table Preference"
      />
      <div className="_container">
        <LockPreference
          refetch={refetch}
          data={data}
          url="credit-notes"
          isLoading={isLoading}
          permission={has_CNTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
