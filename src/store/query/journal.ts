/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const JournalQuery = createApi({
  reducerPath: "Journal",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getJournalListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, page } = paginate;
        return {
          url: `/journal?page=${page}&view=10&date_range=${date_range || "this_month"}`,
        };
      },
    }),
  }),
});

export const { useGetJournalListingQuery } = JournalQuery;
