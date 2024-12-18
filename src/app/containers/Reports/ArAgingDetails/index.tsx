/** @format */

import React, { useEffect } from "react";
import { SubHeader } from "./SubHeader";
import { ArAgingDetailsListing } from "./Listing";
import { AccessDenied, EmptyIcon, Spinner } from "app/shared";
import { useCustomPagination } from "app/Hooks/useCustomPagination";
import { useGetArAgingDetailsListingQuery } from "store/query/ArAgingDetails";
import { setKeyInSS } from "utils";
import { usePermissions } from "app/Hooks";

export default function ArAgingDetails() {
  const { checkPermission } = usePermissions();
  const { paginate, handlePagination } = useCustomPagination("aragingDetail");
  const { has_ArAgingDetailsReportView_permission } = checkPermission("ArAgingDetailsReportView");
  const { data, isFetching } = useGetArAgingDetailsListingQuery(
    { paginate },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    return () => {
      setKeyInSS("params", {
        ...paginate,
        show_by: "amount",
        aging_by: "invoiceduedate",
        date_range: "this_week",
        interval_range: "1",
        interval_type: "weeks",
        number_of_columns: "1",
      });
    };
  }, []);

  return (
    <div>
      <SubHeader />
      {isFetching ? (
        <Spinner directionSize="80vh" />
      ) : !has_ArAgingDetailsReportView_permission ? (
        <AccessDenied />
      ) : (
        <>
          <ArAgingDetailsListing pagination={paginate} listing={data} setparam={handlePagination} />
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
