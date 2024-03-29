import { createAsyncThunk } from "@reduxjs/toolkit";
import { appActions } from "../app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "utils/error-utils";
import { AxiosError } from "axios";
import { ResultCode } from "enums/ResulCode";
import { clearState } from "common/actions/common.actions";
import { authActions } from "../auth-reducer";
import { authAPI, LoginParamsType } from "api/auth-api";

export const login = createAsyncThunk(
  "authReducer/loginTC",
  async (params: LoginParamsType, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await authAPI.login(params);
      if (res.resultCode === 0) {
        dispatch(authActions.setIsLoggedInAC({ value: true }));
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return;
      } else {
        handleServerAppError(res, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(e);
    }
  }
);

export const logout = createAsyncThunk(
  "authReducer/logoutTC",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.resultCode === ResultCode.success) {
        dispatch(authActions.setIsLoggedInAC({ value: false }));
        dispatch(clearState());
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return;
      } else {
        handleServerAppError(res, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(e);
    }
  }
);
