/** @format */

import React, { useState } from "react";
import { SubHeader } from "./SubHeader";
import { BillReportListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetBillReportsListingQuery } from "store/query/billReports";
import { usePermissions } from "app/Hooks";

export default function BillReport() {
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(false);
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_BillReportView_permission } = checkPermission("BillReportView");
  const { data, isFetching } = useGetBillReportsListingQuery(
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
      ) : !has_BillReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <BillReportListing
            pagination={paginate}
            listing={data}
            setparam={handlePagination}
            popOver={popOver}
            setPopOver={setPopOver}
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
