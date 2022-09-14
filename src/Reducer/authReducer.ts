import {AppThunk} from "./store";
import {setAppStatusAC} from "./app-reducer";
import {authAPI, LoginParamsType} from "../api/todolists-api";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState
export type AuthActionsType =
    | ReturnType<typeof setIsLoggedInAC>


export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
//=======================================AC=====================================
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)
//===============================TC===================================

export const loginTC = (data: LoginParamsType): AppThunk => async dispatch => {

    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(err, dispatch)
        } else {
            console.error(err)
        }
    }
}

export const logoutTC = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(err, dispatch)
        } else {
            console.error(err)
        }
    }

}
