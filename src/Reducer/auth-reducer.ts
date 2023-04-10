import { authAPI, LoginParamsType } from "../api/todolists-api";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearState } from "../common/actions/common.actions";
import { ResultCode } from "../enums/ResulCode";
import { appActions } from "./app-reducer";

const loginTC = createAsyncThunk(
  "authReducer/loginTC",
  async (params: LoginParamsType, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await authAPI.login(params);
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedInAC({ value: true }));
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(e);
    }
  }
);

const logoutTC = createAsyncThunk(
  "authReducer/logoutTC",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(authActions.setIsLoggedInAC({ value: false }));
        dispatch(clearState());
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(e);
    }
  }
);

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
export const authThunk = { loginTC, logoutTC };
