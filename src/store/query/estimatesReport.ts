/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const estimateReportQuery = createApi({
  reducerPath: "EstimateReport",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getEstimateReportListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, status, contactId } = paginate;
        return {
          url: contactId
            ? `/report/estimate?date_range=${
                date_range || "this_week"
              }&contact_id=${contactId}&status=${status || "all"}`
            : `/report/estimate?date_range=${date_range || "this_week"}&status=${status || "all"}`,
        };
      },
    }),
  }),
});
export const { useGetEstimateReportListingQuery } = estimateReportQuery;
