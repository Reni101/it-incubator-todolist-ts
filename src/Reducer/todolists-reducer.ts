import {v1} from "uuid";
import {TodolistType} from "../api/todolists-api";

const RemoveTodoList = 'REMOVE-TODOLIST'
const AddTodoList = 'ADD-TODOLIST'


type AllActions = removeTodolistACType
    | addTodoListACType
    | editTodoListAcType
    | changeFilterACType

export type FilterValuesType = 'all' | 'active' | 'completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

const initialState: Array<TodolistDomainType> = [];

export const todoListsReducer = (state = initialState, action: AllActions): Array<TodolistDomainType> => {
    switch (action.type) {
        case RemoveTodoList: {
            return state.filter(el => el.id !== action.payload.id)
        }
        case AddTodoList: {

            let newTodolist: TodolistDomainType = {
                id: action.payload.id,
                title: action.payload.title, filter: "all", addedDate: "",
                order: 0
            }
            return [...state, newTodolist]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.payload.id ? {...el, title: action.payload.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER' : {
            return state.map(el => el.id === action.payload.id ? {...el, filter: action.payload.filter} : el)
        }

        default:
            return state
    }
};

export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (id: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {id}
    } as const
}

export type addTodoListACType = ReturnType<typeof addTodoListAC>
export const addTodoListAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {title, id: v1()}
    } as const

}

type editTodoListAcType = ReturnType<typeof editTodoListAc>
export const editTodoListAc = (id: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {id, title}
    } as const
}

type changeFilterACType = ReturnType<typeof changeFilterAC>
export const changeFilterAC = (id: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {id, filter}
    } as const
}

