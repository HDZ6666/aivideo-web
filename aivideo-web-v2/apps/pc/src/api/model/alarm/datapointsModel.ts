export interface RulesForm {
  "streamPointId"?: string,
  "deviceId"?: string,
  "alarmLevel"?: number,
  "alarmTypeId"?: string,
  "alarmTypeName"?: string,
  "alarmTime"?: string,
  "assetStore"?: "LOCAL" | "HTTP ",
  "imageUrl"?: string,
  "imageOrigin"?: string,
  "videoUrl"?: string,
  "videoDuration"?: number,
  "longitude"?: number,
  "latitude"?: number,
  "description"?: string,
  "getpKey"?: string,
  "getpValue"?: number,
  "id"?: number
}

export interface RulesQuery {
  pageNum: number,
  pageSize: number,
  "streamPointId"?: string,
  "deviceId"?: string,
  "alarmLevel"?: number,
  "alarmTypeId"?: string,
  "alarmTypeName"?: string,
  "alarmTime"?: string,
  "assetStore"?: "LOCAL" | "HTTP ",
  "imageUrl"?: string,
  "imageOrigin"?: string,
  "videoUrl"?: string,
  "videoDuration"?: number,
  "longitude"?: number,
  "latitude"?: number,
  "description"?: string,
  "getpKey"?: string,
  "getpValue"?: number,
  "id"?: number
}

export interface RulesVo {
  createAt?: string;
  upDateAt?: string;
  "streamPointId"?: string,
  "deviceId"?: string,
  "alarmLevel"?: number,
  "alarmTypeId"?: string,
  "alarmTypeName"?: string,
  "alarmTime"?: string,
  "assetStore"?: "LOCAL" | "HTTP ",
  "imageUrl"?: string,
  "imageOrigin"?: string,
  "videoUrl"?: string,
  "videoDuration"?: number,
  "longitude"?: number,
  "latitude"?: number,
  "description"?: string,
  "getpKey"?: string,
  "getpValue"?: number,
  "id"?: number
}
