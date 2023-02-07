import {AppDispatch} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {authAPI, LoginParamsType} from "../api/todolists-api";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTodosDataAC} from "./todolists-reducer";

const slice = createSlice({
    name: "authReducer",
    initialState: {isLoggedIn: false},
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


//===============================TC===================================

export const loginTC = (data: LoginParamsType) => async (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        handleServerNetworkError(err, dispatch)
    }
}
export const logoutTC = () => async (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(clearTodosDataAC())
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const err = e as Error | AxiosError
        handleServerNetworkError(err, dispatch)
    }
}
