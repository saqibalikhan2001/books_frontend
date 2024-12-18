/** @format */

import React, { useEffect } from "react";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { SalesCustomersListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetSalesCustomerListingQuery } from "store/query/Salesbycustomer";

export default function SalesbyCustomers() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_SalesByCustomerReportView_permission } = checkPermission("SalesByCustomerReportView");

  const { data, isFetching } = useGetSalesCustomerListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("contactName");
    };
  }, []);

  return (
    <div>
      <SubHeader />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_SalesByCustomerReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <SalesCustomersListing pagination={paginate} listing={data} setparam={handlePagination} />
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
