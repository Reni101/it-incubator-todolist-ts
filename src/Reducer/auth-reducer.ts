import {AppDispatch} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {authAPI, LoginParamsType} from "../api/todolists-api";
import axios, {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {clearTodosDataAC} from "./todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}


const slice = createSlice({
    name: "authReducer",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


//===============================TC===================================

export const loginTC = (data: LoginParamsType) => async (dispatch:AppDispatch) => {
    dispatch(setAppStatusAC({status:"loading"}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status:"succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            const error = err.response?.data
                ? (err.response.data as { error: string }).error : err.message
            handleServerNetworkError(error, dispatch)
        }
    }
}
export const logoutTC = () => async  (dispatch:AppDispatch) => {
    dispatch(setAppStatusAC({status:"loading"}))
    try {

        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status:"succeeded"}))
            dispatch(clearTodosDataAC())
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            const error = err.response?.data
                ? (err.response.data as { error: string }).error : err.message
            handleServerNetworkError(error, dispatch)
        }
    }

}


// export type AuthActionsType =
//     | ReturnType<typeof setIsLoggedInAC>