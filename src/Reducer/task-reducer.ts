import {TaskStatuses, TaskType, todolistAPI} from "../api/todolists-api";
import axios, {AxiosError} from 'axios';

import {AppDispatch, AppRootStateType} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {addTodoListAC, removeTodolistAC, setTodoListAC} from "./todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


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
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        changeTaskStatusAC(state, action: PayloadAction<{ taskId: string, status: TaskStatuses, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) tasks[index] = {...tasks[index], status: action.payload.status}
        },
        changeTaskTitleAC(state, action: PayloadAction<{ taskId: string, title: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(el => el.id === action.payload.taskId)
            if (index > -1) tasks[index] = {...tasks[index], title: action.payload.title}
        },
        setTaskAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todoListId: string }>) {
            state[action.payload.todoListId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.newTodolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodoListAC, (state, action) => {
            action.payload.todoLists.forEach(tl => state[tl.id] = [])
        })
    }

})

export const tasksReducer = slice.reducer

export const {
    removeTaskAC, addTaskAC,
    changeTaskStatusAC, changeTaskTitleAC, setTaskAC
} = slice.actions
//================================= TC =============================


export const setTasksTC = (todolistId: string) =>
    async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const res = await todolistAPI.getTasks(todolistId)
            dispatch(setTaskAC({tasks: res.data.items, todoListId: todolistId}))
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
                dispatch(removeTaskAC({taskId, todolistId}))
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
                dispatch(addTaskAC({task: res.data.data.item}))
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

                    dispatch(changeTaskStatusAC({status,taskId,todolistId}))
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
                    dispatch(changeTaskTitleAC({taskId, title, todolistId}))
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
