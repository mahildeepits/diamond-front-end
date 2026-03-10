import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const RateDifferenceAPI = createApi({
  reducerPath: "RateDifference",
  tagTypes: ["RateDifference"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().CurrentUser?.token;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints(builder) {
    return {
      fetchRateDifference: builder.query({
        providesTags: ["RateDifference"],
        query: () => {
          return {
            url: "/admin/rate-differences",
            method: "GET",
          };
        },
      }),
      addRateDifference: builder.mutation({
        invalidatesTags: ["RateDifference"],
        query: (data) => {
          return {
            url: "/admin/rate-differences",
            body: data,
            method: "POST",
          };
        },
      }),
    };
  },
});
export { RateDifferenceAPI };
export const { useAddRateDifferenceMutation, useFetchRateDifferenceQuery } =
  RateDifferenceAPI;
