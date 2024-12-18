/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { getKeyFromSS, setSessionAndLocalObj } from "utils";

const { CREDIT_NOTES } = endpoints;

export const CreditNotesQuery = createApi({
  reducerPath: "CreditNotes",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCreditNotesListing: builder.query<any, any>({
      query: ({ paginate, sidebarPosition }) => {
        // const { page, pageSize } = paginate;
        const {
          page,
          sort,
          status,
          search,
          pageSize,
          contactId,
          end_range,
          date_range,
          start_range,
          sort_column,
          is_applied,
          dashboard,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));
        return {
          url: `${CREDIT_NOTES}?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${
            isNaN(resolution) ? (resolution = 0) : resolution
          }&status=${status ?? ""}&date_range=${date_range}&start=${start_range ?? ""}&end=${
            end_range ?? ""
          }&contactId=${contactId ?? ""}&search=${""}&is_applied=${is_applied ?? ""}&dashboard=${
            dashboard ?? ""
          }&search=${search ?? ""}`,
          // url: `${CREDIT_NOTES}?filter=${"all"}&page=${page}&sort_by=&order_by=${"asc"}&view=${pageSize}&search=${""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId =
          response?.credit_notes?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== CREDIT_NOTES) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.credit_notes?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            CREDIT_NOTES,
            null,
            response?.credit_notes?.data[1]?.id
          );
        }

        return response;
      },
    }),
  }),
});

export const { useGetCreditNotesListingQuery } = CreditNotesQuery;
