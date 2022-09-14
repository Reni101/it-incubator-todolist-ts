import {AppThunk} from "./store";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "./authReducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case "APP/SET-ERROR":
            return {...state, error: action.error}
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
//==============================TC============================

export const initializeAppTC = (): AppThunk => async dispatch => {
    const res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
    } else {
    }
}


export type AppActionsType =
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>