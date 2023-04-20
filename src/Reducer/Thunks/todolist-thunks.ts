import { createAsyncThunk } from "@reduxjs/toolkit";
import { appActions } from "../app-reducer";
import { todolistAPI } from "api/todolists-api";
import { tasksThunks } from "../task-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "utils/error-utils";
import { AxiosError } from "axios";
import { ResultCode } from "enums/ResulCode";
import { todolistActions } from "../todolists-reducer";

export const getTodoList = createAsyncThunk(
  "todoListsReducer/getTodoListTC",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.getTodoLists();

      res.data.forEach((tl) => {
        dispatch(tasksThunks.getTasks(tl.id));
      });
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return { todoLists: res.data };
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const addTodoList = createAsyncThunk(
  "todoListsReducer/addTodoListTC",
  async (title: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.createTodolist(title);

      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));

        return { newTodolist: res.data.data.item };
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

export const removeTodoList = createAsyncThunk(
  "todoListsReducer/removeTodoListTC",
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));

      dispatch(
        todolistActions.changeTodolistEntityStatusAC({
          status: "loading",
          todolistId,
        })
      );

      const res = await todolistAPI.deleteTodolist(todolistId);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return { id: todolistId };
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

export const editTitleTodoList = createAsyncThunk(
  "todoListsReducer/editTitleTodoListTC",
  async (
    param: { todolistId: string; title: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.updateTodolistTitle(
        param.todolistId,
        param.title
      );
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return {
          title: param.title,
          id: param.todolistId,
        };
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
