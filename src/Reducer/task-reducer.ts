import {v1} from "uuid";
import {addTodoListACType, removeTodolistACType, setTodoListACType} from "./todolists-reducer";
import {TasksType} from "../AppWithRedux";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI} from "../api/todolists-api";
import {Dispatch} from "redux";

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
            const newTask: TaskType = {
                id: v1(), title: action.title, priority: TaskPriorities.Middle,
                addedDate: "", deadline: "", description: "",
                order: 0, startDate: "", status: TaskStatuses.New, todoListId: ""
            }
            return {
                ...state, [action.todolistId]: [newTask, ...state[action.todolistId]]
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
export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: "ADD-TASK",
        title,
        todolistId,
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