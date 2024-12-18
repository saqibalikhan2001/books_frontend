/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { CategoriesQueryResponse, PaginationProps } from "./Types";

const { PRODUCT_CATEGORY } = endpoints;

export const CategoryQuery = createApi({
  reducerPath: "Categories",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCategoriesListing: builder.query<CategoriesQueryResponse, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize, sort, sort_column } = paginate;
        return {
          url: `${PRODUCT_CATEGORY}?page=${page}&sort_by=${sort_column ?? "name"}&order_by=${
            sort ?? "asc"
          }&view=${pageSize}`,
        };
      },
    }),
    getAllCategories: builder.query<any, any>({
      query: () => {
        return {
          url: `/items${PRODUCT_CATEGORY}`,
        };
      },
    }),
    // getAllCategories: builder.query<any, any>({
    //   query: () => {
    //     return {
    //       url: `${PRODUCT_CATEGORY}?filter=item`,
    //     };
    //   },
    // }),
  }),
});

export const { useGetCategoriesListingQuery, useGetAllCategoriesQuery } = CategoryQuery;
