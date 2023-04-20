import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, logout } from "./Thunks/auth-thunks";

const slice = createSlice({
  name: "authReducer",
  initialState: { isLoggedIn: false },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunk = { login, logout };
