/** @format */

import React from "react";
import { SubHeader } from "./SubHeader";
import { AccessDenied, Spinner } from "app/shared";
import { ReceivableSummaryReportListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetReceivableSummaryReportsListingQuery } from "store/query/receivableSummary";
import { EmptyIcon } from "app/shared/EmptyIcon";
import { usePermissions } from "app/Hooks";

export default function ReceivableSummary() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_ReceivableSummaryReportView_permission } = checkPermission(
    "ReceivableSummaryReportView"
  );
  const { data, isFetching } = useGetReceivableSummaryReportsListingQuery(
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
      ) : !has_ReceivableSummaryReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <ReceivableSummaryReportListing
            listing={data}
            pagination={paginate}
            setparam={handlePagination}
          />
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
