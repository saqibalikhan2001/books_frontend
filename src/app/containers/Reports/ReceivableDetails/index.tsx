/** @format */

import React from "react";
import { SubHeader } from "./SubHeader";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { ReceivableDetailsReportListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetReceivableDetailReportsListingQuery } from "store/query/receivableDetailReport";
import { usePermissions } from "app/Hooks";

export default function ReceivableDetails() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_ReceivableDetailReportView_permission } = checkPermission(
    "ReceivableDetailReportView"
  );

  const { data, isFetching } = useGetReceivableDetailReportsListingQuery(
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
      ) : !has_ReceivableDetailReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <ReceivableDetailsReportListing
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
              <EmptyIcon />
              <span>No record found</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
