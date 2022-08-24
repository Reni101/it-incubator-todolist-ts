import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolists-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists()
            .then(res=>setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const title = "New todoList homework"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.createTodolist(title)
            .then(res => setState(res.data.data.item))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const todolistID = "3a9bb45c-ff18-4246-bd73-3fa78c866a7a"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.deleteTodolist(todolistID)
            .then(res => setState(res.data.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const title = "Hello Server"
    const todolistID = "1c89a8f9-4c6a-4558-b6fd-0b8cb749abda"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.updateTodolistTitle(todolistID, title)
            .then(res => setState(res.data.data))

    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const todolistID = "1c89a8f9-4c6a-4558-b6fd-0b8cb749abda"
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTasks()
            .then(res=>setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}