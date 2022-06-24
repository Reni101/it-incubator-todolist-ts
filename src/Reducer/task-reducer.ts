import {TasksType, TaskType} from "../App";
import {v1} from "uuid";

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>

type AllActions = removeTaskACType | addTaskACType | changeTaskStatusACType


export const tasksReducer = (state: TasksType, action: AllActions): TasksType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)
            }
        }
        case 'ADD-TASK': {
            const newTask: TaskType = {
                id: v1(), title: action.title, isDone: false,
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
                    isDone: action.isDone
                } : el)
            }
        }


        default:
            return state
    }
};


export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: "REMOVE-TODOLIST",
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
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {
        type: "CHANGE-TASK-STATUS",
        taskId,
        isDone,
        todolistId,
    } as const
}