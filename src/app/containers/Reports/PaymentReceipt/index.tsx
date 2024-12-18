/** @format */

import React, { useState } from "react";
import { Listing } from "./Listing";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetPaymentReceiptReportListingQuery } from "store/query/paymentReceiptReport";

export default function PaymentReceiptReport() {
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(false);
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_PaymentReceiptsReportView_permission } = checkPermission("PaymentReceiptsReportView");

  const { data, isFetching } = useGetPaymentReceiptReportListingQuery(
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
      ) : !has_PaymentReceiptsReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <Listing
            listing={data}
            popOver={popOver}
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
              <EmptyIcon />
              <span>No record found</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
