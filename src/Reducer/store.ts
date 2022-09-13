import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {AllTasksActions, tasksReducer} from "./task-reducer";
import {AllTodolistsActions, todoListsReducer} from "./todolists-reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";
import {AuthActionsType, authReducer} from "./authReducer";


const rootReducer = combineReducers({
    task: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth: authReducer

})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AllAppActionsType = AllTasksActions | AllTodolistsActions | AppActionsType | AuthActionsType


export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AllAppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AllAppActionsType>

// @ts-ignore
window.store = store