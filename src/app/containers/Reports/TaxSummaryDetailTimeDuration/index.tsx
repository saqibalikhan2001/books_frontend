/** @format */

import React from "react";
import { SubHeader } from "./SubHeader";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { TaxSummaryDetailTimeDurationListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetTaxSummaryDetailTimeDurationListingQuery } from "store/query/taxSummaryDetailTimeDuration";
import { usePermissions } from "app/Hooks";

export default function TaxSummaryDetailTimeDuration() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination, Prev, Next, handlePage, handleRowSize } =
    useCustomPagination("reports");
  const { has_TaxByProductsTimeDurationReportView_permission } = checkPermission(
    "TaxByProductsTimeDurationReportView"
  );

  const { data, isFetching } = useGetTaxSummaryDetailTimeDurationListingQuery(
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
      ) : !has_TaxByProductsTimeDurationReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <TaxSummaryDetailTimeDurationListing
            Prev={Prev}
            Next={Next}
            listing={data}
            pagination={paginate}
            handlePage={handlePage}
            handleRowSize={handleRowSize}
            setparam={handlePagination}
          />
          {data?.data?.data?.length <= 0 && (
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
