/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { PaginationProps } from "./Types";

const {
  TAXES,
  CURRENCY,
  ACCOUNT_GROUP,
  ORGANIZATIONS,
  PAYMENT_METHOD,
  GENREAL_MODULES,
  CREATE_ORGANIZATION,
} = endpoints;

export const organizationQuery = createApi({
  reducerPath: "organization",
  baseQuery: baseQuery,
  keepUnusedDataFor: 3600,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getList: builder.query<any, any /*RequestPayload*/>({
      query: (_) => {
        return {
          url: CREATE_ORGANIZATION,
          // responseHandler: (response) => {
          //   return response.json();
          // }
        };
      },
    }),
    getOrganizations: builder.query<any, any>({
      query: (_) => ({ url: ORGANIZATIONS }),
    }),
    getCurrencyList: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize, sort = "asc" } = paginate;
        return {
          url: `${CURRENCY}?page=${page}&view=${pageSize}&sort_by=${"name"}&order_by=${sort}&sort_column=""`,
        };
      },
    }),
    getTaxList: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize, sort, sort_column = "" } = paginate;
        return {
          url: `${TAXES}?page=${page}&view=${pageSize}&sort_by=${sort}&sort_column=${sort_column}`,
        };
      },
    }),
    getAllTaxes: builder.query<any, any>({
      query: () => ({
        url: TAXES,
      }),
    }),
    getAccountList: builder.query<any, any>({
      query: () => {
        return {
          //url: `${ACCOUNT_GROUP}?page=${1}&view=${500}&sort_by=${"ascend"}&sort_column=${""}`,
          url: ACCOUNT_GROUP,
        };
      },
    }),
    getPaymentMethodsList: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize, sort, sort_column = "" } = paginate;
        return {
          url: `${PAYMENT_METHOD}?page=${page}&view=${pageSize}&sort_by=${sort}&sort_column=${sort_column}`,
        };
      },
    }),
    getAllPaymentMethods: builder.query<any, any>({
      query: () => ({
        url: PAYMENT_METHOD,
      }),
    }),
    getGeneralModules: builder.query<any, any>({
      query: () => ({
        url: GENREAL_MODULES,
      }),
    }),
  }),
  refetchOnMountOrArgChange: 3600,
});

export const {
  useGetListQuery,
  useGetTaxListQuery,
  useGetAllTaxesQuery,
  useLazyGetListQuery,
  useGetAccountListQuery,
  useGetCurrencyListQuery,
  useGetOrganizationsQuery,
  useGetGeneralModulesQuery,
  useLazyGetOrganizationsQuery,
  useGetAllPaymentMethodsQuery,
  useGetPaymentMethodsListQuery,
} = organizationQuery;
