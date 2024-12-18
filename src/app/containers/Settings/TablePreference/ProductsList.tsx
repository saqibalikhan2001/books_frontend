/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const ProductList = () => {
  const { checkPermission } = usePermissions();
  const { data, isLoading, refetch } = useGetTablePrefQuery("item", {
    refetchOnMountOrArgChange: true,
  });
  const { has_ItemTablePreferenceEdit_permission } = checkPermission("ItemTablePreferenceEdit");

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        className="navigate"
        from="Table Preference"
        name="Products & Services"
      />
      <div className="_container">
        <LockPreference
          url="item"
          data={data}
          refetch={refetch}
          isLoading={isLoading}
          permission={has_ItemTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
