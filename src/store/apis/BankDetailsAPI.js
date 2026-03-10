import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BankDetailsAPI = createApi({
  reducerPath: "BankDetails",
  tagTypes: ["BankDetails"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().CurrentUser?.token;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints(builder) {
    return {
      fetchBankDetails: builder.query({
        providesTags: ["BankDetails"],
        query: () => {
          return {
            url: "/admin/bank-details",
            method: "GET",
          };
        },
      }),
      addBankDetails: builder.mutation({
        invalidatesTags: ["BankDetails"],
        query: (data) => {
          return {
            url: "/admin/bank-details",
            body: data,
            method: "POST",
          };
        },
      }),
      updateBankDetails: builder.mutation({
        invalidatesTags: ["BankDetails"],
        query: (data) => {
          return {
            url: `/admin/bank-details/${data.id}/update`,
            body: data.values,
            method: "PUT",
          };
        },
      }),
      deleteBankDetails: builder.mutation({
        invalidatesTags: ["BankDetails"],
        query: ({ id }) => {
          return {
            url: `/admin/bank-details/${id}/delete`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export { BankDetailsAPI };
export const {
  useAddBankDetailsMutation,
  useFetchBankDetailsQuery,
  useUpdateBankDetailsMutation,
  useDeleteBankDetailsMutation,
} = BankDetailsAPI;
