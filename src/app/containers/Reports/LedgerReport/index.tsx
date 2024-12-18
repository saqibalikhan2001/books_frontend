/** @format */

import React from "react";
import { SubHeader } from "./SubHeader";
import { LedgerReportListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetLedgerReportsListingQuery } from "store/query/ledgerReports";
import { usePermissions } from "app/Hooks";

export default function LedgerReport() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_GeneralLedgerReportView_permission } = checkPermission("GeneralLedgerReportView");
  const { data, isFetching } = useGetLedgerReportsListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  return (
    <div>
      <SubHeader />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_GeneralLedgerReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <LedgerReportListing pagination={paginate} listing={data} setparam={handlePagination} />
          {data?.data?.length <= 0 && (
            <div
              style={{
                display: "flex",
                height: "600px",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <EmptyIcon />
              <span>No record found</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
