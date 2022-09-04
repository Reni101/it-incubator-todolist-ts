import {TasksType} from "../AppWithRedux";
import {TaskStatuses, TaskType, todolistAPI} from "../api/todolists-api";

import {AppRootStateType, AppThunk} from "./store";
import {addTodoListACType, removeTodolistACType, setTodoListACType} from "./todolists-reducer";

export type AllTasksActions =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTaskAC>
    | addTodoListACType
    | removeTodolistACType
    | setTodoListACType

const initialState: TasksType = {}

export const tasksReducer = (state = initialState, action: AllTasksActions): TasksType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)
            }
        }
        case 'ADD-TASK': {

            return {
                ...state, [action.task.todoListId]: [action.task,
                    ...state[action.task.todoListId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {
                    ...el,
                    status: action.status
                } : el)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {
                    ...el,
                    title: action.title
                } : el)
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.newTodolist.id]: []}
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.payload.id]
            return stateCopy
        }
        case "SET-TODOLIST": {
            const copyState = {...state};
            action.todoLists.forEach(tl => copyState[tl.id] = [])
            return copyState
        }
        case "SET-TASKS": {
            return {...state, [action.todoListId]: action.tasks}
        }


        default:
            return state
    }
};

//==================================AC ===========================================
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: "REMOVE-TASK",
        taskId,
        todolistId,
    } as const

}
export const addTaskAC = (task: TaskType) => {
    return {
        type: "ADD-TASK",
        task
    } as const
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: "CHANGE-TASK-STATUS",
        taskId,
        status,
        todolistId,
    } as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {
        type: "CHANGE-TASK-TITLE",
        taskId,
        title,
        todolistId,
    } as const
}
export const setTaskAC = (tasks: Array<TaskType>, todoListId: string) => {
    return {
        type: 'SET-TASKS',
        tasks,
        todoListId,
    } as const
}


//================================= TC =============================


export const setTasksTC = (todolistId: string): AppThunk =>
    async dispatch => {
        try {
            const res = await todolistAPI.getTasks(todolistId)
            dispatch(setTaskAC(res.data.items, todolistId))

        } catch (e) {

        }
    }

export const removeTaskTC = (todolistId: string, taskId: string): AppThunk =>
    async dispatch => {
        try {
            await todolistAPI.deleteTask(todolistId, taskId)
            dispatch(removeTaskAC(taskId, todolistId))
        } catch (e) {

        }
    }

export const addTaskTC = (todolistId: string, title: string): AppThunk =>
    async dispatch => {
        try {
            const res = await todolistAPI.addTaskForTodolist(todolistId, title)
            dispatch(addTaskAC(res.data.data.item))
        } catch (e) {

        }
    }

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses): AppThunk =>
    async (dispatch,
           getState: () => AppRootStateType) => {
        try {
            const task = getState().task[todolistId].find(t => t.id === taskId)
            if (!!task) {
                await todolistAPI.updateTask(todolistId, taskId, {
                    title: task.title,
                    status: status,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                })
                dispatch(changeTaskStatusAC(taskId, status, todolistId))
            }
        } catch (e) {

        }
    }

export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string): AppThunk =>
    async (dispatch,
           getState: () => AppRootStateType) => {
        try {
            const task = getState().task[todolistId].find(t => t.id === taskId)
            if (task) {
                await todolistAPI.updateTask(todolistId, taskId, {
                    title,
                    status: task.status,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,

                })
                dispatch(changeTaskTitleAC(taskId, title, todolistId))
            }
        } catch (e) {

        }
    }
