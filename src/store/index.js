import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  CurrentUserReducer,
  setAccessToken,
  setCurrentUser,
} from "./slices/CurrentUserSlice";
import { BankDetailsAPI } from "./apis/BankDetailsAPI";
import { RateDifferenceAPI } from "./apis/RateDifferenceAPI";
import { ClientsAPI } from "./apis/ClientsAPI";
import { AdminAPI } from "./apis/AdminAPI";
import { UpdatesAPI } from "./apis/UpdatesAPI";
import { BookingsAPI } from "./apis/BookingsAPI";
import { BookingConsolidate } from "./apis/BookingConsolidate";

const rootReducer = combineReducers({
  CurrentUser: CurrentUserReducer,
  [BankDetailsAPI.reducerPath]: BankDetailsAPI.reducer,
  [RateDifferenceAPI.reducerPath]: RateDifferenceAPI.reducer,
  [ClientsAPI.reducerPath]: ClientsAPI.reducer,
  [AdminAPI.reducerPath]: AdminAPI.reducer,
  [UpdatesAPI.reducerPath]: UpdatesAPI.reducer,
  [BookingsAPI.reducerPath]: BookingsAPI.reducer,
  [BookingConsolidate.reducerPath]: BookingConsolidate.reducer,
});
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["CurrentUser"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(BankDetailsAPI.middleware)
      .concat(RateDifferenceAPI.middleware)
      .concat(AdminAPI.middleware)
      .concat(UpdatesAPI.middleware)
      .concat(ClientsAPI.middleware)
      .concat(BookingConsolidate.middleware)
      .concat(BookingsAPI.middleware),
});
export const persistor = persistStore(store);

export { store, setAccessToken, setCurrentUser };
export {
  useFetchBankDetailsQuery,
  useAddBankDetailsMutation,
  useUpdateBankDetailsMutation,
  useDeleteBankDetailsMutation,
} from "./apis/BankDetailsAPI";
export {
  useFetchRateDifferenceQuery,
  useAddRateDifferenceMutation,
} from "./apis/RateDifferenceAPI";
export {
  useAddClientsMutation,
  useDeleteClientsMutation,
  useFetchClientsQuery,
  useUpdateClientsMutation,
  useSearchClientsQuery,
  useChangeUserStatusMutation
} from "./apis/ClientsAPI";
export {
  useFetchAdminContactDetailsQuery,
  useAddAdminContactDetailsMutation,
  useFetchSubAdminQuery,
  useLogoutMutation,
} from "./apis/AdminAPI";
export {
  useAddHomeTextUpdateMutation,
  useFetchHomeTextUpdatesQuery,
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
  useSendNotificationMutation
} from "./apis/UpdatesAPI";
export {
  useFetchBookingStatusQuery,
  useAddBookingStatusMutation,
  useAddBookingMutation,
  useFetchBookingsQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
  useFetchPendingOrdersQuery,
  useDeletePendingOrdersMutation,
  useFetchSingleBookingQuery,
  useUpdateSeenBookingMutation,
} from "./apis/BookingsAPI";
export {
  useFetchConsolidateByClientQuery,
  useFetchConsolidateByDateQuery,
  useFetchConsolidateByTotalQuery,
} from "./apis/BookingConsolidate.js";
