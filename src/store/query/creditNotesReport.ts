/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const CreditNotesReportsQuery = createApi({
  reducerPath: "CreditNotesReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCreditNotesReportsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, contactId } = paginate;
        return {
          url: contactId
            ? `report/creditnote?date_range=${date_range || "this_week"}&contact_id=${contactId}`
            : `report/creditnote?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetCreditNotesReportsListingQuery } = CreditNotesReportsQuery;
