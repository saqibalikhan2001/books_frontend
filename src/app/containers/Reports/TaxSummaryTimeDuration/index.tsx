/** @format */

import React from "react";
import { SubHeader } from "./SubHeader";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { TaxSummaryTimeDurationListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetTaxSummaryTimeDurationListingQuery } from "store/query/taxSummaryTimeDuration";
import { usePermissions } from "app/Hooks";

export default function TaxSummaryTimeDuration() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_TaxSummaryTimeDurationReportView_permission } = checkPermission(
    "TaxSummaryTimeDurationReportView"
  );

  const { data, isFetching } = useGetTaxSummaryTimeDurationListingQuery(
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
      ) : !has_TaxSummaryTimeDurationReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <TaxSummaryTimeDurationListing
            listing={data}
            pagination={paginate}
            setparam={handlePagination}
          />
          {data?.taxes?.length <= 0 && (
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
