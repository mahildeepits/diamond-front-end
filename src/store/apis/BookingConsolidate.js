import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BookingConsolidate = createApi({
  reducerPath: "Consolidate",
  tagTypes: ["Consolidate-Client", "Consolidate-Date"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().CurrentUser?.token;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints(builder) {
    return {
      fetchConsolidateByDate: builder.query({
        providesTags: ["Consolidate-Date"],
        query: () => {
          return {
            url: "/admin/bookings/date-wise",
            method: "GET",
          };
        },
      }),
      fetchConsolidateByClient: builder.query({
        providesTags: ["Consolidate-Client"],
        query: ({ searchText }) => {
          return {
            url: `/admin/bookings/client-wise?search=${searchText}`,
            method: "GET",
          };
        },
      }),
      fetchConsolidateByTotal: builder.query({
        providesTags: ["Consolidate-Total"],
        query: () => {
          return {
            url: "/admin/bookings/consolidate",
            method: "GET",
          };
        },
      }),
    };
  },
});
export { BookingConsolidate };
export const {
  useFetchConsolidateByClientQuery,
  useFetchConsolidateByTotalQuery,
  useFetchConsolidateByDateQuery,
} = BookingConsolidate;
