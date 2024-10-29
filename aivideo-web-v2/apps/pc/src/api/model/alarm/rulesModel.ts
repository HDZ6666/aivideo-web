export interface RulesForm {
  id: number,
  eventTypeId: string,
  enabled: boolean,
  notifierType?: "SYSTEM" | "DATAV" | "WEBHOOK",
  notifyWindowSeconds: number,
  notifyStartLevel: number,
}

export interface RulesQuery {
  pageNum: number,
  pageSize: number,
  eventTypeId: string,
  enabled: boolean,
  notifierType?: "SYSTEM" | "DATAV" | "WEBHOOK",
  notifyWindowSeconds: number,
  notifyStartLevel: number,
}

export interface RulesVo {
  createAt?: string;
  updateAt?: string;
  id?: number;
  eventTypeId?: string;
  enabled?: boolean;
  notifierType?: "SYSTEM" | "DATAV" | "WEBHOOK";
  notifyWindowSeconds?: number;
  notifyStartLevel?: number;
}
