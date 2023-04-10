import { authAPI } from "../api/todolists-api";

import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { AxiosError } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authActions } from "./auth-reducer";
import { ResultCode } from "../enums/ResulCode";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initializeAppTC = createAsyncThunk(
  "appReducer/initializeAppTC",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(authActions.setIsLoggedInAC({ value: true }));
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(authActions.setIsLoggedInAC({ value: false }));
      }
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(e);
    } finally {
      dispatch(appActions.setIsInitializedAC({ value: true }));
    }
  }
);

const slice = createSlice({
  name: "appReducer",
  initialState: {
    status: "loading" as RequestStatusType,
    error: null as string | null,
    isInitialized: false as boolean,
  },
  reducers: {
    setAppStatusAC(
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) {
      state.status = action.payload.status;
    },
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setIsInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
export const appThunk = { initializeAppTC };
