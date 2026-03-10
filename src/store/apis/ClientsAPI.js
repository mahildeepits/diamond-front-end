import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const ClientsAPI = createApi({
  reducerPath: "Clients",
  tagTypes: ["Clients"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().CurrentUser?.token;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints(builder) {
    return {
      fetchClients: builder.query({
        providesTags: ["Clients"],
        query: ({ searchText }) => {
          return {
            url: `/admin/clients?search=${searchText}&sub_admin=0`,
            method: "GET",
          };
        },
      }),
      addClients: builder.mutation({
        invalidatesTags: ["Clients"],
        query: (data) => {
          return {
            url: "/register",
            body: data,
            method: "POST",
          };
        },
      }),
      updateClients: builder.mutation({
        invalidatesTags: ["Clients"],
        query: (data) => {
          return {
            url: `/admin/clients/${data.id}/update`,
            body: data.values,
            method: "post",
          };
        },
      }),
      deleteClients: builder.mutation({
        invalidatesTags: ["Clients"],
        query: ({ id }) => {
          return {
            url: `/admin/clients/${id}/delete`,
            method: "GET",
          };
        },
      }),
      searchClients: builder.query({
        providesTags: ["Clients-Search"],
        query: ({ searchText }) => {
          return {
            url: `admin/search-client?search=${searchText}`,
            method: "GET",
          };
        },
      }),
      changeUserStatus: builder.mutation({
        invalidatesTags: ["Clients", "Sub-admin"],
        query: ({ id }) => {
          return {
            url: `/user/${id}/status`,
            method: "POST",
          };
        },
      }),
    };
  },
});
export { ClientsAPI };
export const {
  useAddClientsMutation,
  useFetchClientsQuery,
  useUpdateClientsMutation,
  useDeleteClientsMutation,
  useSearchClientsQuery,
  useChangeUserStatusMutation,
} = ClientsAPI;
