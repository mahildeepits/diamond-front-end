import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  token: "",
};
const CurrentUserSlice = createSlice({
  name: "currentUser",
  initialState: initialState,
  reducers: {
    setCurrentUser(state, action) {
      const data = action.payload;
      state.user = data;
    },
    setAccessToken(state, action) {
      state.token = action.payload;
    },
  },
});
export const { setCurrentUser, setAccessToken } = CurrentUserSlice.actions;
export const CurrentUserReducer = CurrentUserSlice.reducer;
