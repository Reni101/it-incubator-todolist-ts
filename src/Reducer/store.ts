import { combineReducers} from "redux";
import { tasksReducer} from "./task-reducer";
import { todoListsReducer} from "./todolists-reducer";
import thunk, {} from "redux-thunk";
import { appReducer} from "./app-reducer";
import { authReducer} from "./auth-reducer";
import {configureStore} from "@reduxjs/toolkit";


const rootReducer = combineReducers({
    task: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth: authReducer

})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .prepend(thunk)

})

export type AppRootStateType = ReturnType<typeof rootReducer>

//export type AllAppActionsType = AllTasksActions | AllTodolistsActions | AppActionsType |  AuthActionsType

export type AppDispatch = typeof store.dispatch

//export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AllAppActionsType>
//export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AllAppActionsType>

// @ts-ignore
window.store = store