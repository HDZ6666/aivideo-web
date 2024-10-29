export interface RulesForm {
  id: number,
  eventId: string,
  success: boolean,
  notifierType?: "SYSTEM" | "DATAV" | "WEBHOOK",
  deviceId: number,
  target: string,
  content:string,
}

export interface RulesQuery {
  pageNum: number,
  pageSize: number,
  eventId: string,
  success: boolean,
  notifierType?: "SYSTEM" | "DATAV" | "WEBHOOK",
  deviceId: number,
  target: string,
  content:string,
}

export interface RulesVo {
  createAt?: string;
  updateAt?: string;
  id?: number;
  eventId?: string;
  success?: boolean;
  notifierType?: "SYSTEM" | "DATAV" | "WEBHOOK";
  deviceId?: number,
  target?: string,
  content:string,
}
