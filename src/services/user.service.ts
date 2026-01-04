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

// --- MOCK DATA GENERATOR ---
const generateMockUsers = (count: number): User[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `user-${i + 1}`,
    username: i === 0 ? "admin_vip" : `user_test_${i + 1}`,
    gmail: i === 0 ? "admin@iot.com" : `user${i + 1}@example.com`,
    role: i === 0 ? "admin" : "user",
    is_active: i % 5 !== 0,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

const MOCK_DB = generateMockUsers(25);

export const userService = {
  getAllUsers: async (
    limit: number = 10,
    offset: number = 0,
    search: string = ""
  ) => {
    // --- MOCK MODE ---
    return new Promise<UserResponse>((resolve) => {
      setTimeout(() => {
        let filtered = MOCK_DB;
        if (search) {
          const lowerSearch = search.toLowerCase();
          filtered = MOCK_DB.filter(
            (u) =>
              u.username.toLowerCase().includes(lowerSearch) ||
              u.gmail.toLowerCase().includes(lowerSearch)
          );
        }

        const paginatedData = filtered.slice(offset, offset + limit);

        resolve({
          message: "Users retrieved successfully",
          data: paginatedData,
          pagination: {
            total: filtered.length,
            limit: limit,
            offset: offset,
            hasMore: offset + limit < filtered.length,
          },
        });
      }, 500);
    });

    // --- REAL MODE ---
    /*
    const response = await httpClient.get<UserResponse>("/api/users", {
      params: { limit, offset, search }
    });
    return response.data;
    */
  },

  createUser: async (data: CreateUserPayload) => {
    // --- MOCK MODE: Giả lập tạo mới và thêm vào MOCK_DB ---
    return new Promise<User>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `new-user-${Date.now()}`, // Fake ID
          username: data.username,
          gmail: data.gmail,
          role: "user", // Mặc định là user thường
          is_active: true, // Mặc định kích hoạt
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // password không trả về trong object User để bảo mật
        };

        if (typeof MOCK_DB !== "undefined" && Array.isArray(MOCK_DB)) {
          MOCK_DB.unshift(newUser);
        }

        console.log("Mock Create User:", data);
        resolve(newUser);
      }, 800);
    });

    // --- REAL MODE: Gọi API thực ---
    /*
    const response = await httpClient.post<User>("/api/users", data);
    return response.data;
    */
  },

  updateUser: async (id: string, data: UpdateUserPayload) => {
    // --- MOCK MODE ---
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Tìm và sửa trong Mock DB
        if (typeof MOCK_DB !== "undefined" && Array.isArray(MOCK_DB)) {
          const userIndex = MOCK_DB.findIndex((u) => u.id === id);
          if (userIndex !== -1) {
            MOCK_DB[userIndex] = {
              ...MOCK_DB[userIndex],
              username: data.username,
              updated_at: new Date().toISOString(),
            };
          }
        }
        console.log(`Updated User ${id}:`, data);
        resolve();
      }, 500);
    });

    // --- REAL MODE ---
    // await httpClient.put(`/api/users/${id}`, data);
  },

  // Placeholder cho các hành động khác
  deleteUser: async (id: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (typeof MOCK_DB !== "undefined" && Array.isArray(MOCK_DB)) {
          const index = MOCK_DB.findIndex((u) => u.id === id);
          if (index !== -1) {
            MOCK_DB.splice(index, 1);
          }
        }
        console.log(`Deleted User ID: ${id}`);
        resolve();
      }, 500);
    });
    // await httpClient.delete(`/api/users/${id}`);
  },
};
