/** @format */

import React from "react";
import { SubHeader } from "./SubHeader";
import { Listing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetSalesItemsListingQuery } from "store/query/salesByItems";
import { usePermissions } from "app/Hooks";

export default function SalesByItems() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_SalesByProductReportView_permission } = checkPermission("SalesByProductReportView");

  const { data, isFetching } = useGetSalesItemsListingQuery(
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
      ) : !has_SalesByProductReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <Listing pagination={paginate} listing={data} setparam={handlePagination} />
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
