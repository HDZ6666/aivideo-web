export interface RulesForm {
  "deviceId"?: string,
  "channelId"?: string,
  "alarmLevel"?: number,
  "alarmTypeId"?: string,
  "alarmTypeName"?: string,
  "assetStore"?: "LOCAL" | "HTTP ",
  "imageUrl"?: string,
  "imageOrigin"?: string,
  "videoUrl"?: string,
  "videoDuration"?: number,
  "longitude"?: number,
  "latitude"?: number,
  "description"?: string,
  "pkey"?: string,
  "pvalue"?: number
}

export interface RulesQuery {
  pageNum: number,
  pageSize: number,
  "deviceId"?: string,
  "channelId"?: string,
  "alarmLevel"?: number,
  "alarmTypeId"?: string,
  "alarmTypeName"?: string,
  "assetStore"?: "LOCAL" | "HTTP ",
  "imageUrl"?: string,
  "imageOrigin"?: string,
  "videoUrl"?: string,
  "videoDuration"?: number,
  "longitude"?: number,
  "latitude"?: number,
  "description"?: string,
  "pkey"?: string,
  "pvalue"?: number
}

export interface RulesVo {
  createAt?: string;
  updateAt?: string;
  "deviceId"?: string,
  "channelId"?: string,
  "alarmLevel"?: number,
  "alarmTypeId"?: string,
  "alarmTypeName"?: string,
  "assetStore"?: "LOCAL" | "HTTP ",
  "imageUrl"?: string,
  "imageOrigin"?: string,
  "videoUrl"?: string,
  "videoDuration"?: number,
  "longitude"?: number,
  "latitude"?: number,
  "description"?: string,
  "pkey"?: string,
  "pvalue"?: number
}
