import {todolistAPI, TodolistType} from "../api/todolists-api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type AllTodolistsActions =
    | removeTodolistACType
    | addTodoListACType
    | setTodoListACType
    | ReturnType<typeof editTodoListAc>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType,
}

const initialState: Array<TodolistDomainType> = [];

export const todoListsReducer = (state = initialState, action: AllTodolistsActions): Array<TodolistDomainType> => {
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

export const editTodoListAc = (id: string, title: string) => ({
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


//=======================Thunk async await =========================

export const setTodoListTC = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await todolistAPI.getTodolists()
        dispatch(setTodoListAC(res.data))
        dispatch(setAppStatusAC('succeeded'))
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(err, dispatch)
        } else {
            console.error(err)
        }
    }

}

export const addTodoListTC = (title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await todolistAPI.createTodolist(title)

        if (res.data.resultCode === 0) {
            dispatch(addTodoListAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }

    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(err, dispatch)
        } else {
            console.error(err)
        }
    }


}
export const removeTodoListTC = (todoListID: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(changeTodolistEntityStatusAC(todoListID, "loading"))
            dispatch(setAppStatusAC("loading"))
            const res = await todolistAPI.deleteTodolist(todoListID)
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todoListID))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                handleServerNetworkError(err, dispatch)
            } else {
                console.error(err)
            }
        }

    }
export const editTitleTodoListTC = (todoListID: string, title: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(setAppStatusAC("loading"))
            const res = await todolistAPI.updateTodolistTitle(todoListID, title)
            if (res.data.resultCode === 0) {
                dispatch(editTodoListAc(todoListID, title))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                handleServerNetworkError(err, dispatch)
            } else {
                console.error(err)
            }
        }
    }




