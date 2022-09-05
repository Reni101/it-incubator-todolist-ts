import { applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {AllTasksActions, tasksReducer} from "./task-reducer";
import {AllTodolistsActions, todoListsReducer} from "./todolists-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {ActionsAppType, appReducer} from "./app-reducer";


const rootReducer = combineReducers({
    task: tasksReducer,
    todolists: todoListsReducer,
    app:appReducer

})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppActionsType = AllTasksActions | AllTodolistsActions | ActionsAppType


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

// @ts-ignore
window.store = store