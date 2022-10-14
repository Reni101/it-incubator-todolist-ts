import {AppThunk} from "./store";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "./authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false as boolean
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
        case "APP/SET-Initialized":
            return {...state, isInitialized: action.value}

        default:
            return state
    }
}
//=============================AC======================================
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'APP/SET-STATUS',
    status
} as const)


export const setAppErrorAC = (error: string | null) => ({
    type: 'APP/SET-ERROR',
    error
} as const)
export const setIsInitializedAC = (value: boolean) => ({
    type: 'APP/SET-Initialized',
    value
} as const)
//==============================TC============================

export const initializeAppTC = (): AppThunk => async dispatch => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
            /*handleServerAppError(res.data, dispatch)*/
            dispatch(setIsLoggedInAC(false))
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            handleServerNetworkError(err, dispatch)
        } else {
            console.error(err)
        }
    } finally {
        dispatch(setIsInitializedAC(true))
    }


}
//

export type AppActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setIsInitializedAC>