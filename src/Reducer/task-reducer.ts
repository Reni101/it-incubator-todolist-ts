import {addTodoListACType, removeTodolistACType, setTodoListACType} from "./todolists-reducer";
import {TasksType} from "../AppWithRedux";
import {TaskStatuses, TaskType, todolistAPI} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
type setTaskACType = ReturnType<typeof setTaskAC>

type AllActions = removeTaskACType
    | addTaskACType | changeTaskStatusACType
    | changeTaskTitleACType | addTodoListACType
    | removeTodolistACType
    | setTodoListACType
    | setTaskACType

const initialState: TasksType = {}

export const tasksReducer = (state = initialState, action: AllActions): TasksType => {
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
            return {...state, [action.payload.id]: []}
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
//=================================TC =============================
export const setTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
    const res = await todolistAPI.getTasks(todolistId)
    dispatch(setTaskAC(res.data.items, todolistId))
}

export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    await todolistAPI.deleteTask(todolistId, taskId)
    dispatch(removeTaskAC(taskId, todolistId))
}
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    const res = await todolistAPI.addTaskForTodolist(todolistId, title)
    dispatch(addTaskAC(res.data.data.item))
}
export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const task = getState().task[todolistId].find(t => t.id === taskId)

        if (task) {
            todolistAPI.updateTask(todolistId, taskId, {
                title: task.title,
                status: status,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,

            })
                .then(() => {
                    dispatch(changeTaskStatusAC(taskId, status, todolistId))
                })
        }

    }

export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const task = getState().task[todolistId].find(t => t.id === taskId)

        if (task) {
            todolistAPI.updateTask(todolistId, taskId, {
                title,
                status: task.status,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,

            })
                .then(() => {
                    dispatch(changeTaskTitleAC(taskId, title, todolistId))
                })
        }

    }
