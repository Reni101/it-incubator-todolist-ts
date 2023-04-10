import { todolistAPI, TodolistType } from "../api/todolists-api";
import { AppDispatch } from "./store";
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

const slice = createSlice({
  name: "todoListsReducer",
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
    // addTodoListAC(state, action: PayloadAction<{ newTodolist: TodolistType }>) {
    //   state.unshift({
    //     ...action.payload.newTodolist,
    //     filter: "all",
    //     entityStatus: "idle",
    //   });
    // },
    changeTodoListTitleAC(
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) {
      const index = state.findIndex((el) => el.id === action.payload.id);
      state[index].title = action.payload.title;
    },
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
  },
});

export const todoListsReducer = slice.reducer;
export const todolistActions = slice.actions;
export const todolistThunk = { getTodoListTC, addTodoListTC };

export const removeTodoListTC =
  (todoListID: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(
        todolistActions.changeTodolistEntityStatusAC({
          status: "loading",
          todolistId: todoListID,
        })
      );
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.deleteTodolist(todoListID);
      if (res.data.resultCode === 0) {
        dispatch(todolistActions.removeTodolistAC({ id: todoListID }));
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      const err = e as Error | AxiosError;
      handleServerNetworkError(err, dispatch);
    }
  };
export const editTitleTodoListTC =
  (todoListID: string, title: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.updateTodolistTitle(todoListID, title);
      if (res.data.resultCode === 0) {
        dispatch(
          todolistActions.changeTodoListTitleAC({
            title: title,
            id: todoListID,
          })
        );
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      const err = e as Error | AxiosError;
      handleServerNetworkError(err, dispatch);
    }
  };
