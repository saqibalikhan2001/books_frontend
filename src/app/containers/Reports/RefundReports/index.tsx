/** @format */

import React, { useState } from "react";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { RefundReportListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetRefundReportListingQuery } from "store/query/refundReport";

export default function RefundReport() {
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(false);
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_RefundReportView_permission } = checkPermission("RefundReportView");

  const { data, isFetching } = useGetRefundReportListingQuery(
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
      ) : !has_RefundReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <RefundReportListing
            listing={data}
            popOver={popOver}
            pagination={paginate}
            setPopOver={setPopOver}
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