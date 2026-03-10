import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const AdminAPI = createApi({
  reducerPath: "Admin",
  tagTypes: ["Admin", "Sub-admin"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().CurrentUser?.token;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints(builder) {
    return {
      fetchAdminContactDetails: builder.query({
        providesTags: ["Admin"],
        query: () => {
          return {
            url: "/admin/contact/details    ",
            method: "GET",
          };
        },
      }),
      fetchSubAdmin: builder.query({
        providesTags: ["Sub-admin"],
        query: ({ searchText }) => {
          return {
            url: `/admin/clients?sub_admin=1&search=${searchText}`,
            method: "GET",
          };
        },
      }),
      addAdminContactDetails: builder.mutation({
        invalidatesTags: ["Admin", "Sub-admin"],
        query: (data) => {
          return {
            url: "/admin/contact/details",
            body: data,
            method: "POST",
          };
        },
      }),
      logout: builder.mutation({
        query: () => {
          return {
            url: "/admin/logout",
            method: "GET",
          };
        },
      }),
    };
  },
});
export { AdminAPI };
export const {
  useFetchAdminContactDetailsQuery,
  useAddAdminContactDetailsMutation,
  useFetchSubAdminQuery,
  useLogoutMutation,
} = AdminAPI;
