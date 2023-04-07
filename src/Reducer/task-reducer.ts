import { modelType, TaskType, todolistAPI } from "../api/todolists-api";
import { AxiosError } from "axios";
import { setAppErrorAC, setAppStatusAC } from "./app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { todolistActions } from "./todolists-reducer";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearState } from "../common/actions/common.actions";
import { createAppAsyncThunk } from "../utils/create-app-async-thunk";

export type TasksType = {
  [key: string]: TaskType[];
};

const getTasks = createAppAsyncThunk(
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

const removeTask = createAppAsyncThunk(
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

const updateTask = createAppAsyncThunk(
  "tasksReducer/v",
  async (
    param: { taskId: string; todolistId: string; model: modelType },
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const task = getState().task[param.todolistId].find(
        (t) => t.id === param.taskId
      );
      if (!task) {
        dispatch(setAppErrorAC({ error: "Task not found" }));
      }

      const apiModel: modelType = { ...task, ...param.model };

      const res = await todolistAPI.updateTask(
        param.todolistId,
        param.taskId,
        apiModel
      );
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
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

const addTask = createAsyncThunk(
  "tasksReducer/addTask",
  async (
    param: { todolistId: string; title: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.addTaskForTodolist(
        param.todolistId,
        param.title
      );
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succeeded" }));
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

const slice = createSlice({
  name: "tasksReducer",
  initialState: {} as TasksType,
  reducers: {},
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
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((el) => el.id === action.payload.taskId);
      if (index > -1) tasks.splice(index, 1);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todoListId];
      const index = tasks.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        tasks[index] = action.payload;
      }
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    });
    builder.addCase(clearState.type, () => {
      return {};
    });
  },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { getTasks, removeTask, updateTask, addTask };

// export const addTaskTC =
//   (todolistId: string, title: string) => async (dispatch: AppDispatch) => {
//     try {
//       dispatch(setAppStatusAC({ status: "loading" }));
//       const res = await todolistAPI.addTaskForTodolist(todolistId, title);
//       if (res.data.resultCode === 0) {
//         dispatch(tasksActions.addTaskAC({ task: res.data.data.item }));
//         dispatch(setAppStatusAC({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     } catch (e) {
//       handleServerNetworkError(e as Error | AxiosError, dispatch);
//     }
//   };
