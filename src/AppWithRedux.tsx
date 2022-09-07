import React, {useCallback, useEffect} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {AddItemForm} from "./components/AddItemForm";
import ButtonAppBar from "./ButtonAppBar";
import {Container, Grid, Paper} from "@mui/material";
import {
    addTodoListTC,
    changeFilterAC, editTitleTodoListTC,
    FilterValuesType,
    removeTodoListTC, setTodoListTC, TodolistDomainType,

} from "./Reducer/todolists-reducer";
import {
    addTaskTC, removeTaskTC, updateTaskStatusTC, updateTaskTitleTC
} from "./Reducer/task-reducer";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {useAppDispatch, useAppSelector} from "./hooks/hooks";
import LinearProgress from '@mui/material/LinearProgress';
import {RequestStatusType} from "./Reducer/app-reducer";
import {ErrorSnackbar} from "./components/ErrorSnackbar";


export type TasksType = {
    [key: string]: Array<TaskType>
}

const AppWithRedux = () => {
    const todoLists: Array<TodolistDomainType> = useAppSelector(state => state.todolists)
    const task: TasksType = useAppSelector(state => state.task)
    const status: RequestStatusType = useAppSelector(state => state.app.status)
    const dispatch = useAppDispatch()


    useEffect(() => {
        dispatch(setTodoListTC())
    }, [dispatch])


    const removeTask = useCallback((todoListID: string, tasksID: string) => {

        dispatch(removeTaskTC(todoListID, tasksID))
    }, [dispatch])

    const changeFilter = useCallback((todoListID: string, filter: FilterValuesType) => {
        dispatch(changeFilterAC(todoListID, filter))
    }, [dispatch])

    const addTask = useCallback((todoListID: string, title: string) => {

        dispatch(addTaskTC(todoListID, title))
    }, [dispatch])

    const changeTaskStatus = useCallback((todoListID: string, tasksID: string, status: TaskStatuses) => {

        dispatch(updateTaskStatusTC(tasksID, todoListID, status))
    }, [dispatch])

    const removeTodolist = useCallback((todoListID: string) => {

        dispatch(removeTodoListTC(todoListID))

    }, [dispatch])
    const addTodoList = useCallback((title: string) => {

        dispatch(addTodoListTC(title))
    }, [dispatch])

    const editTodolist = useCallback((toDoListID: string, newTitle: string) => {

        dispatch(editTitleTodoListTC(toDoListID, newTitle))
    }, [dispatch])

    const editTask = useCallback((toDoListID: string, taskId: string, newTitle: string) => {
        dispatch(updateTaskTitleTC(taskId, toDoListID, newTitle))
    }, [dispatch])


    return (
        <div className="App">
            <ButtonAppBar/>
            {status === 'loading' && < LinearProgress color="secondary"/>}
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
                                        entityStatus={el.entityStatus}
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
            <ErrorSnackbar/>
        </div>
    );
}

export default AppWithRedux;
