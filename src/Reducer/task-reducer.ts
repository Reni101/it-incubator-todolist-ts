import {TaskStatuses, TaskType, todolistAPI} from "../api/todolists-api";
import axios, {AxiosError} from 'axios';

import {AppDispatch, AppRootStateType} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {addTodoListAC, clearTodosDataAC, removeTodolistAC, setTodoListAC} from "./todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type AllTasksActions =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTaskAC>
    | ReturnType<typeof setTodoListAC>
    | ReturnType<typeof addTodoListAC>
    | ReturnType<typeof clearTodosDataAC>
    | ReturnType<typeof removeTodolistAC>


export type TasksType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksType = {}


const slice = createSlice({
    name: "tasksReducer",
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) tasks.splice(index, 1)

        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType}>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        changeTaskStatusAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {

        },
        changeTaskTitleAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {

        },
        setTaskAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todoListId: string }>) {
        },
    }
})

export const tasksReducer = slice.reducer
//
// export const tasksReducer = (state = initialState, action: AllTasksActions): TasksType => {
//     switch (action.type) {
//
//         case 'CHANGE-TASK-STATUS':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {
//                     ...el,
//                     status: action.status
//                 } : el)
//             }
//
//         case 'CHANGE-TASK-TITLE':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {
//                     ...el,
//                     title: action.title
//                 } : el)
//             }
//
//         case addTodoListAC.type:
//             return {...state, [action.newTodolist.id]: []}
//
//         case removeTodolistAC.type: {
//             const stateCopy = {...state}
//             delete stateCopy[action.payload.id]
//             return stateCopy
//         }
//         case setTodoListAC.type:
//             const copyState = {...state};
//             action.todoLists.forEach(tl => copyState[tl.id] = [])
//             return copyState
//
//         case "SET-TASKS":
//             return {...state, [action.todoListId]: action.tasks}
//         case clearTodosDataAC.type:
//             return {}
//         default:
//             return state
//     }
// };
export const {
    removeTaskAC, addTaskAC,
    changeTaskStatusAC, changeTaskTitleAC, setTaskAC
} = slice.actions
//==================================AC ===========================================
// export const removeTaskAC = (taskId: string, todolistId: string) => ({
//     type: "REMOVE-TASK",
//     payload: {
//         taskId,
//         todolistId,
//     }
// } as const)
// export const addTaskAC = (task: TaskType) => ({type: "ADD-TASK", task} as const)
// export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => ({
//     type: "CHANGE-TASK-STATUS",
//     taskId,
//     status,
//     todolistId,
// } as const)
// export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => ({
//     type: "CHANGE-TASK-TITLE",
//     taskId,
//     title,
//     todolistId,
// } as const)
// export const setTaskAC = (tasks: Array<TaskType>, todoListId: string) => ({
//     type: 'SET-TASKS',
//     tasks,
//     todoListId,
// } as const)


//================================= TC =============================


export const setTasksTC = (todolistId: string) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const res = await todolistAPI.getTasks(todolistId)
            dispatch(setTaskAC(res.data.items, todolistId))
            dispatch(setAppStatusAC({status: 'succeeded'}))

        } catch (e) {
            const err = e as Error | AxiosError
            if (axios.isAxiosError(err)) {
                const error = err.response?.data
                    ? (err.response.data as { error: string }).error : err.message
                handleServerNetworkError(error, dispatch)
            }
        }
    }

export const removeTaskTC = (todolistId: string, taskId: string) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const res = await todolistAPI.deleteTask(todolistId, taskId)
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC({status: 'succeeded'}))
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

export const addTaskTC = (todolistId: string, title: string) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const res = await todolistAPI.addTaskForTodolist(todolistId, title)
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC({status: 'succeeded'}))

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

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) =>
    async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const task = getState().task[todolistId].find(t => t.id === taskId)
            if (!!task) {
                const res = await todolistAPI.updateTask(todolistId, taskId, {
                    title: task.title,
                    status,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                })
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskStatusAC(taskId, status, todolistId))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }

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

export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) =>
    async (dispatch: AppDispatch, getState: () => AppRootStateType) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const task = getState().task[todolistId].find(t => t.id === taskId)
            if (!!task) {
                const res = await todolistAPI.updateTask(todolistId, taskId, {
                    title,
                    status: task.status,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                })

                if (res.data.resultCode === 0) {
                    dispatch(changeTaskTitleAC(taskId, title, todolistId))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }

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
