import { todolistAPI, TodolistType } from "../api/todolists-api";
import { appActions, RequestStatusType } from "./app-reducer";
import { AxiosError } from "axios";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "./task-reducer";
import { clearState } from "../common/actions/common.actions";
import { ResultCode } from "../enums/ResulCode";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const initialState: Array<TodolistDomainType> = [];

const getTodoListTC = createAsyncThunk(
  "todoListsReducer/getTodoListTC",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.getTodolists();

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

const addTodoListTC = createAsyncThunk(
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

const removeTodoListTC = createAsyncThunk(
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

const editTitleTodoListTC = createAsyncThunk(
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

const slice = createSlice({
  name: "todoListsReducer",
  initialState: initialState,
  reducers: {
    changeFilterAC(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex((el) => el.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ todolistId: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex(
        (el) => el.id === action.payload.todolistId
      );
      state[index].entityStatus = action.payload.status;
    },
    clearTodosDataAC() {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearState.type, () => {
      return [];
    });
    builder.addCase(getTodoListTC.fulfilled, (state, action) => {
      return action.payload.todoLists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    });
    builder.addCase(addTodoListTC.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.newTodolist,
        filter: "all",
        entityStatus: "idle",
      });
    });
    builder.addCase(removeTodoListTC.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(editTitleTodoListTC.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      state[index].title = action.payload.title;
    });
  },
});

export const todoListsReducer = slice.reducer;
export const todolistActions = slice.actions;
export const todolistThunk = {
  getTodoListTC,
  addTodoListTC,
  removeTodoListTC,
  editTitleTodoListTC,
};
