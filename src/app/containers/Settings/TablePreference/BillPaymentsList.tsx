/**@format */

import { Breadcrumbx } from "app/shared";
import { usePermissions } from "app/Hooks";
import LockPreference from "./common/lockPreference";
import { useGetTablePrefQuery } from "store/query/tablePref";

export const BillPaymentsList = () => {
  const { checkPermission } = usePermissions();
  const { has_BillPaymentTablePreferenceEdit_permission } = checkPermission(
    "BillPaymentTablePreferenceEdit"
  );
  const { data, isLoading, refetch } = useGetTablePrefQuery("bill-payment-received", {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="main_wrapper preference_form">
      <Breadcrumbx
        show
        setting={true}
        className="navigate"
        name="Bill payments"
        from="Table Preference "
      />
      <div className="_container">
        <LockPreference
          data={data}
          refetch={refetch}
          isLoading={isLoading}
          url="bill-payment-received"
          permission={has_BillPaymentTablePreferenceEdit_permission}
        />
      </div>
    </div>
  );
};
