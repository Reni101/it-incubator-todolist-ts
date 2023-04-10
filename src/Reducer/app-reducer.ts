import { AppDispatch } from "./store";
import { authAPI } from "../api/todolists-api";

import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { AxiosError } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authActions } from "./auth-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
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
export const { setAppStatusAC, setAppErrorAC, setIsInitializedAC } =
  slice.actions;

//==============================TC async await============================

export const initializeAppTC = () => async (dispatch: AppDispatch) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInAC({ value: true }));
    } else {
      handleServerAppError(res.data, dispatch);
      dispatch(authActions.setIsLoggedInAC({ value: false }));
    }
  } catch (e) {
    const err = e as Error | AxiosError;
    handleServerNetworkError(err, dispatch);
  } finally {
    dispatch(setIsInitializedAC({ value: true }));
  }
};
