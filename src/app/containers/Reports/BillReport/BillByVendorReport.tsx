/** @format */

import React, { useState, useEffect } from "react";
import { setKeyInSS } from "utils";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { BillReportListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetBillReportsListingQuery } from "store/query/billReports";

export default function BillByVendorReport() {
  const [apply, setApply] = useState(true);
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(true);
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_BillReportView_permission } = checkPermission("BillReportView");
  const { data, isFetching } = useGetBillReportsListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
      skip: apply,
    }
  );

  useEffect(() => {
    return () => {
      setKeyInSS("params", {
        ...paginate,
        date_range: "this_week",
      });
      sessionStorage.removeItem("contactName");
    };
  }, []);

  return (
    <div>
      <SubHeader supplier />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_BillReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <BillReportListing
            vendor
            listing={data}
            popOver={popOver}
            setApply={setApply}
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
