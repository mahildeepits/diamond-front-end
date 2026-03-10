import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const UpdatesAPI = createApi({
  reducerPath: "Updates",
  tagTypes: ["Updates", "Banner", "Messages", "Conversations", "Coins"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().CurrentUser?.token;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  endpoints(builder) {
    return {
      fetchHomeTextUpdates: builder.query({
        providesTags: ["Updates"],
        query: ({ type = 'header' }) => {
          return {
            url: `/admin/hometext?type=${type}`,
            method: "GET",
          };
        },
      }),
      addHomeTextUpdate: builder.mutation({
        invalidatesTags: ["Updates"],
        query: (data) => {
          return {
            url: "/admin/hometext",
            body: data,
            method: "POST",
          };
        },
      }),
      addBannerUpdate: builder.mutation({
        invalidatesTags: ["Updates", "Banner"],
        query: (data) => {
          return {
            url: "/admin/banner",
            body: data,
            method: "POST",
          };
        },
      }),
      fetchBannerUpdate: builder.query({
        providesTags: ["Banner"],
        query: () => {
          return {
            url: "/admin/banner",
            method: "GET",
          };
        },
      }),
      fetchGoldCoinRates: builder.query({
        providesTags: ["Coins"],
        query: () => {
          return {
            url: "/admin/gold-coin-rates",
            method: "GET",
          };
        },
      }),
      addGoldCoinRate: builder.mutation({
        invalidatesTags: ["Coins"],
        query: (data) => {
          return {
            url: "/admin/gold-coin-rates",
            body: data,
            method: "POST",
          };
        },
      }),
      deleteGoldCoinRate: builder.mutation({
        invalidatesTags: ["Coins"],
        query: (id) => {
          return {
            url: `/admin/gold-coin-rates/${id}/delete`,
            method: "GET",
          };
        },
      }),
      fetchConversations: builder.query({
        providesTags: ["Conversations"],
        query: ({ searchString, userId }) => {
          let convoUrl = `/conversations?search_text=${searchString || ''}&user_id=${userId || null}`;
          return {
            url: convoUrl,
            method: "GET",
          };
        },
      }),
      addCoversations: builder.mutation({
        invalidatesTags: ["Conversations"],
        query: (data) => {
          return {
            url: "/conversations",
            body: data,
            method: "POST",
          };
        },
      }),
      markReadConversation: builder.query({
        invalidatesTags: ["Conversations"],
        query: ({ id }) => {
          return {
            url: `/conversations/${id}/read`,
            method: "get",
          };
        },
      }),
      fetchConversationMessages: builder.query({
        providesTags: ["Messages"],
        query: ({ conversationId }) => {
          let convoUrl = `/conversations/messages?conversation_id=${conversationId}`;
          return {
            url: convoUrl,
            method: "GET",
          };
        },
      }),
      addConversationMesssage: builder.mutation({
        invalidatesTags: ["Messages"],
        query: (data) => {
          return {
            url: `/conversations/messages`,
            body: data,
            method: "POST",
          };
        },
      }),
      changeOnlineStatus: builder.mutation({
        invalidatesTags: ["Conversations"],
        query: (data) => {
          return {
            url: `/online/status`,
            body: data,
            method: "POST",
          };
        },
      }),
      fetchAdminStatus: builder.query({
        providesTags: ["conversations"],
        query: () => {
          return {
            url: '/admin/status',
            method: "GET",
          };
        },
      }),
      fetchNotifications: builder.query({
        providesTags: ["Updates"],
        query: () => {
          return {
            url: '/notifications',
            method: "GET",
          };
        },
      }),
      sendNotification: builder.mutation({
        invalidatesTags: ["Updates"],
        query: (data) => {
          return {
            url: "/admin/notification/send",
            body: data,
            method: "POST",
          };
        },
      }),
    };
  },
});
export { UpdatesAPI };
export const {
  useFetchHomeTextUpdatesQuery,
  useFetchHomeFooterTextUpdatesQuery,
  useAddHomeTextUpdateMutation,
  useAddBannerUpdateMutation,
  useFetchBannerUpdateQuery,
  useFetchGoldCoinRatesQuery,
  useAddGoldCoinRateMutation,
  useDeleteGoldCoinRateMutation,
  useFetchConversationsQuery,
  useAddCoversationsMutation,
  useFetchConversationMessagesQuery,
  useAddConversationMesssageMutation,
  useMarkReadConversationQuery,
  useChangeOnlineStatusMutation,
  useFetchAdminStatusQuery,
  useFetchNotificationsQuery,
  useSendNotificationMutation,
} = UpdatesAPI;
