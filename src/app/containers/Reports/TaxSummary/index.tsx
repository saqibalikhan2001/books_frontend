/** @format */

import React from "react";
import { SubHeader } from "./SubHeader";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { TaxSummaryReportListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetTaxSummaryReportsListingQuery } from "store/query/taxSummary";
import { usePermissions } from "app/Hooks";

export default function TaxSummaryReport() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_TaxSummaryReportView_permission } = checkPermission("TaxSummaryReportView");

  const { data, isFetching } = useGetTaxSummaryReportsListingQuery(
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
      ) : !has_TaxSummaryReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <TaxSummaryReportListing
            listing={data}
            pagination={paginate}
            setparam={handlePagination}
          />
          {data?.data?.length === 0 && (
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
