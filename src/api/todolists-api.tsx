import axios from "axios";

const instane = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': "fab19197-098e-4362-876a-0c0797e21ac6"
    }
})

export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type TaskType = {
    id: string;
    title: string;
    description: string;
    todoListId: string;
    order: number;
    status: number;
    priority: number;
    startDate: string;
    deadline: string;
    addedDate: string;
}

export type ResponseTodolistType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export type GetTaskResponseType = {
    totalCount: number;
    error: string | null;
    items: Array<TaskType>;
}
export type ResponseTask<T = {}> = {
    data: T;
    messages: string[];
    fieldsErrors: string[];  //?
    resultCode: number;
}


export const todolistAPI = {
    getTodolists() {
        return instane.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instane.post<ResponseTodolistType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistID: string) {
        return instane.delete<ResponseTodolistType>(`todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID: string, title: string) {
        return instane.put<ResponseTodolistType>(`todo-lists/${todolistID}`, {title})
    },
    getTasks(todolistID: string) {
        return instane.get<GetTaskResponseType>(`todo-lists/${todolistID}/tasks`)
    },
    addTaskForTodolist(todolistID: string, titleTask: string) {
        return instane.post<ResponseTask<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title: titleTask})
    },
    deleteTask(todolistID: string, taskId: string) {
        return instane.delete<ResponseTask>(`/todo-lists/${todolistID}/tasks/${taskId}`)
    },
    updateTaskTitle(todolistID: string, taskId: string, task: any) {
        return instane.put(`/todo-lists/${todolistID}/tasks/${taskId}`, {...task})
    },

}