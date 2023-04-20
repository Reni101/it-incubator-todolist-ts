import { createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../api/todolists-api";
import { ResultCode } from "../../enums/ResulCode";
import { authActions } from "../auth-reducer";
import { handleServerNetworkError } from "../../utils/error-utils";
import { AxiosError } from "axios";
import { appActions } from "../app-reducer";

export const initializeApp = createAsyncThunk(
  "appReducer/initializeAppTC",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(authActions.setIsLoggedInAC({ value: true }));
      } else {
        dispatch(appActions.setAppStatusAC({ status: "failed" }));
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
