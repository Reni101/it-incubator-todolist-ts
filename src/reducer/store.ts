import { combineReducers } from "redux";

import thunk from "redux-thunk";

import { configureStore } from "@reduxjs/toolkit";
import { appReducer } from "reducer/app-reducer";
import { todoListsReducer } from "reducer/todolists-reducer";
import { tasksReducer } from "reducer/task-reducer";
import { authReducer } from "reducer/auth-reducer";

const rootReducer = combineReducers({
  task: tasksReducer,
  todolists: todoListsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
