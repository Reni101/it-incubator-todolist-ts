import React, {useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}
export type FilterValuesType = 'all' | 'active' | 'completed'

const App = () => {
    const todoListTitle_1 = "What to learn"
    // const todoListTitle_2 = "What to buy"
    // const todoListTitle_3 = "What to read"

    const [tasks, setTasks] = useState<Array<TaskType>>([
            {id: v1(), title: "HTML/CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Redux", isDone: false},
        ]
    )


    const [filter, setfilter] = useState<FilterValuesType>('all')

    const removeTask = (tasksID: string) => {
        setTasks(tasks.filter((t) => t.id !== tasksID));
    }
    const changeFilter = (filter: FilterValuesType) => {
        setfilter(filter)
    }
    const addTask = (title: string) => {
        const newTask: TaskType = {
            id: v1(), title: title, isDone: false,
        }
        setTasks([newTask, ...tasks])
        // const copyState =[newTask, ...tasks]
    }
    const changeTaskStatus = (tasksID: string, isDone: boolean) => {
        setTasks(tasks.map(t => t.id === tasksID ? {...t, isDone} : t))//isDone:isDone
        /* const updatedTastks = tasks.map(t=> {
             if(t.id === tasksID) {
                 return {...t, isDone: !t.isDone}
             } else  {
                 return t
             }
         })
         setTasks(updatedTastks)*/


    }

    return (
        <div className="App">

            <TodoList
                filter={filter}
                title={todoListTitle_1}
                tasks={tasks}


                RemoveTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
            />


        </div>
    );
}

export default App;
