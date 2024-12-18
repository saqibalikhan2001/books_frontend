import React from "react";
import { SubHeader } from "./SubHeader";
import { JournalListng } from "./Listing";
import { usePermissions } from "app/Hooks";
import { AccessDenied, PageHeaderX, Spinner } from "app/shared";
import InitialJournalScreen from "./InitialDashboardScreen";
import { useGetJournalListingQuery } from "store/query/journal";
import { useCustomPagination } from "app/Hooks/useCustomPagination";

export default function Journals() {
  const { checkPermission, fetchingRoles } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("journal");
  const { has_JournalView_permission } = checkPermission("JournalView");
  const { data, isFetching } = useGetJournalListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: !has_JournalView_permission,
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
          <PageHeaderX.SubHeader enabled={false} title={"Journal"} btnText={""} navigateTo={""} />
          <div className={`dashboard--charts initial-screen`}>
            <InitialJournalScreen />
          </div>
        </>
      ) : !has_JournalView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <SubHeader enable={true} noData={false} />

          <JournalListng
            showDetail={false}
            pagination={paginate}
            setparam={handlePagination}
            listing={data?.data?.journal?.data}
            total={data?.data?.journal?.total}
            last_page={data?.data?.journal?.last_page}
          />
        </>
      )}
    </div>
  );
}
