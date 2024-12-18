/** @format */

import React, { useEffect } from "react";
import { SubHeader } from "./SubHeader";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { TaxSummaryDetailsCustomerListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useTaxSummaryDetailsCutomerListingQuery } from "store/query/taxSummaryDetailsCustomer";
import { usePermissions } from "app/Hooks";
import { setKeyInSS } from "utils";

export default function TaxSummaryDetailCustomer() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination, Prev, Next, handlePage, handleRowSize } =
    useCustomPagination("taxbycustomer");
  const { has_TaxByCustomerReportView_permission } = checkPermission("TaxByCustomerReportView");

  const { data, isFetching } = useTaxSummaryDetailsCutomerListingQuery(
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
      });
      sessionStorage.removeItem("contactName");
    };
  }, []);

  return (
    <div>
      <SubHeader />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_TaxByCustomerReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <TaxSummaryDetailsCustomerListing
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
