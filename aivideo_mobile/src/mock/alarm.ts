/**
 * 模拟数据工具
 * 为告警管理模块提供模拟数据，基于 API 返回格式
 */

import type { IAlarmCategoryItem, IAlarmCategoryRes, IAlarmDetailChannel, IAlarmDetailRes, IAlarmListItem, IAlarmListReq, IAlarmListRes } from '@/api/alarm'
import { AlarmStatus } from '@/api/alarm'

// ==================== 模拟告警数据 ====================

/**
 * 模拟告警列表数据
 */
const mockAlarmData: IAlarmListItem[] = [
  {
    id: 1001,
    deviceName: '1-4F-办公区-2JK02',
    modelname: '人员入侵检测',
    alarmTypeId: 1,
    status: AlarmStatus.UNPROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1001',
    createTime: '2025-08-22 14:30:15',
    alarmTime: '2025-08-22 14:30:15',
  },
  {
    id: 1002,
    deviceName: '2-3F-南货梯正门-1JK07',
    modelname: '区域入侵检测',
    alarmTypeId: 2,
    status: AlarmStatus.PROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1002',
    createTime: '2025-08-22 13:45:22',
    alarmTime: '2025-08-22 13:45:22',
  },
  {
    id: 1003,
    deviceName: '3-1F-饭堂内1-1JK11',
    modelname: '人员聚集检测',
    alarmTypeId: 3,
    status: AlarmStatus.FALSE_ALARM,
    alarmImg: 'https://picsum.photos/800/600?random=1003',
    createTime: '2025-08-22 12:20:08',
    alarmTime: '2025-08-22 12:20:08',
  },
  {
    id: 1004,
    deviceName: '1-7F-货梯前厅-1JK03',
    modelname: '物品遗留检测',
    alarmTypeId: 4,
    status: AlarmStatus.UNPROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1004',
    createTime: '2025-08-22 11:15:33',
    alarmTime: '2025-08-22 11:15:33',
  },
  {
    id: 1005,
    deviceName: '2-4F-1JK05',
    modelname: '烟火检测',
    alarmTypeId: 5,
    status: AlarmStatus.PROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1005',
    createTime: '2025-08-22 10:30:45',
    alarmTime: '2025-08-22 10:30:45',
  },
  {
    id: 1006,
    deviceName: '1-1F-机房门口通道-2JK05',
    modelname: '人员入侵检测',
    alarmTypeId: 1,
    status: AlarmStatus.UNPROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1006',
    createTime: '2025-08-22 09:45:12',
    alarmTime: '2025-08-22 09:45:12',
  },
  {
    id: 1007,
    deviceName: '1-4F-D2会议室门口-1JK03',
    modelname: '区域入侵检测',
    alarmTypeId: 2,
    status: AlarmStatus.FALSE_ALARM,
    alarmImg: 'https://picsum.photos/800/600?random=1007',
    createTime: '2025-08-22 08:20:55',
    alarmTime: '2025-08-22 08:20:55',
  },
  {
    id: 1008,
    deviceName: '3-1F-饭堂西侧门-1JK05',
    modelname: '人员聚集检测',
    alarmTypeId: 3,
    status: AlarmStatus.PROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1008',
    createTime: '2025-08-21 16:30:18',
    alarmTime: '2025-08-21 16:30:18',
  },
  {
    id: 1009,
    deviceName: '2-1F-车间南楼梯间-1JK09',
    modelname: '物品遗留检测',
    alarmTypeId: 4,
    status: AlarmStatus.UNPROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1009',
    createTime: '2025-08-21 15:45:27',
    alarmTime: '2025-08-21 15:45:27',
  },
  {
    id: 1010,
    deviceName: '2-4F-北货梯内-1JK01',
    modelname: '烟火检测',
    alarmTypeId: 5,
    status: AlarmStatus.FALSE_ALARM,
    alarmImg: 'https://picsum.photos/800/600?random=1010',
    createTime: '2025-08-21 14:20:41',
    alarmTime: '2025-08-21 14:20:41',
  },
  {
    id: 1011,
    deviceName: '3-7F-1JK01',
    modelname: '人员入侵检测',
    alarmTypeId: 1,
    status: AlarmStatus.PROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1011',
    createTime: '2025-08-21 13:15:33',
    alarmTime: '2025-08-21 13:15:33',
  },
  {
    id: 1012,
    deviceName: '2-3F-南货梯月台-1JK08',
    modelname: '区域入侵检测',
    alarmTypeId: 2,
    status: AlarmStatus.UNPROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1012',
    createTime: '2025-08-21 12:30:15',
    alarmTime: '2025-08-21 12:30:15',
  },
  {
    id: 1013,
    deviceName: '2-2F-客梯前-1JK05',
    modelname: '人员聚集检测',
    alarmTypeId: 3,
    status: AlarmStatus.FALSE_ALARM,
    alarmImg: 'https://picsum.photos/800/600?random=1013',
    createTime: '2025-08-21 11:45:22',
    alarmTime: '2025-08-21 11:45:22',
  },
  {
    id: 1014,
    deviceName: '1-1F-客梯前厅-1JK03',
    modelname: '物品遗留检测',
    alarmTypeId: 4,
    status: AlarmStatus.PROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1014',
    createTime: '2025-08-21 10:20:08',
    alarmTime: '2025-08-21 10:20:08',
  },
  {
    id: 1015,
    deviceName: '2-3F-客梯前-1JK05',
    modelname: '烟火检测',
    alarmTypeId: 5,
    status: AlarmStatus.UNPROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1015',
    createTime: '2025-08-21 09:15:45',
    alarmTime: '2025-08-21 09:15:45',
  },
  {
    id: 1016,
    deviceName: '2-1F-南货梯月台-1JK10',
    modelname: '人员入侵检测',
    alarmTypeId: 1,
    status: AlarmStatus.PROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1016',
    createTime: '2025-08-20 16:30:12',
    alarmTime: '2025-08-20 16:30:12',
  },
  {
    id: 1017,
    deviceName: '海康11楼',
    modelname: '区域入侵检测',
    alarmTypeId: 2,
    status: AlarmStatus.FALSE_ALARM,
    alarmImg: 'https://picsum.photos/800/600?random=1017',
    createTime: '2025-08-20 15:45:33',
    alarmTime: '2025-08-20 15:45:33',
  },
  {
    id: 1018,
    deviceName: '1-4F-办公区-2JK02',
    modelname: '人员聚集检测',
    alarmTypeId: 3,
    status: AlarmStatus.UNPROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1018',
    createTime: '2025-08-20 14:20:55',
    alarmTime: '2025-08-20 14:20:55',
  },
  {
    id: 1019,
    deviceName: '2-3F-南货梯正门-1JK07',
    modelname: '物品遗留检测',
    alarmTypeId: 4,
    status: AlarmStatus.PROCESSED,
    alarmImg: 'https://picsum.photos/800/600?random=1019',
    createTime: '2025-08-20 13:15:18',
    alarmTime: '2025-08-20 13:15:18',
  },
  {
    id: 1020,
    deviceName: '3-1F-饭堂内1-1JK11',
    modelname: '烟火检测',
    alarmTypeId: 5,
    status: AlarmStatus.FALSE_ALARM,
    alarmImg: 'https://picsum.photos/800/600?random=1020',
    createTime: '2025-08-20 12:30:27',
    alarmTime: '2025-08-20 12:30:27',
  },
]

/**
 * 告警类型名称映射
 */
const alarmTypeNames: Record<number, string> = {
  1: '人员入侵检测',
  2: '区域入侵检测',
  3: '人员聚集检测',
  4: '物品遗留检测',
  5: '烟火检测',
}

/**
 * 模拟获取告警列表
 */
export function mockGetAlarmList(params: IAlarmListReq): Promise<IAlarmListRes> {
  const {
    page = 1,
    pageSize = 10,
    deviceName,
    status,
    alarm_type_name,
    startTime,
    endTime,
  } = params

  // 过滤数据
  let filteredAlarms = [...mockAlarmData]

  // 按设备名称过滤
  if (deviceName) {
    filteredAlarms = filteredAlarms.filter(alarm =>
      alarm.deviceName?.toLowerCase().includes(deviceName.toLowerCase()),
    )
  }

  // 按状态过滤
  if (status !== undefined) {
    filteredAlarms = filteredAlarms.filter(alarm => alarm.status === status)
  }

  // 按告警类型过滤
  if (alarm_type_name) {
    filteredAlarms = filteredAlarms.filter(alarm =>
      alarm.modelname?.toLowerCase().includes(alarm_type_name.toLowerCase()),
    )
  }

  // 按时间范围过滤
  if (startTime) {
    filteredAlarms = filteredAlarms.filter(alarm =>
      new Date(alarm.alarmTime) >= new Date(startTime),
    )
  }

  if (endTime) {
    filteredAlarms = filteredAlarms.filter(alarm =>
      new Date(alarm.alarmTime) <= new Date(endTime),
    )
  }

  // 按时间倒序排列
  filteredAlarms.sort((a, b) => new Date(b.alarmTime).getTime() - new Date(a.alarmTime).getTime())

  // 分页处理
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedAlarms = filteredAlarms.slice(startIndex, endIndex)

  return Promise.resolve({
    list: paginatedAlarms,
    total: filteredAlarms.length,
    size: paginatedAlarms.length,
  })
}

/**
 * 模拟获取告警详情
 */
export function mockGetAlarmDetailByID(alarm_id: number): Promise<IAlarmDetailRes> {
  // 查找对应的告警记录
  const alarmItem = mockAlarmData.find(item => item.id === alarm_id)

  if (!alarmItem) {
    return Promise.reject(new Error(`告警记录 ${alarm_id} 不存在`))
  }

  // 模拟通道详情信息
  const channelDetails: IAlarmDetailChannel = {
    national_num: '34020000001320000001',
    channel: '通道01',
  }

  // 模拟多图片场景：某些告警ID返回多张图片
  let alarmImages: string | string[]
  if (alarm_id === 1001) {
    // 每3个告警ID中有一个返回3张图片的数组
    alarmImages = [
      `https://picsum.photos/800/600?random=${alarm_id}_1`,
      `https://picsum.photos/800/600?random=${alarm_id}_2`,
      `https://picsum.photos/800/600?random=${alarm_id}_3`,
      `https://picsum.photos/800/600?random=${alarm_id}_4`,
      `https://picsum.photos/800/600?random=${alarm_id}_5`,
      `https://picsum.photos/800/600?random=${alarm_id}_6`,
    ]
  }
  else {
    // 其他返回单张图片
    alarmImages = alarmItem.alarmImg
  }

  // 构造详情数据
  const alarmDetail: IAlarmDetailRes = {
    alarm_id: alarmItem.id,
    status: alarmItem.status,
    alarm_img: alarmImages,
    modelname: alarmItem.modelname,
    device_name: alarmItem.deviceName,
    alarm_time: alarmItem.alarmTime,
    detail: channelDetails,
    address: '广东省佛山市南海区慧谷科技园',
    notice_type: '短信+邮件',
    notice_unames: ['张三', '李四', '王五'],
    videoUrl: `https://example.com/video/${alarm_id}.mp4`,
  }

  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(alarmDetail)
    }, 200 + Math.random() * 300) // 200-500ms 随机延迟
  })
}

/**
 * 模拟更新告警状态
 */
export function mockUpdateAlarmStatusByID(
  alarmId: number,
  status: AlarmStatus,
): Promise<{ success: boolean, message: string }> {
  // 查找对应的告警记录
  const alarmIndex = mockAlarmData.findIndex(item => item.id === alarmId)

  if (alarmIndex === -1) {
    return Promise.reject(new Error(`告警记录 ${alarmId} 不存在`))
  }

  // 更新状态
  mockAlarmData[alarmIndex].status = status

  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '告警状态更新成功',
      })
    }, 100 + Math.random() * 200) // 100-300ms 随机延迟
  })
}

// ==================== 告警统计数据 ====================

/**
 * 告警统计信息接口
 */
export interface IAlarmStats {
  /** 当日告警数 */
  todayAlarms: number
  /** 当日未处理 */
  todayUnprocessed: number
  /** 近7天告警数 */
  last7DaysAlarms: number
  /** 近7天未处理 */
  last7DaysUnprocessed: number
}

/**
 * 获取告警统计信息
 */
export function getAlarmStats(): IAlarmStats {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0] // 获取今天的日期 YYYY-MM-DD

  // 计算7天前的日期
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

  // 当日告警统计
  const todayAlarms = mockAlarmData.filter(alarm => alarm.alarmTime.startsWith(todayStr)).length
  const todayUnprocessed = mockAlarmData.filter(alarm =>
    alarm.alarmTime.startsWith(todayStr) && alarm.status === AlarmStatus.UNPROCESSED,
  ).length

  // 近7天告警统计
  const last7DaysAlarms = mockAlarmData.filter((alarm) => {
    const alarmDate = alarm.alarmTime.split('T')[0]
    return alarmDate >= sevenDaysAgoStr && alarmDate <= todayStr
  }).length

  const last7DaysUnprocessed = mockAlarmData.filter((alarm) => {
    const alarmDate = alarm.alarmTime.split('T')[0]
    return alarmDate >= sevenDaysAgoStr && alarmDate <= todayStr && alarm.status === AlarmStatus.UNPROCESSED
  }).length

  return {
    todayAlarms,
    todayUnprocessed,
    last7DaysAlarms,
    last7DaysUnprocessed,
  }
}

/**
 * 获取告警类型统计
 */
export function getAlarmTypeStats(): Array<{ type: string, count: number, percentage: number }> {
  const typeStats: Record<string, number> = {}

  // 统计各类型告警数量
  mockAlarmData.forEach((alarm) => {
    const typeName = alarm.modelname || '未知类型'
    typeStats[typeName] = (typeStats[typeName] || 0) + 1
  })

  const total = mockAlarmData.length

  // 转换为数组格式并计算百分比
  return Object.entries(typeStats).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / total) * 100),
  })).sort((a, b) => b.count - a.count) // 按数量降序排列
}

// ==================== 模拟告警分类数据 ====================

/**
 * 模拟告警分类数据
 */
const mockAlarmCategoryData: IAlarmCategoryItem[] = [
  {
    alarmCategory: null,
    alarmCode: '111',
    alarmTypeId: 79,
    alarmTypeName: '测试',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 79,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'face_mask',
    alarmTypeId: 77,
    alarmTypeName: '面部遮挡检测',
    createTime: null,
    fileId: 47,
    fileName: 'face_mask.pt',
    id: 77,
    isUse: 1,
    updateTime: '2025-05-06 11:09:48',
  },
  {
    alarmCategory: null,
    alarmCode: 'accessories',
    alarmTypeId: 76,
    alarmTypeName: '帽子检测',
    createTime: null,
    fileId: 46,
    fileName: 'accessories.pt',
    id: 76,
    isUse: 0,
    updateTime: '2025-03-13 11:40:20',
  },
  {
    alarmCategory: null,
    alarmCode: 'overflow',
    alarmTypeId: 75,
    alarmTypeName: '垃圾桶满溢',
    createTime: null,
    fileId: 44,
    fileName: 'garbage.pt',
    id: 75,
    isUse: 0,
    updateTime: '2025-01-02 14:29:17',
  },
  {
    alarmCategory: null,
    alarmCode: 'head',
    alarmTypeId: 74,
    alarmTypeName: '未佩戴安全帽',
    createTime: null,
    fileId: 35,
    fileName: 'helmet_or_head.pt',
    id: 74,
    isUse: 0,
    updateTime: '2025-01-20 17:29:02',
  },
  // 继续添加更多告警分类数据
  {
    alarmCategory: null,
    alarmCode: 'advertisement',
    alarmTypeId: 73,
    alarmTypeName: '违规户外广告识别',
    createTime: null,
    fileId: 33,
    fileName: 'yolov5s_app.om',
    id: 73,
    isUse: 0,
    updateTime: '2025-01-10 10:06:49',
  },
  {
    alarmCategory: null,
    alarmCode: 'tired',
    alarmTypeId: 72,
    alarmTypeName: '疲劳检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 72,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'oil tank',
    alarmTypeId: 71,
    alarmTypeName: '油桶识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 71,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'transport goods',
    alarmTypeId: 70,
    alarmTypeName: '搬运货物检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 70,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'safety belt',
    alarmTypeId: 69,
    alarmTypeName: '安全带检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 69,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'umbrella',
    alarmTypeId: 68,
    alarmTypeName: '违规撑伞识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 68,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'water leakage',
    alarmTypeId: 67,
    alarmTypeName: '漏水检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 67,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'goods truck',
    alarmTypeId: 66,
    alarmTypeName: '货车识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 66,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'water level',
    alarmTypeId: 65,
    alarmTypeName: '水位检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 65,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'airing',
    alarmTypeId: 64,
    alarmTypeName: '沿街晾晒识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 64,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'construction waste',
    alarmTypeId: 63,
    alarmTypeName: '建筑废料堆放识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 63,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'airconditioner',
    alarmTypeId: 62,
    alarmTypeName: '空调识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 62,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'protective clothing',
    alarmTypeId: 61,
    alarmTypeName: '防护服识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 61,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'chef hat',
    alarmTypeId: 60,
    alarmTypeName: '厨师帽检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 60,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'chef uniform',
    alarmTypeId: 59,
    alarmTypeName: '厨师服检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 59,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'jump',
    alarmTypeId: 58,
    alarmTypeName: '跳跃检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 58,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'swimming',
    alarmTypeId: 57,
    alarmTypeName: '游泳检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 57,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'truck',
    alarmTypeId: 56,
    alarmTypeName: '大卡车识别',
    createTime: null,
    fileId: 39,
    fileName: 'vehicle.pt',
    id: 56,
    isUse: 0,
    updateTime: '2025-02-07 16:30:18',
  },
  {
    alarmCategory: null,
    alarmCode: 'engineering vehicle',
    alarmTypeId: 55,
    alarmTypeName: '工程车识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 55,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'fight',
    alarmTypeId: 54,
    alarmTypeName: '打架检测',
    createTime: null,
    fileId: 40,
    fileName: 'fight.pt',
    id: 54,
    isUse: 0,
    updateTime: '2024-12-30 11:19:32',
  },
  {
    alarmCategory: null,
    alarmCode: 'fire passage',
    alarmTypeId: 53,
    alarmTypeName: '消防占道识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 53,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'throw rubbish',
    alarmTypeId: 52,
    alarmTypeName: '乱扔垃圾识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 52,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'spark',
    alarmTypeId: 51,
    alarmTypeName: '火星作业识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 51,
    isUse: 0,
    updateTime: '2024-12-24 10:12:24',
  },
  {
    alarmCategory: null,
    alarmCode: 'climb',
    alarmTypeId: 50,
    alarmTypeName: '翻墙检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 50,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'running',
    alarmTypeId: 49,
    alarmTypeName: '跑步检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 49,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'sleep',
    alarmTypeId: 48,
    alarmTypeName: '睡觉检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 48,
    isUse: 0,
    updateTime: null,
  },
  {
    alarmCategory: null,
    alarmCode: 'bicycle',
    alarmTypeId: 47,
    alarmTypeName: '自行车识别',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 47,
    isUse: 0,
    updateTime: '2024-12-24 14:25:54',
  },
  {
    alarmCategory: null,
    alarmCode: 'cell phone',
    alarmTypeId: 46,
    alarmTypeName: '手机使用检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 46,
    isUse: 0,
    updateTime: '2024-12-24 14:28:10',
  },
  {
    alarmCategory: null,
    alarmCode: 'crack',
    alarmTypeId: 45,
    alarmTypeName: '裂缝识别',
    createTime: null,
    fileId: 31,
    fileName: 'crack.pt',
    id: 45,
    isUse: 0,
    updateTime: '2024-12-24 14:28:28',
  },
  {
    alarmCategory: null,
    alarmCode: 'mouse',
    alarmTypeId: 44,
    alarmTypeName: '老鼠识别',
    createTime: null,
    fileId: 30,
    fileName: 'mouse.pt',
    id: 44,
    isUse: 0,
    updateTime: '2024-12-24 14:28:35',
  },
  {
    alarmCategory: null,
    alarmCode: 'reflective_clothes',
    alarmTypeId: 43,
    alarmTypeName: '反光衣识别',
    createTime: null,
    fileId: 29,
    fileName: 'reflective_clothes.pt',
    id: 43,
    isUse: 0,
    updateTime: '2025-01-20 17:29:12',
  },
  {
    alarmCategory: null,
    alarmCode: 'person',
    alarmTypeId: 42,
    alarmTypeName: '行人识别',
    createTime: null,
    fileId: 53,
    fileName: 'personV3.pt',
    id: 42,
    isUse: 1,
    updateTime: '2025-06-27 17:04:24',
  },
  {
    alarmCategory: null,
    alarmCode: 'smoke',
    alarmTypeId: null,
    alarmTypeName: '烟雾检测',
    createTime: null,
    fileId: 24,
    fileName: 'smoke.pt',
    id: 39,
    isUse: 0,
    updateTime: '2024-12-23 15:13:53',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'down',
    alarmTypeId: 35,
    alarmTypeName: '摔倒识别',
    createTime: null,
    fileId: 34,
    fileName: 'down.pt',
    id: 35,
    isUse: 0,
    updateTime: '2024-12-27 17:55:03',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'licence',
    alarmTypeId: 34,
    alarmTypeName: '车牌识别',
    createTime: null,
    fileId: 25,
    fileName: 'license.pt',
    id: 34,
    isUse: null,
    updateTime: '2024-12-20 14:43:45',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'Fire',
    alarmTypeId: 32,
    alarmTypeName: '火焰告警',
    createTime: null,
    fileId: 17,
    fileName: 'Fire.pt',
    id: 32,
    isUse: 0,
    updateTime: '2024-12-23 15:14:28',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'FACE',
    alarmTypeId: 23,
    alarmTypeName: '人脸检测',
    createTime: null,
    fileId: null,
    fileName: null,
    id: 23,
    isUse: 0,
    updateTime: '2024-12-20 14:39:07',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'Smoking',
    alarmTypeId: 19,
    alarmTypeName: '抽烟检测',
    createTime: null,
    fileId: 26,
    fileName: 'Smoking.pt',
    id: 19,
    isUse: 0,
    updateTime: '2025-01-14 15:28:56',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'garbage',
    alarmTypeId: 15,
    alarmTypeName: '垃圾识别',
    createTime: null,
    fileId: 45,
    fileName: 'garbage.pt',
    id: 15,
    isUse: 0,
    updateTime: '2025-01-14 15:29:08',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'car',
    alarmTypeId: 11,
    alarmTypeName: '车辆识别',
    createTime: null,
    fileId: 43,
    fileName: 'car_or_van.pt',
    id: 11,
    isUse: 0,
    updateTime: '2025-02-07 16:30:14',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'mask',
    alarmTypeId: 10,
    alarmTypeName: '口罩检测',
    createTime: null,
    fileId: 16,
    fileName: 'mask.pt',
    id: 10,
    isUse: 0,
    updateTime: '2025-01-06 14:15:14',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'helmet',
    alarmTypeId: 9,
    alarmTypeName: '安全帽检测',
    createTime: null,
    fileId: 37,
    fileName: 'helmet_or_head.pt',
    id: 9,
    isUse: 1,
    updateTime: '2025-01-20 17:52:06',
  },
  {
    alarmCategory: 'alarm',
    alarmCode: 'motorcycle',
    alarmTypeId: 8,
    alarmTypeName: '电瓶车检测',
    createTime: null,
    fileId: 42,
    fileName: 'motorcycle.pt',
    id: 8,
    isUse: null,
    updateTime: '2025-01-02 11:11:58',
  },
]

/**
 * 模拟获取告警分类列表
 */
export function mockGetAlarmCategory(
  page: number = 1,
  pageSize: number = 10,
  query?: string,
): Promise<IAlarmCategoryRes> {
  // 过滤数据
  let filteredCategories = [...mockAlarmCategoryData]

  // 按查询条件过滤
  if (query) {
    filteredCategories = filteredCategories.filter(category =>
      category.alarmTypeName.toLowerCase().includes(query.toLowerCase())
      || category.alarmCode.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // 按ID降序排列
  filteredCategories.sort((a, b) => b.id - a.id)

  // 分页处理
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  return Promise.resolve({
    list: paginatedCategories,
    total: filteredCategories.length,
    size: paginatedCategories.length,
  })
}
