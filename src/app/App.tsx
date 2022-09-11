import React from 'react';
import './App.css';

import ButtonAppBar from "../components/ButtonAppBar";
import {Container} from "@mui/material";
import {TaskType} from "../api/todolists-api";
import {useAppSelector} from "../hooks/hooks";
import LinearProgress from '@mui/material/LinearProgress';
import {RequestStatusType} from "../Reducer/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {Login} from "../features/Login";
import {Route, Routes} from "react-router-dom";


export type TasksType = {
    [key: string]: Array<TaskType>
}

export const App = () => {

    const status: RequestStatusType = useAppSelector(state => state.app.status)

    return (
        <div className="App">

            <ButtonAppBar/>
            {status === 'loading' && < LinearProgress color="secondary"/>}
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList/>}/>
                    <Route path='login' element={<Login/>}/>
                </Routes>

            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

