import { instance } from "./baseURL";
import { AxiosResponse } from "axios";
import { ResponseType } from "./todolists-api";

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<
      LoginParamsType,
      AxiosResponse<ResponseType<{ userId: number }>>
    >("/auth/login", data);
  },
  logout() {
    return instance.delete<ResponseType>("/auth/login");
  },

  me() {
    return instance.get<
      ResponseType<{ id: string; email: string; login: string }>
    >("/auth/me");
  },
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
