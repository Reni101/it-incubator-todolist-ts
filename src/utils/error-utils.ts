import { Dispatch } from "redux";
import { ResponseType } from "../api/todolists-api";
import { appActions } from "../Reducer/app-reducer";
import axios, { AxiosError } from "axios";

// generic function
export const handleServerAppError = <T>(
  data: ResponseType<T>,
  dispatch: Dispatch
) => {
  if (data.messages.length) {
    dispatch(appActions.setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppErrorAC({ error: "Some error occurred" }));
  }
  dispatch(appActions.setAppStatusAC({ status: "failed" }));
};

export const handleServerNetworkError = (
  err: Error | AxiosError,
  dispatch: Dispatch
) => {
  if (axios.isAxiosError(err)) {
    const error = err.response?.data
      ? (err.response.data as { error: string }).error
      : err.message;
    dispatch(appActions.setAppErrorAC({ error }));
  } else {
    dispatch(
      appActions.setAppErrorAC({ error: `Native error ${err.message}` })
    );
  }
  dispatch(appActions.setAppStatusAC({ status: "failed" }));
};
