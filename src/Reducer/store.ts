import {combineReducers,legacy_createStore } from "redux";
import {tasksReducer} from "./task-reducer";
import {todoListsReducer} from "./todolists-reducer";


const rootReducer = combineReducers({
    task: tasksReducer,
    todolists: todoListsReducer,

})

export const store = legacy_createStore(rootReducer)

export type AppRootStateType = ReturnType<typeof rootReducer>
// @ts-ignore
window.store = store