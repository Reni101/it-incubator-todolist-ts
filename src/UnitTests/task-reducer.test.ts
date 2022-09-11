import React from 'react';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "../Reducer/task-reducer";
import {TasksType} from "../app/App";
import {TaskStatuses} from "../api/todolists-api";


let startState: TasksType;

beforeEach(() => {
    startState = {
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

})

test('correct task should be deleted from correct array', () => {


    const action = removeTaskAC('2', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
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
                id: "3", title: "tea", status: TaskStatuses.New,
                todoListId: 'todolistId2', startDate: "string",
                order: 0, addedDate: "string", description: "string",
                deadline: "string", priority: 0
            },
        ]
    })
})

test('correct task should be added to correct array', () => {


    const action = addTaskAC({
        id: "3", title: "juce", status: TaskStatuses.New,
        todoListId: 'todolistId2', startDate: "string",
        order: 0, addedDate: "string", description: "string",
        deadline: "string", priority: 0
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe("juce")
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {


    const action = changeTaskStatusAC('2', TaskStatuses.New, 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
})

test('title of specified task should be changed', () => {


    const action = changeTaskTitleAC('2', "bread", 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe("bread")
    expect(endState['todolistId1'][1].title).toBe('JS')
})