export interface ResponseData<T> {
  data: T;
  message: string | null;
}

export interface ApiResponse<T> extends ResponseData<T> {
  status: 'success' | 'error';
  timestamp?: string;
  path?: string;
}
