import {todolistAPI, TodolistType} from "../api/todolists-api";
import {AppThunk} from "./store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";


const RemoveTodoList = 'REMOVE-TODOLIST'
const AddTodoList = 'ADD-TODOLIST'


export type AllTodolistsActions =
    | removeTodolistACType
    | addTodoListACType
    | ReturnType<typeof editTodoListAc>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | setTodoListACType

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType,
}

const initialState: Array<TodolistDomainType> = [];

export const todoListsReducer = (state = initialState, action: AllTodolistsActions): Array<TodolistDomainType> => {
    switch (action.type) {
        case RemoveTodoList: {
            return state.filter(el => el.id !== action.payload.id)
        }
        case AddTodoList: {
            let newTodolist: TodolistDomainType = {
                ...action.newTodolist
                , filter: "all", entityStatus: "idle"
            }
            return [newTodolist, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.payload.id ? {...el, title: action.payload.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER' : {
            return state.map(el => el.id === action.payload.id ? {...el, filter: action.payload.filter} : el)
        }
        case "SET-TODOLIST": {
            return action.todoLists.map(tl => ({
                ...tl, filter: 'all', entityStatus: "idle"
            }))
        }
        case "CHANGE-TODOLIST-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.todolistId ?
                {...tl, entityStatus: action.status} : tl)
        }

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
export const addTodoListAC = (newTodolist: TodolistType) => {
    return {
        type: 'ADD-TODOLIST',
        newTodolist
    } as const

}

export type setTodoListACType = ReturnType<typeof setTodoListAC>
export const setTodoListAC = (todoLists: Array<TodolistType>) => {
    return {
        type: 'SET-TODOLIST',
        todoLists,
    } as const
}


export const editTodoListAc = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {id, title}
    } as const
}

export const changeFilterAC = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {id, filter}
    } as const
}

export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => {
    return {
        type: 'CHANGE-TODOLIST-ENTITY-STATUS',
        todolistId, status
    } as const
}


//=======================Thunk async await =========================

export const setTodoListTC = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await todolistAPI.getTodolists()
        dispatch(setTodoListAC(res.data))
        dispatch(setAppStatusAC("succeeded"))
    } catch (e) {

    }


}

export const addTodoListTC = (title: string): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatusAC("loading"))
        const res = await todolistAPI.createTodolist(title)

        if (res.data.resultCode === 0) {
            dispatch(addTodoListAC(res.data.data.item))
            dispatch(setAppStatusAC("succeeded"))
        } else {
            if (res.data.messages.length) {
                dispatch(setAppErrorAC(res.data.messages[0]))
            } else {
                dispatch(setAppErrorAC("Some error occurred"))
            }
            dispatch(setAppStatusAC('failed'))
        }

    } catch (e) {

    }


}
export const removeTodoListTC = (todoListID: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(changeTodolistEntityStatusAC(todoListID, "loading"))
            dispatch(setAppStatusAC("loading"))
            await todolistAPI.deleteTodolist(todoListID)
            dispatch(removeTodolistAC(todoListID))
            dispatch(setAppStatusAC("succeeded"))
        } catch (e) {

        }


    }
export const editTitleTodoListTC = (todoListID: string, title: string): AppThunk =>
    async dispatch => {
        try {
            dispatch(setAppStatusAC("loading"))
            await todolistAPI.updateTodolistTitle(todoListID, title)
            dispatch(editTodoListAc(todoListID, title))
            dispatch(setAppStatusAC("succeeded"))
        } catch (e) {

        }
    }




