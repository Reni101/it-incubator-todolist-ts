import { TaskStatuses, TaskType, todolistAPI } from "../api/todolists-api";
import { AxiosError } from "axios";

import { AppDispatch, AppRootStateType } from "./store";
import { setAppStatusAC } from "./app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { todolistActions } from "./todolists-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearState } from "../common/actions/common.actions";

export type TasksType = {
  [key: string]: Array<TaskType>;
};

const getTasksTC = createAsyncThunk(
  "tasksReducer/setTasksTC",
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.getTasks(todolistId);
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return { tasks: res.data.items, todolistId };
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
      return rejectWithValue(e);
    }
  }
);

const removeTaskTC = createAsyncThunk(
  "tasksReducer/removeTaskTC",
  async (
    params: { todolistId: string; taskId: string },
    { dispatch, rejectWithValue }
  ) => {
    const { todolistId, taskId } = params;
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.deleteTask(todolistId, taskId);
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
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

const slice = createSlice({
  name: "tasksReducer",
  initialState: {} as TasksType,
  reducers: {
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    },
    changeTaskStatusAC(
      state,
      action: PayloadAction<{
        taskId: string;
        status: TaskStatuses;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((el) => el.id === action.payload.taskId);
      if (index > -1)
        tasks[index] = { ...tasks[index], status: action.payload.status };
    },
    changeTaskTitleAC(
      state,
      action: PayloadAction<{
        taskId: string;
        title: string;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((el) => el.id === action.payload.taskId);
      if (index > -1)
        tasks[index] = { ...tasks[index], title: action.payload.title };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(todolistActions.addTodoListAC, (state, action) => {
      state[action.payload.newTodolist.id] = [];
    });
    builder.addCase(todolistActions.removeTodolistAC, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(todolistActions.setTodoListAC, (state, action) => {
      action.payload.todoLists.forEach((tl) => (state[tl.id] = []));
    });
    builder.addCase(getTasksTC.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((el) => el.id === action.payload.taskId);
      if (index > -1) tasks.splice(index, 1);
    });
    builder.addCase(clearState.type, () => {
      return {};
    });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { getTasksTC, removeTaskTC };

// export const removeTaskTC =
//   (todolistId: string, taskId: string) => async (dispatch: AppDispatch) => {
//     try {
//       dispatch(setAppStatusAC({ status: "loading" }));
//       const res = await todolistAPI.deleteTask(todolistId, taskId);
//       if (res.data.resultCode === 0) {
//         dispatch(tasksActions.removeTaskAC({ taskId, todolistId }));
//         dispatch(setAppStatusAC({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     } catch (e) {
//       handleServerNetworkError(e as Error | AxiosError, dispatch);
//     }
//   };

export const addTaskTC =
  (todolistId: string, title: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.addTaskForTodolist(todolistId, title);
      if (res.data.resultCode === 0) {
        dispatch(tasksActions.addTaskAC({ task: res.data.data.item }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      handleServerNetworkError(e as Error | AxiosError, dispatch);
    }
  };

export const updateTaskStatusTC =
  (taskId: string, todolistId: string, status: TaskStatuses) =>
  async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const task = getState().task[todolistId].find((t) => t.id === taskId);
      if (!!task) {
        const res = await todolistAPI.updateTask(todolistId, taskId, {
          title: task.title,
          status,
          deadline: task.deadline,
          description: task.description,
          priority: task.priority,
          startDate: task.startDate,
        });
        if (res.data.resultCode === 0) {
          dispatch(
            tasksActions.changeTaskStatusAC({ status, taskId, todolistId })
          );
          dispatch(setAppStatusAC({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      }
    } catch (e) {
      const err = e as Error | AxiosError;
      handleServerNetworkError(err, dispatch);
    }
  };

export const updateTaskTitleTC =
  (taskId: string, todolistId: string, title: string) =>
  async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const task = getState().task[todolistId].find((t) => t.id === taskId);
      if (!!task) {
        const res = await todolistAPI.updateTask(todolistId, taskId, {
          title,
          status: task.status,
          deadline: task.deadline,
          description: task.description,
          priority: task.priority,
          startDate: task.startDate,
        });

        if (res.data.resultCode === 0) {
          dispatch(
            tasksActions.changeTaskTitleAC({ taskId, title, todolistId })
          );
          dispatch(setAppStatusAC({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      }
    } catch (e) {
      const err = e as Error | AxiosError;
      handleServerNetworkError(err, dispatch);
    }
  };
