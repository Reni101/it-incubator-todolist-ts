import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodoListAC,
    changeFilterAC,
    editTodoListAc,
    removeTodolistAC,
    todoListsReducer
} from "./Reducer/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./Reducer/task-reducer";

export type TaskType = {
    id: string, title: string, isDone: boolean
}


export type TasksType = {
    [key: string]: Array<TaskType>
}
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistsType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

const AppWithReducers = () => {

    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer,[
        {id: todolistID1, title: 'What to learn Front', filter: 'all'},
        {id: todolistID2, title: 'What to learn Back', filter: 'all'},
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer,{
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "NodeJS", isDone: true},
            {id: v1(), title: "C#", isDone: false},
            {id: v1(), title: "Mongodb", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ]
    });

    const removeTask = (todoListID: string, tasksID: string) => {
        dispatchToTasks(removeTaskAC(tasksID,todoListID))

    }
    const changeFilter = (todoListID: string, filter: FilterValuesType) => {
        dispatchToTodoLists(changeFilterAC(todoListID,filter))
    }

    const addTask = (todoListID: string, title: string) => {
        dispatchToTasks(addTaskAC(title,todoListID))
    }

    const changeTaskStatus = (todoListID: string, tasksID: string, isDone: boolean) => {
        dispatchToTasks(changeTaskStatusAC(tasksID,isDone,todoListID))
    }

    const removeTodolist = (todoListID: string) => {
        dispatchToTodoLists(removeTodolistAC(todoListID))
        dispatchToTasks(removeTodolistAC(todoListID))

    }
    const addTodoList = (title: string) => {
       const action = addTodoListAC(title)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }
    const editTodolist = (toDoListID: string, newTitle: string) => {
       dispatchToTodoLists(editTodoListAc(toDoListID,newTitle))
    }
    const editTask = (toDoListID: string, taskId: string, newTitle: string) => {
       dispatchToTasks(changeTaskTitleAC(taskId,newTitle,toDoListID))
    }

    return (

        <div className="App">
            <ButtonAppBar/>
            <Container fixed>
                <Grid container style={{paddingTop: '10px'}}>
                    <span>Add todoList </span>-
                    <AddItemForm callBack={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todoLists.map((el) => {

                        let tasksForRender = tasks[el.id]
                        if (el.filter === 'active') {
                            tasksForRender = tasks[el.id].filter(t => !t.isDone)
                        }
                        if (el.filter === 'completed') {
                            tasksForRender = tasks[el.id].filter(t => t.isDone)
                        }


                        return (<Grid item key={el.id}>
                                <Paper style={{padding: "10px"}}>
                                    <TodoList
                                        key={el.id}
                                        todoListID={el.id}
                                        filter={el.filter}
                                        title={el.title}
                                        tasks={tasksForRender}

                                        removeTodolist={removeTodolist}
                                        RemoveTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        editTodolist={editTodolist}
                                        editTask={editTask}
                                    />
                                </Paper>
                            </Grid>
                        )

                    })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducers;
