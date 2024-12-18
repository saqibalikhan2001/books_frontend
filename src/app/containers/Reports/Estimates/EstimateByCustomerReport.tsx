import React, { useEffect, useState } from "react";
import { setKeyInSS } from "utils";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { EmptyIcon } from "app/shared/EmptyIcon";
import { AccessDenied, Spinner } from "app/shared";
import { EstimatesReportListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetEstimateReportListingQuery } from "store/query/estimatesReport";

export default function EstimateByCustomerReport() {
  const [apply, setApply] = useState(true);
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(true);
  const { paginate, handlePagination } = useCustomPagination("report");
  const { has_EstimateReportView_permission } = checkPermission("EstimateReportView");

  const { data, isFetching } = useGetEstimateReportListingQuery(
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
        status: "all",
      });
      sessionStorage.removeItem("contactName");
    };
  }, []);

  return (
    <div>
      <SubHeader customer />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_EstimateReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <EstimatesReportListing
            customer
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
