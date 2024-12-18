/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type RequestPayload = {
  email: string;
  password: string;
};

export const loginAPI = createApi({
  reducerPath: "login",
  keepUnusedDataFor: 3600,
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
    prepareHeaders: (headers) => {
      headers.set("authorization", "false");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLogin: builder.query<any, any /*RequestPayload*/>({
      query: (/*params*/) => {
        // console.log({params})
        return {
          url: "auth/login",
          method: "post",
          body: {
            email: "demo@seebiz.com",
            password: "admin123",
            remember_me: true,
          },
          // responseHandler: (response) => {
          //   return response.json();
          // }
        };
      },
      // transformResponse: (resp: any, meta, arg) => {
      //   return resp;
      // }
    }),
    // logout: builder.query<any, any>({
    //   query:() => 'logout'
    // })
  }),
  // refetchOnMountOrArgChange: 6000,
});

export const { useLazyGetLoginQuery, useGetLoginQuery /*useLogoutQuery, useLazyLogoutQuery */ } =
  loginAPI;
// export const { endpoints, reducerPath, reducer, middleware } = loginAPI;
