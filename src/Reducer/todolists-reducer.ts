import {todolistAPI, TodolistType} from "../api/todolists-api";
import {AppDispatch} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setTasksTC} from "./task-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type AllTodolistsActions =
    | removeTodolistACType
    | addTodoListACType
    | setTodoListACType
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | clearTodosDataACType

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType,
}

const initialState: Array<TodolistDomainType> = [];


const slice = createSlice({
    name: "todoListsReducer",
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodoListAC(state, action: PayloadAction<{ newTodolist: TodolistType }>) {
            state.unshift({...action.payload.newTodolist, filter: "all", entityStatus: "idle"})
        },
        setTodoListAC(state, action: PayloadAction<{ todoLists: Array<TodolistType> }>) {
            return action.payload.todoLists.map(tl => ({
                ...tl, filter: 'all', entityStatus: "idle"
            }))
        },
        changeTodoListTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(el => el.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.status

        },
        clearTodosDataAC(state, action: PayloadAction) {
            state = []

        },
    }

})
export const todoListsReducer = slice.reducer


const todoListsReduce1 = (state = initialState, action: AllTodolistsActions): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.payload.id)
        case 'ADD-TODOLIST':
            return [{
                ...action.newTodolist
                , filter: "all", entityStatus: "idle"
            }, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.payload.id ? {...el, title: action.payload.title} : el)
        case 'CHANGE-TODOLIST-FILTER' :
            return state.map(el => el.id === action.payload.id ? {...el, filter: action.payload.filter} : el)
        case "SET-TODOLIST":
            return action.todoLists.map(tl => ({
                ...tl, filter: 'all', entityStatus: "idle"
            }))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.todolistId ?
                {...tl, entityStatus: action.status} : tl)
        case "CLEAR-TODOLIST-DATA":
            return []
        default:
            return state
    }
};
//============================== AC ===========================================
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (id: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {id}
    } as const
}

export type addTodoListACType = ReturnType<typeof addTodoListAC>
export const addTodoListAC = (newTodolist: TodolistType) => ({
    type: 'ADD-TODOLIST',
    newTodolist
} as const)

export type setTodoListACType = ReturnType<typeof setTodoListAC>
export const setTodoListAC = (todoLists: Array<TodolistType>) => ({
    type: 'SET-TODOLIST',
    todoLists,
} as const)

export const changeTodoListTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    payload: {id, title}
} as const)

export const changeFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    payload: {id, filter}
} as const)

export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    todolistId, status
} as const)

export type clearTodosDataACType = ReturnType<typeof clearTodosDataAC>
export const clearTodosDataAC = () => ({
    type: 'CLEAR-TODOLIST-DATA',
} as const)


//=======================Thunk async await =========================

export const setTodoListTC = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistAPI.getTodolists()
        dispatch(setTodoListAC(res.data))
        dispatch(setAppStatusAC({status: "succeeded"}))
        res.data.forEach(tl => {
            dispatch(setTasksTC(tl.id))
        })
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            const error = err.response?.data
                ? (err.response.data as { error: string }).error : err.message
            handleServerNetworkError(error, dispatch)
        }
    }

}

export const addTodoListTC = (title: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistAPI.createTodolist(title)

        if (res.data.resultCode === 0) {
            dispatch(addTodoListAC(res.data.data.item))
            dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }

    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            const error = err.response?.data
                ? (err.response.data as { error: string }).error : err.message
            handleServerNetworkError(error, dispatch)
        }
    }


}
export const removeTodoListTC = (todoListID: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(changeTodolistEntityStatusAC(todoListID, "loading"))
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistAPI.deleteTodolist(todoListID)
        if (res.data.resultCode === 0) {
            dispatch(removeTodolistAC(todoListID))
            dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }

    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            const error = err.response?.data
                ? (err.response.data as { error: string }).error : err.message
            handleServerNetworkError(error, dispatch)
        }
    }

}
export const editTitleTodoListTC = (todoListID: string, title: string) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const res = await todolistAPI.updateTodolistTitle(todoListID, title)
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC(todoListID, title))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }

        } catch (e) {
            const err = e as Error | AxiosError
            if (axios.isAxiosError(err)) {
                const error = err.response?.data
                    ? (err.response.data as { error: string }).error : err.message
                handleServerNetworkError(error, dispatch)
            }
        }
    }




