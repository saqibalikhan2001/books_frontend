/** @format */

import React, { useState, useEffect } from "react";
import { Listing } from "./Listing";
import { setKeyInSS } from "utils";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetPaymentReceiptReportListingQuery } from "store/query/paymentReceiptReport";

export default function PaymentReceiptByCustomerReport() {
  const [apply, setApply] = useState(true);
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(true);
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_PaymentReceiptsReportView_permission } = checkPermission("PaymentReceiptsReportView");

  const { data, isFetching } = useGetPaymentReceiptReportListingQuery(
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
      });
      sessionStorage.removeItem("contactName");
    };
  }, []);

  return (
    <div>
      <SubHeader customer />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_PaymentReceiptsReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <Listing
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
              <EmptyIcon />
              <span>No record found</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
