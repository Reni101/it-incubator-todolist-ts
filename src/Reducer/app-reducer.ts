import {AppDispatch} from "./store";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    isInitialized: false as boolean
}


export const _initializeAppTC = createAsyncThunk("app/initialize", async (_, thunkAPI) => {
    //
    // return res.data

    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            return
        } else {
            return handleServerAppError(res.data, thunkAPI.dispatch)
            thunkAPI.dispatch(setIsLoggedInAC({value: false}))
        }

    } catch (e) {

    } finally {

    }
})

const slice = createSlice({
    name: "appReducer",
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setIsInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isInitialized = action.payload.value
        },
    },
    // extraReducers: builder => {
    //     builder.addCase(initializeAppTC.fulfilled, (state, action) => {
    //         state.isInitialized = true
    //     })
    // }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions

//==============================TC async await============================

export const initializeAppTC = () => async (dispatch: AppDispatch) => {

    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setIsLoggedInAC({value: false}))
        }
    } catch (e) {
        const err = e as Error | AxiosError
        if (axios.isAxiosError(err)) {
            const error = err.response?.data
                ? (err.response.data as { error: string }).error : err.message
            handleServerNetworkError(error, dispatch)
        }
    } finally {
        dispatch(setIsInitializedAC({value: true}))
    }


}
