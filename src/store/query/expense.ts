/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { ExpensesQueryResponse, PaginationProps } from "./Types";

const { EXPENSES } = endpoints;

export const ExpenseQuery = createApi({
    reducerPath: "Expense",
    keepUnusedDataFor: 3600,
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getExpenseListing: builder.query<ExpensesQueryResponse, PaginationProps>({
            query: (paginate) => {
                const { page, pageSize } = paginate;
                return {
                    url: `${EXPENSES}?filter=${"all"}&page=${page}&sort_by=${"customer_id"}&order_by=${"asc"}&view=${pageSize}&search=${""}`,
                };
            },
        }),
    }),
});

export const { useGetExpenseListingQuery } = ExpenseQuery;
