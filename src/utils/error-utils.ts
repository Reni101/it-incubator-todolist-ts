import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolists-api'
import {ActionsAppType, setAppErrorAC, setAppStatusAC} from "../Reducer/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<ActionsAppType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<ActionsAppType>) => {
    dispatch(setAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}
