import React, {useCallback, useEffect} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {AddItemForm} from "./components/AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodoListAC, addTodoListTC,
    changeFilterAC,
    editTodoListAc, FilterValuesType,
    removeTodolistAC, removeTodoListTC, setTodoListTC, TodolistDomainType,

} from "./Reducer/todolists-reducer";
import {
    addTaskAC,
    addTaskTC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    removeTaskTC, updateTaskStatusTC, updateTaskTitleTC
} from "./Reducer/task-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./Reducer/store";
import {TaskStatuses, TaskType} from "./api/todolists-api";


export type TasksType = {
    [key: string]: Array<TaskType>
}

const AppWithRedux = () => {


    const todoLists: Array<TodolistDomainType> = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const task: TasksType = useSelector<AppRootStateType, TasksType>(state => state.task)
    const dispatch = useDispatch()


    const removeTask = useCallback((todoListID: string, tasksID: string) => {

        // @ts-ignore
        dispatch(removeTaskTC(todoListID, tasksID))
    }, [dispatch])

    const changeFilter = useCallback((todoListID: string, filter: FilterValuesType) => {
        dispatch(changeFilterAC(todoListID, filter))
    }, [dispatch])

    const addTask = useCallback((todoListID: string, title: string) => {
        // @ts-ignore
        dispatch(addTaskTC(todoListID, title))
    }, [dispatch])

    const changeTaskStatus = useCallback((todoListID: string, tasksID: string, status: TaskStatuses) => {
        // @ts-ignore
        dispatch(updateTaskStatusTC(tasksID, todoListID, status))
    }, [dispatch])

    const removeTodolist = useCallback((todoListID: string) => {
        // @ts-ignore
        dispatch(removeTodoListTC(todoListID))

    }, [dispatch])
    const addTodoList = useCallback((title: string) => {
        // @ts-ignore
        dispatch(addTodoListTC(title))
    }, [dispatch])

    const editTodolist = useCallback((toDoListID: string, newTitle: string) => {
        dispatch(editTodoListAc(toDoListID, newTitle))
    }, [dispatch])

    const editTask = useCallback((toDoListID: string, taskId: string, newTitle: string) => {
        // @ts-ignore
        dispatch(updateTaskTitleTC(taskId, toDoListID, newTitle))
    }, [dispatch])

    useEffect(() => {

        // @ts-ignore
        dispatch(setTodoListTC())

    }, [])

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
                        let tasksForRender = task[el.id]

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

export default AppWithRedux;
