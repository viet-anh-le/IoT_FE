import Cookies from "js-cookie";
import { httpClient } from "@/http/http-client";
import {
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/schemas/auth.schema";

interface GeneralResponse {
  message: string;
}

interface LoginResponse {
  message: string;
  token: {
    access_token: string;
    expiry_at: string;
  };
  user: {
    username: string;
    role: string;
  };
}

export const authService = {
  register: async (payload: {
    username: string;
    gmail: string;
    password: string;
  }) => {
    const response = await httpClient.post("/api/auth/register", payload);
    return response.data;
  },

  login: async (data: LoginSchema) => {
    const response = await httpClient.post<LoginResponse>(
      "/api/auth/login",
      data
    );
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordSchema) => {
    const response = await httpClient.post<GeneralResponse>(
      "/api/auth/forgot-password",
      data
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordSchema) => {
    const payload = {
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    const response = await httpClient.post<GeneralResponse>(
      `/api/auth/reset-password/${data.token}`,
      payload
    );
    return response.data;
  },

  logout: () => {
    Cookies.remove("accessToken");
    localStorage.removeItem("user");
  },
};
