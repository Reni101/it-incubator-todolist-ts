import { instance } from "./baseURL";

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {
      title,
    });
  },
  deleteTodolist(todolistID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistID}`);
  },
  updateTodolistTitle(todolistID: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistID}`, { title });
  },
  getTasks(todolistID: string) {
    return instance.get<GetTaskResponseType>(`todo-lists/${todolistID}/tasks`);
  },
  addTaskForTodolist(todolistID: string, titleTask: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistID}/tasks`,
      {
        title: titleTask,
      }
    );
  },
  deleteTask(todolistID: string, taskId: string) {
    return instance.delete<ResponseType>(
      `/todo-lists/${todolistID}/tasks/${taskId}`
    );
  },
  updateTask(todolistID: string, taskId: string, model: modelType) {
    return instance.put<ResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistID}/tasks/${taskId}`,
      model
    );
  },
};

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
  id: string;
  addedDate: string;
  order: number;
  title: string;
};

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
};

export type modelType = {
  title?: string;
  description?: string;
  status?: number;
  priority?: number;
  startDate?: string;
  deadline?: string;
};

type FieldErrorType = {
  error: string;
  field: string;
};

export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: FieldErrorType[];
  data: D;
};

export type GetTaskResponseType = {
  totalCount: number;
  error: string | null;
  items: Array<TaskType>;
};
