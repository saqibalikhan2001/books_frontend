/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TablePrefQuery = createApi({
  reducerPath: "tablePref",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTablePref: builder.query<any, any>({
      query: (moduleName) => {
        return {
          url: `column-lockable?module=${moduleName}`,
        };
      },
    }),
  }),
});

export const { useGetTablePrefQuery } = TablePrefQuery;
