/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { EstimateQueryResponse } from "./Types";
import { getKeyFromSS, setSessionAndLocalObj } from "utils";

const { ESTIMATES } = endpoints;

export const EstimatesQuery = createApi({
  reducerPath: "Estimates",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getEstimatesListing: builder.query<EstimateQueryResponse, any>({
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
          sort_column,
          start_range,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));

        return {
          url: `${ESTIMATES}?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&status=${
            status ?? ""
          }&date_range=${date_range}&start=${start_range ?? ""}&end=${end_range ?? ""}&contactId=${
            contactId ?? ""
          }&search=${""}&is_applied=${is_applied ?? ""}&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId =
          response?.estimates?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;

        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== ESTIMATES) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.estimates?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            ESTIMATES,
            null,
            response?.estimates?.data[1]?.id
          );
        }

        return response;
      },
    }),
  }),
});

export const { useGetEstimatesListingQuery } = EstimatesQuery;
