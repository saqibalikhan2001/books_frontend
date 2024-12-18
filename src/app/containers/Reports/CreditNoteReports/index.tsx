import React, { useState } from "react";
import { SubHeader } from "./SubHeader";
import { usePermissions } from "app/Hooks";
import { CreditNotesReportListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetCreditNotesReportsListingQuery } from "store/query/creditNotesReport";

export default function CreditNotesReport() {
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(false);
  const { paginate, handlePagination } = useCustomPagination("reports");
  const { has_CreditNotesReportView_permission } = checkPermission("CreditNotesReportView");
  const { data, isFetching } = useGetCreditNotesReportsListingQuery(
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
      ) : !has_CreditNotesReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <CreditNotesReportListing
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
