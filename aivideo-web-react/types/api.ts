export interface Result<T = any> {
  status: number;
  message: string;
  data?: T;
}

export interface VideoResult<T = any> {
  code: number;
  msg: string;
  data?: T;
}
