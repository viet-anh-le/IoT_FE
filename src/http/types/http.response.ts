export interface IHttpResponseDto<T> {
  success: number;
  message: string;
  data: T;
}

export interface IHttpErrorResponseDto {
  success: boolean;
  message: string;
}

export interface DeleteByIdDTO {
  id: string;
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export interface SearchParams {
  type?: string;
  page?: number;
  limit?: number;
  search?: string;
  sort?: string[];
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
