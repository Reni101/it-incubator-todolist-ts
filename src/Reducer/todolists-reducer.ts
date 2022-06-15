import {TodolistsType} from "../App";
import {v1} from "uuid";

type AllActions = removeTodolistACType | addTodoListACType | editTodoListAcType | changeFilterACType


export const todoListsReducer = (state: Array<TodolistsType>, action: AllActions) => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.payload.id)
        }
        case 'ADD-TODOLIST': {
            const newId = v1();
            let newTodolist: TodolistsType = {id: newId, title: action.payload.title, filter: "all"}
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

type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export const removeTodolistAC = (id: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {id}
    } as const
}

type addTodoListACType = ReturnType<typeof addTodoListAC>
export const addTodoListAC = (title: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {title}
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
export const changeFilterAC = (id: string, filter: string) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {id, filter}
    } as const
}

