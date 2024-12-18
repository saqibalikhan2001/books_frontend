/** @format */

import React, { useEffect } from "react";
import { SubHeader } from "./SubHeader";
import { setKeyInSS } from "utils";
import { usePermissions } from "app/Hooks";
import { TaxSummaryDetailsReportListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetTaxSummaryDetailsReportsListingQuery } from "store/query/taxSummaryDetails";

export default function TaxSummaryDetailsReport() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination, Prev, Next, handlePage, handleRowSize } =
    useCustomPagination("taxsummarydetailreport");
  const { has_TaxByProductsReportView_permission } = checkPermission("TaxByProductsReportView");
  const { data, isFetching } = useGetTaxSummaryDetailsReportsListingQuery(
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
        item_id: "",
      });
      sessionStorage.removeItem("itemName");
    };
  }, []);

  return (
    <div>
      <SubHeader />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_TaxByProductsReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <TaxSummaryDetailsReportListing
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
