import React, {useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";

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

const App = () => {

    let todolistID1 = v1();
    let todolistID2 = v1();

    let [toDolists, setToDolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn Front', filter: 'all'},
        {id: todolistID2, title: 'What to learn Back', filter: 'all'},
    ])

    let [tasks, setTasks] = useState<TasksType>({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "JS ", isDone: true},
            {id: v1(), title: "NodeJS ", isDone: true},
            {id: v1(), title: "C#", isDone: false},
            {id: v1(), title: "Mongodb", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ]
    });

    const removeTask = (todoListID: string,tasksID: string) => {
        setTasks({...tasks,[todoListID]:tasks[todoListID].filter(el=>el.id !==tasksID )})

        //  setTasks(tasks.filter((t) => t.id !== tasksID));
    }
    const changeFilter = (todoListID: string, filter: FilterValuesType) => {
        setToDolists(toDolists.map(el => el.id === todoListID ? {...el, filter} : el))
    }

    const addTask = (todoListID: string, title: string) => {
        const newTask: TaskType = {
            id: v1(), title: title, isDone: false,
        }

        setTasks({...tasks, [todoListID]: [...tasks[todoListID], newTask]})

    }

    const changeTaskStatus = (todoListID: string, tasksID: string, isDone: boolean) => {
        setTasks({...tasks,[todoListID]:tasks[todoListID].map(el=>el.id === tasksID ? {...el,isDone} : el)})

    }

    const removeTodolist = (todoListID: string) => {
        setToDolists(toDolists.filter(el=>el.id !== todoListID ))

    }


    return (

        <div className="App">
            {toDolists.map((el) => {

                let tasksForRender = tasks[el.id]
                if (el.filter === 'active') {
                    tasksForRender = tasks[el.id].filter(t => !t.isDone)
                }
                if (el.filter === 'completed') {
                    tasksForRender = tasks[el.id].filter(t => t.isDone)
                }


                return (
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
                    />
                )

            })
            }


        </div>
    );
}

export default App;
