import React, { useEffect, useState } from "react";
import { setKeyInSS } from "utils";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { SalesPersonListing } from "./Listing";
import { EmptyIcon } from "app/shared/EmptyIcon";
import { AccessDenied, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetInvoiceReportListingQuery } from "store/query/invoiceReport";

export default function InvoiveReport() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("report");
  const [popOver, setPopOver] = useState(false);

  const { has_InvoiceReportView_permission } = checkPermission("InvoiceReportView");
  const { data, isFetching } = useGetInvoiceReportListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    return () => {
      setKeyInSS("params", {
        ...paginate,
        date_range: "this_week",
        status: "all",
      });
    };
  }, []);

  return (
    <div>
      <SubHeader />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_InvoiceReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <SalesPersonListing
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
