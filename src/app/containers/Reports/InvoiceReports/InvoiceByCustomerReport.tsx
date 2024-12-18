import React, { useEffect, useState } from "react";
import { setKeyInSS } from "utils";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { SalesPersonListing } from "./Listing";
import { EmptyIcon } from "app/shared/EmptyIcon";
import { AccessDenied, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetInvoiceReportListingQuery } from "store/query/invoiceReport";

export default function InvoiceByCustomerReport() {
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(true);
  const [apply, setApply] = useState(true);
  const { paginate, handlePagination } = useCustomPagination("report");
  const { has_InvoiceReportView_permission } = checkPermission("InvoiceReportView");
  const { data, isFetching } = useGetInvoiceReportListingQuery(
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
        contactId: null,
      });
      sessionStorage.removeItem("contactName");
    };
  }, []);

  return (
    <div>
      <SubHeader customer />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_InvoiceReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <SalesPersonListing
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
                <span>No record found </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
