/** @format */
import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { getKeyFromSS, setSessionAndLocalObj } from "utils";

const { PAYMENT_RECEIVED } = endpoints;

export const PaymentReceivedQuery = createApi({
  reducerPath: "PaymentsReceived",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPaymentReceivedListing: builder.query<any, any>({
      query: ({ paginate, sidebarPosition }) => {
        const {
          page,
          sort,
          status,
          search,
          pageSize,
          contactId,
          end_range,
          date_range,
          is_applied,
          start_range,
          sort_column,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));
        return {
          url: `advancepayments?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&status=${
            status ?? ""
          }&date_range=${date_range}&start=${start_range ?? ""}&end=${end_range ?? ""}&contactId=${
            contactId ?? ""
          }&search=${""}&is_applied=${is_applied ?? ""}&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId =
          response?.advancePayments?.data?.filter((e) => e.payment_no === dataFromLS?.curr_id)
            .length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== PAYMENT_RECEIVED) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.advancePayments?.data[0]?.payment_no,
            dataFromLS ? dataFromLS?.once : false,
            PAYMENT_RECEIVED,
            null,
            response?.advancePayments?.data[1]?.payment_no
          );
        }
        return response;
      },
    }),
  }),
});
export const { useGetPaymentReceivedListingQuery } = PaymentReceivedQuery;
