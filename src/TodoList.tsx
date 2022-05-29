import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValuesType, TaskType} from "./App"


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

}

const TodoList = (props: TodoListPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)



    const tasksMap = props.tasks.length
        ? props.tasks.map((t) => {
            const removeTask = () => props.RemoveTask(props.todoListID,t.id)
            const ChangeTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
                props.changeTaskStatus(props.todoListID,t.id, e.currentTarget.checked)
            }
            const taskClasses = t.isDone ? "is-done" : "";
            return (<li key={t.id}>
                <input type="checkbox"
                       checked={t.isDone}
                       onChange={ChangeTaskHandler}/>
                <span className={taskClasses}>{t.title}</span>
                <button onClick={removeTask}>x</button>

            </li>)
        })
        : <span>empty</span>


    const addTasksHandler = () => {
        let taskTitle: string = title.trim();
        if (taskTitle) {
            props.addTask(props.todoListID, taskTitle)
        } else {
            setError(true)
        }

        setTitle("")
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        if (error && e.currentTarget.value.trim()) {
            setError(false)
        }

    }
    const pressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && addTasksHandler() // &&- И при нажати и тру и она запускаеть функцию
    }
    const onClickRemoveTodoListHandler = () => {
        props.removeTodolist(props.todoListID)

    }

    const buttonClassALL = props.filter === 'all' ? "active-filter" : ""
    const buttonClassActive = props.filter === 'active' ? "active-filter" : ""
    const buttonClassCompleted = props.filter === 'completed' ? "active-filter" : ""
    const errorInputStyle = error ? {border: "2px solid red", outline: "none"} : undefined
    return (
        <div>
            <h3>{props.title} <button onClick={onClickRemoveTodoListHandler}>x</button> </h3>
            <div>
                <input
                    style={errorInputStyle}
                    value={title}
                    onChange={onChangeHandler}
                    onKeyDown={pressEnter} //e.key === "Enter" && addTasksHandler()  (e)=>{if(e.key === 'Enter')addTasksHandler()}
                />

                <button onClick={addTasksHandler}>+</button>
                {error && <div style={{color: "red"}}>Title is required!</div>}
            </div>

            <ol>
                {tasksMap}
            </ol>

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
