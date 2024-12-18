import React, { useState } from "react";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { PaymentMadeListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetPaymentMadeReportListingQuery } from "store/query/paymentmadereport";

export default function PaymentReport() {
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(false);
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_BillPaymentReportView_permission } = checkPermission("BillPaymentReportView");

  const { data, isFetching } = useGetPaymentMadeReportListingQuery(
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
      ) : !has_BillPaymentReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <PaymentMadeListing
            listing={data}
            popOver={popOver}
            pagination={paginate}
            setparam={handlePagination}
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
              <EmptyIcon />
              <span>No record found</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
