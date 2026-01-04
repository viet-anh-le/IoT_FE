import type { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";

import axiosBuilder from "./axios-builder";
import type { IHttpResponseDto } from "./types/http.response";

const apiUrl = import.meta.env.VITE_API_URL;

axiosBuilder
  .setBaseUrl(apiUrl)
  .addInterceptor(async (config: any) => {
    const token = Cookies.get("accessToken");
    config.params = {
      ...config.params,
    };
    if (token && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  })
  .setResponseInterceptor(
    async (response: AxiosResponse<IHttpResponseDto<unknown>, unknown>) => {
      return response;
    }
  )
  .setErrorInterceptor(async (error: AxiosError) => {
    if (error.response?.status === 401) {
    }
    throw error.response?.data || error;
  })
  .build();

export const httpClient = axiosBuilder;
