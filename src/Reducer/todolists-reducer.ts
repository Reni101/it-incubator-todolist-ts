import { TodolistType } from "../api/todolists-api";
import { RequestStatusType } from "./app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearState } from "../common/actions/common.actions";
import {
  addTodoList,
  editTitleTodoList,
  getTodoList,
  removeTodoList,
} from "./Thunks/todolist-thunks";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

const initialState: Array<TodolistDomainType> = [];

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
    builder.addCase(getTodoList.fulfilled, (state, action) => {
      return action.payload.todoLists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    });
    builder.addCase(addTodoList.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.newTodolist,
        filter: "all",
        entityStatus: "idle",
      });
    });
    builder.addCase(removeTodoList.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(editTitleTodoList.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.id);
      state[index].title = action.payload.title;
    });
  },
});

export const todoListsReducer = slice.reducer;
export const todolistActions = slice.actions;
export const todolistThunk = {
  getTodoList,
  addTodoList,
  removeTodoList,
  editTitleTodoList,
};
