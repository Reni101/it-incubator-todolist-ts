import {tasksReducer} from "./task-reducer";
import {addTodoListAC, todoListsReducer} from "./todolists-reducer";
import {TasksType, TodolistsType} from "../App";

test('ids should be equals', () => {
    const startTasksState: TasksType = {}
    const startTodolistsState: Array<TodolistsType> = []

    const action = addTodoListAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.id)
    expect(idFromTodolists).toBe(action.payload.id)
})