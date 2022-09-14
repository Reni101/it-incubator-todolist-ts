import axios from "axios";

const instane = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': "fab19197-098e-4362-876a-0c0797e21ac6"
    }
})

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

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
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    addedDate: string;
}

export type modelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

export type ResponseType<D = {}> = {
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


export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}


export const todolistAPI = {
    getTodolists() {
        return instane.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instane.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistID: string) {
        return instane.delete<ResponseType>(`todo-lists/${todolistID}`)
    },
    updateTodolistTitle(todolistID: string, title: string) {
        return instane.put<ResponseType>(`todo-lists/${todolistID}`, {title})
    },
    getTasks(todolistID: string) {
        return instane.get<GetTaskResponseType>(`todo-lists/${todolistID}/tasks`)
    },
    addTaskForTodolist(todolistID: string, titleTask: string) {
        return instane.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistID}/tasks`, {title: titleTask})
    },
    deleteTask(todolistID: string, taskId: string) {
        return instane.delete<ResponseType>(`/todo-lists/${todolistID}/tasks/${taskId}`)
    },
    updateTask(todolistID: string, taskId: string, model: modelType) {
        return instane.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistID}/tasks/${taskId}`, model)
    },

}

export const authAPI = {
    login(data: LoginParamsType) {
        return instane.post<ResponseType<{ userId: number }>>("/auth/login", data)
    },
    logout() {
        return instane.delete<ResponseType>("/auth/login")
    },

    me() {
        return instane.get<ResponseType<{ id: string, email: string, login: string }>>("/auth/me")
    },
}