/**@format */

import { Breadcrumbx } from "app/shared";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";
import { usePermissions } from "app/Hooks";

export const PaymentReceivedList = () => {
  const { checkPermission } = usePermissions();
  const { has_PRTablePreferenceEdit_permission } = checkPermission("PRTablePreferenceEdit");
  const { data, isLoading, refetch } = useGetTablePrefQuery("payment-received", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        className="navigate"
        from="Table Preference"
        name="Payments receipts"
      />
      <div className="_container">
        <LockPreference
          data={data}
          refetch={refetch}
          isLoading={isLoading}
          url="payment-received"
          permission={has_PRTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
