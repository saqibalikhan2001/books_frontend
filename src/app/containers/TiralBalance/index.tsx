import React from "react";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { TrialBalanceListing } from "./Listing";
import { AccessDenied, PageHeaderX, Spinner } from "app/shared";
import InitialTrialBalanceScreen from "./InitialDashboardScreen";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetTrialBalanceListingQuery } from "store/query/trialBalance";

export default function TrialBalance() {
  const { checkPermission, fetchingRoles } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("trialBalance");
  const { has_TrialBalanceView_permission } = checkPermission("TrialBalanceView");
  const { data, isFetching } = useGetTrialBalanceListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_TrialBalanceView_permission,
    }
  );
  const showOnboardScreen = data?.show_onboard_screen;

  if (fetchingRoles || isFetching) {
    return <Spinner directionSize={"91vh"} />;
  }

  return (
    <div>
      {showOnboardScreen ? (
        <>
          <PageHeaderX.SubHeader btnText="" navigateTo="" enabled={false} title={"Trial Balance"} />
          <div className={`dashboard--charts ${data?.show_onboard_screen ? "initial-screen" : ""}`}>
            <InitialTrialBalanceScreen />
          </div>
        </>
      ) : !has_TrialBalanceView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <SubHeader enable={true} noData={false} />
          <TrialBalanceListing
            showDetail={false}
            listing={data?.data}
            pagination={paginate}
            setparam={handlePagination}
          />
        </>
      )}
    </div>
  );
}
