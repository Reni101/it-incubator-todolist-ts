import {TasksType} from "../App";

type removeTaskACType = ReturnType<typeof removeTaskAC>

type AllActions = removeTaskACType


export const tasksReducer = (state: TasksType, action: AllActions): TasksType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(el => el.id !== action.taskId)
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