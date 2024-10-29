export interface RulesForm {
  id?: number,
  name?: string,
  enabled?: boolean,
  description?: number,
  windowSeconds?: number,
}

export interface RulesQuery {
  pageNum: number,
  pageSize: number,
  name?: string,
  enabled?: boolean,
  description?: number,
  windowSeconds?: number,
}

export interface RulesVo {
  createAt?: string;
  updateAt?: string;
  id?: number,
  name?: string,
  enabled?: boolean,
  description?: number,
  windowSeconds?: number,
}
