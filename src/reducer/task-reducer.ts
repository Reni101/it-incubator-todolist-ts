import { TaskType } from "api/todolists-api";

import { createSlice } from "@reduxjs/toolkit";
import { clearState } from "common/actions/common.actions";
import { todolistThunk } from "reducer/todolists-reducer";
import {
  addTask,
  getTasks,
  removeTask,
  updateTask,
} from "reducer/Thunks/task-thunks";

export type TasksType = {
  [key: string]: TaskType[];
};

const slice = createSlice({
  name: "tasksReducer",
  initialState: {} as TasksType,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(todolistThunk.addTodoList.fulfilled, (state, action) => {
      state[action.payload.newTodolist.id] = [];
    });
    builder.addCase(todolistThunk.removeTodoList.fulfilled, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(todolistThunk.getTodoList.fulfilled, (state, action) => {
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
export const tasksThunks = { getTasks, removeTask, updateTask, addTask };
