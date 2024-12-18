/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { getKeyFromSS, setSessionAndLocalObj } from "utils";

const { BILL_PAYMENTS } = endpoints;

export const BillPaymentsQuery = createApi({
  reducerPath: "BillPayments",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getBillPaymentsListing: builder.query<any, any>({
      query: ({ paginate, sidebarPosition }) => {
        const {
          page,
          sort,
          search,
          pageSize,
          end_range,
          contactId,
          date_range,
          sort_column,
          start_range,
          is_applied,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));

        return {
          url: `/advancepayments/bill?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&date_range=${date_range}&start=${
            start_range ?? ""
          }&end=${end_range ?? ""}&contactId=${contactId ?? ""}&search=${""}&is_applied=${
            is_applied ?? ""
          }&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId = response?.bills?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== BILL_PAYMENTS) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            dataFromLS?.curr_id ? dataFromLS?.curr_id : response?.bills?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            BILL_PAYMENTS,
            null,
            response?.bills?.data[1]?.id
          );
        }
        return response;
      },
    }),
  }),
});

export const { useGetBillPaymentsListingQuery } = BillPaymentsQuery;
