import { createAsyncThunk } from "@reduxjs/toolkit";
import { appActions } from "../app-reducer";
import { modelType, todolistAPI } from "api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "utils/error-utils";
import { AxiosError } from "axios";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { ResultCode } from "enums/ResulCode";

export const getTasks = createAsyncThunk(
  "tasksReducer/setTasksTC",
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.getTasks(todolistId);
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return { tasks: res.data.items, todolistId };
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(e);
    }
  }
);

export const removeTask = createAppAsyncThunk(
  "tasksReducer/removeTaskTC",
  async (
    params: { todolistId: string; taskId: string },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, taskId } = params;
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.deleteTask(todolistId, taskId);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return { taskId, todolistId };
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

export const updateTask = createAppAsyncThunk(
  "tasksReducer/v",
  async (
    param: { taskId: string; todolistId: string; model: modelType },
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const task = getState().task[param.todolistId].find(
        (t) => t.id === param.taskId
      );
      if (!task) {
        dispatch(appActions.setAppErrorAC({ error: "Task not found" }));
      }

      const apiModel: modelType = { ...task, ...param.model };

      const res = await todolistAPI.updateTask(
        param.todolistId,
        param.taskId,
        apiModel
      );
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return res.data.data.item;
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

export const addTask = createAsyncThunk(
  "tasksReducer/addTask",
  async (
    param: { todolistId: string; title: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.addTaskForTodolist(
        param.todolistId,
        param.title
      );
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return { task: res.data.data.item };
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
