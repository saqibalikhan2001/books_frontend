/** @format */

import React, { useEffect } from "react";
import { setKeyInSS } from "utils";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { TaxSummaryDetailsSupplierListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useTaxSummaryDetailsSupplierListingQuery } from "store/query/taxSummaryDetailsSupplier";

export default function TaxSummaryDetailCustomer() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination, Prev, Next, handlePage, handleRowSize } =
    useCustomPagination("taxbycustomer");
  const { has_TaxBySupplierReportView_permission } = checkPermission("TaxBySupplierReportView");

  const { data, isFetching } = useTaxSummaryDetailsSupplierListingQuery(
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
      ) : !has_TaxBySupplierReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <TaxSummaryDetailsSupplierListing
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
