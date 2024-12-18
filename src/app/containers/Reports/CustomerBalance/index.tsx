import React, { useEffect } from "react";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { CustomerBalanceListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetCustomerBalanceReportListingQuery } from "store/query/CustomerBalance";

export default function CustomerBalance() {
  const { checkPermission } = usePermissions();
  const { has_CustomerBalanceReportView_permission } = checkPermission("CustomerBalanceReportView");

  const { paginate, handlePagination, Prev, Next, handlePage, handleRowSize } =
    useCustomPagination("customerReport");
  const { data, isFetching } = useGetCustomerBalanceReportListingQuery(
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
      ) : !has_CustomerBalanceReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <CustomerBalanceListing
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
