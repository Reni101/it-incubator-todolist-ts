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
    const todolistID = "acf6f671-3706-40e5-b09e-243de556bdea"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        axios.delete(`todo-lists/${todolistID}`, setting)
            .then(res => setState(res.data.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const title = ""
    const todolistID = "fd5cf896-ad57-47bc-9c6d-1eebd674d311"
    const [state, setState] = useState<any>(null)
    useEffect(() => {

    }, [])

    return <div>{JSON.stringify(state)}</div>
}