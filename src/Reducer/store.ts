import {applyMiddleware, combineReducers,legacy_createStore } from "redux";
import {tasksReducer} from "./task-reducer";
import {todoListsReducer} from "./todolists-reducer";
import thunk from "redux-thunk";



const rootReducer = combineReducers({
    task: tasksReducer,
    todolists: todoListsReducer,

})

export const store = legacy_createStore(rootReducer,applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store