import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
import {FilterValuesType, TaskType} from "./App"


type TodoListPropsType = {
    title: string
    tasks: Array<TaskType> //Tasktype []
    filter: FilterValuesType
    RemoveTask: (taskID: string) => void
    changeFilter: (filter: FilterValuesType) => void
    addTask: (title: string) => void
    changeTaskStatus: (tasksID: string, isDone: boolean) => void

}

const TodoList = (props: TodoListPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    let tasksForRender = props.tasks
    if (props.filter === 'active') {
        tasksForRender = props.tasks.filter(t => !t.isDone)
    }
    if (props.filter === 'completed') {
        tasksForRender = props.tasks.filter(t => t.isDone)
    }

    const tasksMap = tasksForRender.length
        ? tasksForRender.map((t) => {
            const removeTask = () => props.RemoveTask(t.id)
            const ChangeTaskHandler = (e: ChangeEvent<HTMLInputElement>) => {
                props.changeTaskStatus(t.id, e.currentTarget.checked)
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
            props.addTask(taskTitle)
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

    const buttonClassALL = props.filter === 'all' ? "active-filter" : ""
    const buttonClassActive = props.filter === 'active' ? "active-filter" : ""
    const buttonClassCompleted = props.filter === 'completed' ? "active-filter" : ""
    const errorInputStyle = error? {border:"2px solid red", outline:"none"} : undefined
    return (
        <div>
            <h3>{props.title}</h3>
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
                    onClick={() => props.changeFilter("all")}>All
                </button>
                <button
                    className={buttonClassActive}
                    onClick={() => props.changeFilter("active")}>Active
                </button>
                <button
                    className={buttonClassCompleted}
                    onClick={() => props.changeFilter("completed")}>Completed
                </button>
            </div>
        </div>
    );
};

export default TodoList;
