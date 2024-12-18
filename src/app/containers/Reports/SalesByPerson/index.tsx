import React from "react";
import { SubHeader } from "./SubHeader";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { SalesPersonListing } from "./Listing";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetSalesPersonListingQuery } from "store/query/SalesbySalesPerson";
import { usePermissions } from "app/Hooks";

export default function SalesbySalesPerson() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_SalesBySalesPersonReportView_permission } = checkPermission(
    "SalesBySalesPersonReportView"
  );

  const { data, isFetching } = useGetSalesPersonListingQuery(
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
      ) : !has_SalesBySalesPersonReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <SalesPersonListing pagination={paginate} listing={data} setparam={handlePagination} />
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
