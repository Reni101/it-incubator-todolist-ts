import {Dispatch} from 'redux'
import {ResponseType} from '../api/todolists-api'
import {setAppErrorAC, setAppStatusAC} from "../Reducer/app-reducer";
import axios, {AxiosError} from "axios";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))


}

export const handleServerNetworkError = (err: Error | AxiosError, dispatch: Dispatch) => {
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? (err.response.data as { error: string }).error : err.message
        dispatch(setAppErrorAC({error}))

    } else {
        dispatch(setAppErrorAC({error: `Native error ${err.message}`}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

