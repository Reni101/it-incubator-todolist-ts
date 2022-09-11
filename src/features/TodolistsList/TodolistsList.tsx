import React, {useCallback, useEffect} from 'react';
import {Grid, Paper} from "@mui/material";
import {TodoList} from "./Todolist/TodoList";
import {
    addTodoListTC,
    changeFilterAC, editTitleTodoListTC,
    FilterValuesType,
    removeTodoListTC,
    setTodoListTC,
    TodolistDomainType
} from "../../Reducer/todolists-reducer";
import {AddItemForm} from "../../components/AddItemForm";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {TasksType} from "../../app/App";
import {addTaskTC, removeTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "../../Reducer/task-reducer";
import {TaskStatuses} from "../../api/todolists-api";


export const TodolistsList = ()  => {
    const todoLists: Array<TodolistDomainType> = useAppSelector(state => state.todolists)
    const task: TasksType = useAppSelector(state => state.task)

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


    return <>
        <Grid container style={{paddingTop: '10px'}}>
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

    </>
};

