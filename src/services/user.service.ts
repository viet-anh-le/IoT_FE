import { httpClient } from "@/http/http-client";
import { UserResponse, User } from "@/types/user.type";

export interface CreateUserPayload {
  username: string;
  gmail: string;
  password: string;
}

export interface UpdateUserPayload {
  username: string;
}

export const userService = {
  getAllUsers: async (
    limit: number = 10,
    offset: number = 0,
    search: string = ""
  ) => {
    const response = await httpClient.get<UserResponse>("/api/users", {
      params: { limit, offset, search },
    });
    return response.data;
  },

  createUser: async (data: CreateUserPayload) => {
    const response = await httpClient.post<User>("/api/users", data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserPayload) => {
    await httpClient.put(`/api/users/${id}`, data);
  },

  deleteUser: async (id: string) => {
    await httpClient.delete(`/api/users/${id}`);
  },
};
