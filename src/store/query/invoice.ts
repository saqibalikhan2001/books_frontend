/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { getKeyFromSS, setSessionAndLocalObj } from "utils";
import { InvoiceQueryResponse, PaginationProps, RecurringInvoiceQueryResponse } from "./Types";

const { TERMS, INVOICES, RECURRING_INVOICE } = endpoints;

export const InvoiceQuery = createApi({
  reducerPath: "invoices",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getInvoiceTermsList: builder.query<any, any>({
      query: () => ({ url: TERMS }),
      transformResponse: (resp: any) => {
        const list = resp.map(
          (val: {
            id: number;
            name: string;
            value: string;
            deletable: number;
            organization_id: number | null;
          }) => ({
            id: val.id,
            name: val.name,
            label: val.name,
            value: val.value,
            deletable: val?.deletable,
            org_id: val.organization_id,
          })
        );
        return list;
      },
    }),
    getInvoicesListing: builder.query<InvoiceQueryResponse, any>({
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
          url: `${INVOICES}?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&status=${
            status ?? ""
          }&date_range=${date_range}&start=${start_range ?? ""}&end=${end_range ?? ""}&contactId=${
            contactId ?? ""
          }&search=${""}&is_applied=${is_applied ?? ""}&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId =
          response?.invoices?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== INVOICES) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.invoices?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            INVOICES,
            null,
            response?.invoices?.data[1]?.id
          );
        }

        return response;
      },
    }),
    getRecurringInvoiceList: builder.query<RecurringInvoiceQueryResponse, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize } = paginate;
        return {
          url: `${RECURRING_INVOICE}?status=${"all"}&page=${page}&sort_by=${"invoice_no"}&order_by=${"asc"}&view=${pageSize}&search=${""}`,
        };
      },
    }),
  }),
});

export const {
  useGetInvoiceTermsListQuery,
  useGetInvoicesListingQuery,
  useGetRecurringInvoiceListQuery,
} = InvoiceQuery;
