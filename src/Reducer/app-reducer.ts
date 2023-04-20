import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initializeApp } from "./Thunks/app-thunks";

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
export const appActions = slice.actions;
export const appThunk = { initializeApp };
