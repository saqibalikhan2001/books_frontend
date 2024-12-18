/** @format */

import React, { useEffect } from "react";
import { SubHeader } from "./SubHeader";
import { setKeyInSS } from "utils";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { ArAgingSummaryListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetArAgingSummaryReportListingQuery } from "store/query/arAgingSummary";
import { usePermissions } from "app/Hooks";

export default function ArAgingSummary() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination, Prev, Next, handlePage, handleRowSize } = useCustomPagination("araging");
  const { has_ArAgingReportView_permission } = checkPermission("ArAgingReportView");
  const { data, isFetching } = useGetArAgingSummaryReportListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    return () => {
      setKeyInSS("params", {
        ...paginate,
        show_by: "amount",
        aging_by: "invoicedate",
        date_range: "this_week",
        interval_type: "weeks",
        interval_range: "1",
        number_of_columns: "1",
      });
    };
  }, []);

  return (
    <div className="aging_summary_report">
      <SubHeader />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_ArAgingReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <ArAgingSummaryListing 
            Prev={Prev}
            Next={Next}
            listing={data}
            pagination={paginate}
            handlePage={handlePage}
            handleRowSize={handleRowSize}
            setparam={handlePagination} />
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
