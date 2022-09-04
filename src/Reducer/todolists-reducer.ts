import {todolistAPI, TodolistType} from "../api/todolists-api";
import {AppThunk} from "./store";


const RemoveTodoList = 'REMOVE-TODOLIST'
const AddTodoList = 'ADD-TODOLIST'


export type AllTodolistsActions =
    | removeTodolistACType
    | addTodoListACType
    | ReturnType<typeof editTodoListAc>
    | ReturnType<typeof changeFilterAC>
    | setTodoListACType

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
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
                , filter: "all",
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
                ...tl, filter: 'all'
            }))
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



//=======================Thunk async await =========================

export const setTodoListTC = (): AppThunk => async dispatch => {
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(setTodoListAC(res.data))
    } catch (e) {

    }


}

export const addTodoListTC = (title: string): AppThunk => async dispatch => {
    try {
        const res = await todolistAPI.createTodolist(title)
        dispatch(addTodoListAC(res.data.data.item))
    } catch (e) {

    }


}
export const removeTodoListTC = (todoListID: string): AppThunk =>
    async dispatch => {
        try {
            await todolistAPI.deleteTodolist(todoListID)
            dispatch(removeTodolistAC(todoListID))
        } catch (e) {

        }


    }
export const editTitleTodoListTC = (todoListID: string, title: string): AppThunk =>
    async dispatch => {
        try {
            await todolistAPI.updateTodolistTitle(todoListID, title)
            dispatch(editTodoListAc(todoListID, title))
        } catch (e) {

        }
    }




