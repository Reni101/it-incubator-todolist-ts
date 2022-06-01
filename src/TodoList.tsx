import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValuesType, TaskType} from "./App"
import {AddItemForm} from "./components/AddItemForm";
import {EditableSpan} from "./components/EditableSpan";


type TodoListPropsType = {
    todoListID:string
    title: string
    tasks: Array<TaskType> //Tasktype []
    filter: FilterValuesType
    RemoveTask: (todoListID: string,taskID: string) => void
    changeFilter: (todoListID: string,filter: FilterValuesType) => void
    addTask: (todoListID: string,title: string) => void
    changeTaskStatus: (todoListID: string,tasksID: string, isDone: boolean) => void
    removeTodolist:(todoListID: string)=>void
    editTodolist:(toDoListID: string, newTitle: string) => void
    editTask:(toDoListID: string,taskId:string, newTitle: string)=>void

}

const TodoList = (props: TodoListPropsType) => {

    const tasksMap = props.tasks.length
        ? props.tasks.map((t) => {
            const editTasktHandler=(newTitle:string)=> {
                props.editTask(props.todoListID,t.id,newTitle)
            }
            const removeTask = () => props.RemoveTask(props.todoListID,t.id)
            const ChangeTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
                props.changeTaskStatus(props.todoListID,t.id, e.currentTarget.checked)
            }

            return (<li key={t.id}>
                <input type="checkbox"
                       checked={t.isDone}
                       onChange={ChangeTaskHandler}/>
                <EditableSpan isDone={t.isDone} title={t.title} callBack={editTasktHandler}/>

                <button onClick={removeTask}>x</button>

            </li>)
        })
        : <span>empty</span>


    const addTaskHandler =(title:string)=>{
        props.addTask(props.todoListID,title)
    }

    const onClickRemoveTodoListHandler = () => {
        props.removeTodolist(props.todoListID)

    }
    const editTodolistHandler=(newTitle:string)=> {
        props.editTodolist(props.todoListID,newTitle)
    }



    const buttonClassALL = props.filter === 'all' ? "active-filter" : ""
    const buttonClassActive = props.filter === 'active' ? "active-filter" : ""
    const buttonClassCompleted = props.filter === 'completed' ? "active-filter" : ""
    return (
        <div>
            <h3>

                <EditableSpan title={props.title} callBack={editTodolistHandler}/>
                <button onClick={onClickRemoveTodoListHandler}>x</button>
            </h3>
            <AddItemForm  callBack={addTaskHandler}/>
            <ul>
                {tasksMap}
            </ul>

            <div>
                <button
                    className={buttonClassALL}
                    onClick={() => props.changeFilter(props.todoListID,"all")}>All
                </button>
                <button
                    className={buttonClassActive}
                    onClick={() => props.changeFilter(props.todoListID,"active")}>Active
                </button>
                <button
                    className={buttonClassCompleted}
                    onClick={() => props.changeFilter(props.todoListID,"completed")}>Completed
                </button>

            </div>
        </div>
    );
};

export default TodoList;
