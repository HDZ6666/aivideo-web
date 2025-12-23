import request from "@/utils/request-datav";

/**
 * 获取摄像头列表
 * @param {Object} params - 查询参数 { page, pageSize, categoryId, deviceId, type }
 */
export function listCamera(params) {
    return request({
        url: '/api/cockpit/proxy/list',
        method: 'get',
        params: params
    });
}

/**
 * 获取设备分组列表
 * @param {Object} params - { parentId }
 */
export function listDeviceGroup(params) {
    return request({
        url: '/ai/api/device/group/cameraGroupList',
        method: 'get',
        params: params
    });
}

/**
 * 获取设备子节点列表
 * @param {Object} params - { groupId } 或 { deviceId }
 */
export function listDeviceChildren(params) {
    return request({
        url: '/api/device/query/devices-and-streams',
        method: 'get',
        params: params
    });
}

/**
 * 获取资源信息
 */
export function getResourceInfo() {
    return request({
        url: '/api/cockpit/proxy/resource/info',
        method: 'get'
    });
}

/**
 * 获取设备总数
 */
export function getDeviceCount() {
    return request({
        url: '/api/alarm/v2/deviceInfo/deviceCount',
        method: 'get'
    });
}

/**
 * 获取在线设备数
 */
export function getOnlineDeviceCount() {
    return request({
        url: '/api/alarm/v2/deviceInfo/onlineDeviceCount',
        method: 'get'
    });
}

/**
 * 获取告警信息分页
 * @param {Object} params - 查询参数 { page, size, status, startTime, endTime, alarmTypeName }
 */
export function listAlarmInfo(params) {
    return request({
        url: '/api/alarm/v2/stat/findAlarmInfoPage',
        method: 'get',
        params: params
    });
}

/**
 * 获取分时告警统计 (趋势图)
 * @param {Object} params - { startTime, endTime }
 */
export function getAlarmCountByTime(params) {
    return request({
        url: '/api/alarm/v2/stat/statAlarmCountByTime',
        method: 'get',
        params: params
    });
}

/**
 * 获取大屏告警统计
 */
export function getScreenAlarmStatistics() {
    return request({
        url: '/api/alarm/v2/stat/screenAlarmStatistics',
        method: 'get'
    });
}

/**
 * 告警处理
 * @param {Object} params - { status, alarmId, alarmDescription }
 */
export function handleAlarm(params) {
    return request({
        url: '/ai/api/alarm/handle',
        method: 'get',
        params: params
    });
}
