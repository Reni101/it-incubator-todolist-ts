import { AppDispatch, AppRootStateType } from "reducer/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: unknown;
}>();
