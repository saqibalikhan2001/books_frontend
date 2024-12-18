/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const RolepermissionQuery = createApi({
  reducerPath: "Rolepermission",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getRolepermission: builder.query<any, any>({
      query: () => {
        return {
          url: `/currentuser/role`,
        };
      },
    }),
  }),
});

export const { useGetRolepermissionQuery } = RolepermissionQuery;
