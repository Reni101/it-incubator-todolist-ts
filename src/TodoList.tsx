import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValuesType, TaskType} from "./App"
import {AddItemForm} from "./components/AddItemForm";
import {EditableSpan} from "./components/EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";


type TodoListPropsType = {
    todoListID: string
    title: string
    tasks: Array<TaskType> //Tasktype []
    filter: FilterValuesType
    RemoveTask: (todoListID: string, taskID: string) => void
    changeFilter: (todoListID: string, filter: FilterValuesType) => void
    addTask: (todoListID: string, title: string) => void
    changeTaskStatus: (todoListID: string, tasksID: string, isDone: boolean) => void
    removeTodolist: (todoListID: string) => void
    editTodolist: (toDoListID: string, newTitle: string) => void
    editTask: (toDoListID: string, taskId: string, newTitle: string) => void

}

const TodoList = (props: TodoListPropsType) => {

    const tasksMap = props.tasks.length
        ? props.tasks.map((t) => {
            const editTasktHandler = (newTitle: string) => {
                props.editTask(props.todoListID, t.id, newTitle)
            }
            const removeTask = () => props.RemoveTask(props.todoListID, t.id)
            const ChangeTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
                props.changeTaskStatus(props.todoListID, t.id, e.currentTarget.checked)
            }

            return (<div key={t.id}>
                <Checkbox defaultChecked
                          checked={t.isDone}
                          onChange={ChangeTaskHandler}

                />


                <EditableSpan isDone={t.isDone} title={t.title} callBack={editTasktHandler}/>

                <IconButton aria-label="delete">
                    <Delete onClick={removeTask}/>
                </IconButton>

            </div>)
        })
        : <span>empty</span>


    const addTaskHandler = (title: string) => {
        props.addTask(props.todoListID, title)
    }

    const onClickRemoveTodoListHandler = () => {
        props.removeTodolist(props.todoListID)

    }
    const editTodolistHandler = (newTitle: string) => {
        props.editTodolist(props.todoListID, newTitle)
    }


    const buttonClassALL = props.filter === "all" ? "outlined" : "contained"
    const buttonClassActive = props.filter === "active" ? "outlined" : "contained"
    const buttonClassCompleted = props.filter === "completed" ? "outlined" : "contained"
    return (
        <div>
            <h3>

                <EditableSpan title={props.title} callBack={editTodolistHandler}/>
                <IconButton aria-label="delete">
                    <Delete onClick={onClickRemoveTodoListHandler}/>
                </IconButton>

            </h3>
            <AddItemForm callBack={addTaskHandler}/>
            <div>
                {tasksMap}
            </div>

            <div>
                <Button variant={buttonClassALL}
                        onClick={() => props.changeFilter(props.todoListID, "all")}>All</Button>
                <Button variant={buttonClassActive}
                        onClick={() => props.changeFilter(props.todoListID, "active")}>Active</Button>
                <Button variant={buttonClassCompleted}
                        onClick={() => props.changeFilter(props.todoListID, "completed")}>Completed</Button>
            </div>
        </div>
    );
};

export default TodoList;
