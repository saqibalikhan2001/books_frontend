import React from "react";
import { SubHeader } from "./SubHeader";
import { LedgerListing } from "./Listing";
import { usePermissions } from "app/Hooks";
import InitialLedgerScreen from "./InitialDashboardscreen";
import { useGetLedgerListingQuery } from "store/query/ledger";
import { AccessDenied, PageHeaderX, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";

export default function Ledgers() {
  const { checkPermission, fetchingRoles } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("ledger");
  const { has_LedgerView_permission } = checkPermission("LedgerView");
  const { data, isFetching } = useGetLedgerListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_LedgerView_permission,
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
          <PageHeaderX.SubHeader enabled={false} title={"Ledger"} btnText={""} navigateTo={""} />
          <div className={`dashboard--charts ${data?.show_onboard_screen ? "initial-screen" : ""}`}>
            <InitialLedgerScreen />
          </div>
        </>
      ) : !has_LedgerView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <SubHeader enable={true} noData={false} />
          <LedgerListing
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
