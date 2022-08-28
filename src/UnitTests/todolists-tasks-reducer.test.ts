import {tasksReducer} from "../Reducer/task-reducer";
import {addTodoListAC, removeTodolistAC, TodolistDomainType, todoListsReducer} from "../Reducer/todolists-reducer";
import {TasksType} from "../AppWithRedux";
import {TaskStatuses} from "../api/todolists-api";


test('ids should be equals', () => {
    const startTasksState: TasksType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const action = addTodoListAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.id)
    expect(idFromTodolists).toBe(action.payload.id)
})

test('property with todolistId should be deleted', () => {
    const startState: TasksType = {
        'todolistId1': [

            {
                id: "1", title: "CSS", status: TaskStatuses.New,
                todoListId: 'todolistId1', startDate: "string",
                order: 0, addedDate: "string", description: "string",
                deadline: "string", priority: 0
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed,
                todoListId: 'todolistId1', startDate: "string",
                order: 0, addedDate: "string", description: "string",
                deadline: "string", priority: 0
            },
            {
                id: "3", title: "React", status: TaskStatuses.New,
                todoListId: 'todolistId1', startDate: "string",
                order: 0, addedDate: "string", description: "string",
                deadline: "string", priority: 0
            },
        ],
        'todolistId2': [
            {
                id: "1", title: "bread", status: TaskStatuses.New,
                todoListId: 'todolistId2', startDate: "string",
                order: 0, addedDate: "string", description: "string",
                deadline: "string", priority: 0
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed,
                todoListId: 'todolistId2', startDate: "string",
                order: 0, addedDate: "string", description: "string",
                deadline: "string", priority: 0
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New,
                todoListId: 'todolistId2', startDate: "string",
                order: 0, addedDate: "string", description: "string",
                deadline: "string", priority: 0
            },
        ]
    }

    const action = removeTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})