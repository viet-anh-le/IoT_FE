export interface User {
  id: string;
  username: string;
  gmail: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface UserResponse {
  message: string;
  data: User[];
  pagination: Pagination;
}
