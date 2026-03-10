import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BookingsAPI = createApi({
  reducerPath: "Bookings",
  tagTypes: ["Bookings", "Booking-Status"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().CurrentUser?.token;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints(builder) {
    return {
      fetchBookingStatus: builder.query({
        providesTags: ["Booking-Status"],
        query: () => {
          return {
            url: "/admin/manage/bookings",
            method: "GET",
          };
        },
      }),
      fetchDeliveryDates: builder.query({
        providesTags: ["Delivery-Dates"],
        query: () => {
          return {
            url: "/admin/delivery/date/charges",
            method: "GET",
          };
        },
      }),
      addBookingStatus: builder.mutation({
        invalidatesTags: ["Booking-Status"],
        query: (data) => {
          return {
            url: "/admin/manage/bookings",
            body: data,
            method: "POST",
          };
        },
      }),
      addBooking: builder.mutation({
        invalidatesTags: ["Bookings"],
        query: (data) => {
          return {
            url: "/admin/bookings/create",
            body: data,
            method: "POST",
          };
        },
      }),
      fetchBookings: builder.query({
        providesTags: ["Bookings"],
        query: ({ searchString, from_date, to_date }) => {
          let urlApi = `/admin/bookings?search=${searchString || ""}`;
          
          if (from_date) {
            urlApi += `&from_date=${from_date}`;
          }
          if (to_date) {
            urlApi += `&to_date=${to_date}`;
          }
          
          return {
            url: urlApi,
            method: "GET",
          };
        },
      }),
      fetchSingleBooking: builder.query({
        providesTags: ["Single-Booking"],
        query: (id) => {
          console.warn(id);
          return {
            url: `/admin/bookings/${id}/edit`,
            method: "GET",
          };
        },
      }),
      deleteBooking: builder.mutation({
        invalidatesTags: ["Bookings"],
        query: ({ id }) => {
          return {
            url: `/admin/bookings/${id}/delete`,
            method: "GET",
          };
        },
      }),
      updateBooking: builder.mutation({
        invalidatesTags: ["Bookings"],
        query: (data) => {
          return {
            url: `/admin/bookings/${data.id}/update`,
            body: data.values,
            method: "post",
          };
        },
      }),
      updateSeenBooking: builder.mutation({
        invalidatesTags: ["Bookings"],
        query: (data) => {
          return {
            url: `/admin/bookings/${data.id}/toggle/seen`,
            body: data.values,
            method: "post",
          };
        },
      }),
      fetchPendingOrders: builder.query({
        providesTags: ["Pending-Orders"],
        query: ({ searchText }) => {
          return {
            url: `admin/orders?search=${searchText}`,
            method: "GET",
          };
        },
      }),
      deletePendingOrders: builder.mutation({
        invalidatesTags: ["Pending-Orders"],
        query: ({ id }) => {
          return {
            url: `admin/orders/${id}/delete`,
            method: "GET",
          };
        },
      }),
      addBookingDates: builder.mutation({
        invalidatesTags: ["Bookings"],
        query: (data) => {
          console.log('here',data);
          return {
            url: `admin/delivery/date/charges/save`,
            body:data,
            method: "POST",
          };
        },
      }),
      fetchBookingDates: builder.query({
        providesTags: ["Bookings"],
        query: () => {
          return {
            url: `admin/delivery/date/charges`,
            method: "get",
          };
        },
      }),
      deleteBookingDates: builder.mutation({
        providesTags: ["Bookings"],
        query: (id) => {
          return {
            url: `admin/delivery/date/charges/${id}/delete`,
            method: "get",
          };
        },
      }),
    };
  },
});
export { BookingsAPI };
export const {
  useFetchBookingStatusQuery,
  useFetchDeliveryDatesQuery,
  useAddBookingStatusMutation,
  useAddBookingMutation,
  useFetchBookingsQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
  useFetchPendingOrdersQuery,
  useDeletePendingOrdersMutation,
  useFetchSingleBookingQuery,
  useAddBookingDatesMutation,
  useFetchBookingDatesQuery,
  useDeleteBookingDatesMutation,
  useUpdateSeenBookingMutation
} = BookingsAPI;
