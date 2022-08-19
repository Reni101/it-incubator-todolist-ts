import React, {useEffect, useState} from 'react'
import axios from "axios";
import {daDK} from "@mui/material/locale";

export default {
    title: 'API'
}

const setting = {
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': "fab19197-098e-4362-876a-0c0797e21ac6"
    }
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.get('todo-lists', setting)
            .then(res => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const title = "New todoList homework"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.post('todo-lists', {title}, setting)
            .then(res => setState(res.data.data.item))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const todolistID = "a47938cc-1c9d-469b-b0d4-ece57e2c253c"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.delete(`todo-lists/${todolistID}`, setting)
            .then(res => setState(res.data.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const title = "Hello Server"
    const todolistID = "1c89a8f9-4c6a-4558-b6fd-0b8cb749abda"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.put(`todo-lists/${todolistID}`, {title}, setting)
            .then(res => setState(res.data.data))

    }, [])

    return <div>{JSON.stringify(state)}</div>
}