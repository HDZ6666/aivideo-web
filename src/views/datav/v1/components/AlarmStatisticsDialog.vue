<template>
    <div class="alarm-dialog">
        <!-- 关闭按钮区域 -->
        <div class="close-btn" @click="handleClose"></div>

        <div class="dialog-box">
            <div class="dialog-content">
                <!-- 搜索栏 -->
                <div class="search-bar">
                    <el-form :model="searchForm" inline>
                        <el-form-item label="告警类型" label-width="100px">
                            <el-input v-model="searchForm.alarmTypeName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="日期" label-width="100px">
                            <el-date-picker v-model="timeRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" clearable />
                        </el-form-item>
                        <el-form-item label="状态" label-width="100px">
                            <el-select v-model="searchForm.status" placeholder="请选择" clearable>
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSearch">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 告警表格 -->
                <table class="alarm-table">
                    <thead>
                        <tr>
                            <th>告警类型</th>
                            <th>设备名称</th>
                            <th>告警时间</th>
                            <th>处理状态</th>
                            <th>告警缩略图</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in alarmList" :key="index" @click="handleRowClick(row)">
                            <td>{{ row.alarmTypeName || '-' }}</td>
                            <td>{{ row.modelname || row.deviceName || '-' }}</td>
                            <td>{{ row.alarmTime || '-' }}</td>
                            <td>
                                <span :class="getStatusClass(row.status)">
                                    {{ getStatusText(row.status) }}
                                </span>
                            </td>
                            <td>
                                <img v-if="row.alarmImg" class="thumbnail" :src="row.alarmImg" alt="告警图片" />
                                <span v-else>-</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- 分页 -->
                <div class="pager">
                    <div class="pager-right">
                        <div class="pager-btn" @click="handlePage(-1)">上一屏</div>
                        <div class="page-num">{{ pager.pageIndex }} / {{ pager.totalPage }}</div>
                        <div class="pager-btn" @click="handlePage(1)">下一屏</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 详情弹窗已移至 index.vue -->
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listAlarmInfo } from '@/api/datav/monitor.js'

// Props
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['close', 'update:visible', 'show-detail'])

// 状态选项
const statusOptions = [
    { label: '未处理', value: 0 },
    { label: '已处理', value: 1 },
    { label: '误报', value: 2 }
]

// 搜索表单
const timeRange = ref([])
const searchForm = reactive({
    alarmTypeName: null,
    startTime: null,
    endTime: null,
    status: null
})

// 分页
const pager = reactive({
    pageIndex: 1,
    pageSize: 6,
    totalPage: 3
})

// 告警列表
const alarmList = ref([])

// 详情弹窗（逻辑已上浮，此处可保留引用或移除）
const detailVisible = ref(false)
const detailInfo = ref({})

// 模拟数据
const mockAlarmData = [
    {
        "alarmCategory": null,
        "alarmDescription": "行人检测",
        "alarmId": 216614,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/bf931a44-d553-48cf-bbcc-f2aaaadc5f02.jpg",
        "alarmMethod": null,
        "alarmPriority": null,
        "alarmTime": "2025-12-17 10:25:30",
        "alarmType": null,
        "alarmTypeName": "行人检测",
        "area": null,
        "boxId": 0,
        "channelId": "41010500001320000128",
        "createTime": "2025-12-17 10:25:30",
        "deviceChannelNo": null,
        "deviceId": "41010500001320000128",
        "deviceIp": null,
        "deviceName": "高铁桥出口底闸机方向",
        "deviceTypeId": 0,
        "id": 216614,
        "latitude": 0,
        "longitude": 0,
        "modelname": "行人检测",
        "point": null,
        "status": 0,
        "updateTime": null,
        "uuid": "1245457895",
        "videoDuration": null,
        "videoUrl": "http://120.237.149.244:19000/ai-videos/2025-12-17/bf931a44-d553-48cf-bbcc-f2aaaadc5f02.mp4"
    },
    {
        "alarmCategory": null,
        "alarmDescription": "行人检测",
        "alarmId": 216613,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/e5017870-b856-4cfa-b177-88811f2175f9.jpg",
        "alarmMethod": null,
        "alarmPriority": null,
        "alarmTime": "2025-12-17 10:19:06",
        "alarmType": null,
        "alarmTypeName": "行人检测",
        "area": null,
        "boxId": 0,
        "channelId": "41010500001320000128",
        "createTime": "2025-12-17 10:19:06",
        "deviceChannelNo": null,
        "deviceId": "41010500001320000128",
        "deviceIp": null,
        "deviceName": "高铁桥出口底闸机方向",
        "deviceTypeId": 0,
        "id": 216613,
        "latitude": 0,
        "longitude": 0,
        "modelname": "行人检测",
        "point": null,
        "status": 0,
        "updateTime": null,
        "uuid": "1245457895",
        "videoDuration": null,
        "videoUrl": "http://120.237.149.244:19000/ai-videos/2025-12-17/e5017870-b856-4cfa-b177-88811f2175f9.mp4"
    },
    {
        "alarmCategory": null,
        "alarmDescription": "行人检测",
        "alarmId": 216612,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/ebeda6c8-785c-406c-916b-b4399e79bb83.jpg",
        "alarmMethod": null,
        "alarmPriority": null,
        "alarmTime": "2025-12-17 10:18:34",
        "alarmType": null,
        "alarmTypeName": "行人检测",
        "area": null,
        "boxId": 0,
        "channelId": "41010500001320000141",
        "createTime": "2025-12-17 10:18:34",
        "deviceChannelNo": null,
        "deviceId": "41010500001320000141",
        "deviceIp": null,
        "deviceName": "塘美出口方向",
        "deviceTypeId": 0,
        "id": 216612,
        "latitude": 0,
        "longitude": 0,
        "modelname": "行人检测",
        "point": null,
        "status": 0,
        "updateTime": null,
        "uuid": "1245457895",
        "videoDuration": null,
        "videoUrl": "http://120.237.149.244:19000/ai-videos/2025-12-17/ebeda6c8-785c-406c-916b-b4399e79bb83.mp4"
    },
    {
        "alarmCategory": null,
        "alarmDescription": "行人检测",
        "alarmId": 216611,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/113505b0-e4f8-454c-a1b3-5a8c7af79b44.jpg",
        "alarmMethod": null,
        "alarmPriority": null,
        "alarmTime": "2025-12-17 10:10:42",
        "alarmType": null,
        "alarmTypeName": "行人检测",
        "area": null,
        "boxId": 0,
        "channelId": "41010500001320000128",
        "createTime": "2025-12-17 10:10:42",
        "deviceChannelNo": null,
        "deviceId": "41010500001320000128",
        "deviceIp": null,
        "deviceName": "高铁桥出口底闸机方向",
        "deviceTypeId": 0,
        "id": 216611,
        "latitude": 0,
        "longitude": 0,
        "modelname": "行人检测",
        "point": null,
        "status": 2,
        "updateTime": null,
        "uuid": "1245457895",
        "videoDuration": null,
        "videoUrl": "http://120.237.149.244:19000/ai-videos/2025-12-17/113505b0-e4f8-454c-a1b3-5a8c7af79b44.mp4"
    },
    {
        "alarmCategory": null,
        "alarmDescription": "行人检测",
        "alarmId": 216610,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/9f6d729b-da6c-4279-99e2-9835621afd62.jpg",
        "alarmMethod": null,
        "alarmPriority": null,
        "alarmTime": "2025-12-17 09:53:50",
        "alarmType": null,
        "alarmTypeName": "行人检测",
        "area": null,
        "boxId": 0,
        "channelId": "41010500001320000141",
        "createTime": "2025-12-17 09:53:50",
        "deviceChannelNo": null,
        "deviceId": "41010500001320000141",
        "deviceIp": null,
        "deviceName": "塘美出口方向",
        "deviceTypeId": 0,
        "id": 216610,
        "latitude": 0,
        "longitude": 0,
        "modelname": "行人检测",
        "point": null,
        "status": 0,
        "updateTime": null,
        "uuid": "1245457895",
        "videoDuration": null,
        "videoUrl": "http://120.237.149.244:19000/ai-videos/2025-12-17/9f6d729b-da6c-4279-99e2-9835621afd62.mp4"
    },
    {
        "alarmCategory": null,
        "alarmDescription": "行人检测",
        "alarmId": 216609,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/2ddecafa-ef31-4d97-8589-325310fe51d0.jpg",
        "alarmMethod": null,
        "alarmPriority": null,
        "alarmTime": "2025-12-17 09:45:59",
        "alarmType": null,
        "alarmTypeName": "行人检测",
        "area": null,
        "boxId": 0,
        "channelId": "41010500001320000141",
        "createTime": "2025-12-17 09:45:59",
        "deviceChannelNo": null,
        "deviceId": "41010500001320000141",
        "deviceIp": null,
        "deviceName": "塘美出口方向",
        "deviceTypeId": 0,
        "id": 216609,
        "latitude": 0,
        "longitude": 0,
        "modelname": "行人检测",
        "point": null,
        "status": 0,
        "updateTime": null,
        "uuid": "1245457895",
        "videoDuration": null,
        "videoUrl": "http://120.237.149.244:19000/ai-videos/2025-12-17/2ddecafa-ef31-4d97-8589-325310fe51d0.mp4"
    }
]

// 旧数据备份（避免删除冲突）
const mockAlarmDataOld = [
    {
        id: 1,
        alarmTypeName: '行人检测',
        modelname: '行人检测',
        deviceName: '摄像头-001',
        alarmTime: '2025-12-17 09:31:22',
        status: 0,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+1',
        alarmDescription: '检测到行人进入禁区'
    },
    {
        id: 2,
        alarmTypeName: '行人检测',
        modelname: '行人检测',
        deviceName: '摄像头-002',
        alarmTime: '2025-12-17 09:13:19',
        status: 1,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+2',
        alarmDescription: '检测到行人进入禁区'
    },
    {
        id: 3,
        alarmTypeName: '行人检测',
        modelname: '行人检测',
        deviceName: '摄像头-003',
        alarmTime: '2025-12-17 09:12:18',
        status: 0,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+3',
        alarmDescription: '检测到行人进入禁区'
    },
    {
        id: 4,
        alarmTypeName: '行人检测',
        modelname: '行人检测',
        deviceName: '摄像头-004',
        alarmTime: '2025-12-17 09:12:16',
        status: 0,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+4',
        alarmDescription: '检测到行人进入禁区'
    },
    {
        id: 5,
        alarmTypeName: '行人检测',
        modelname: '行人检测',
        deviceName: '摄像头-005',
        alarmTime: '2025-12-17 08:08:38',
        status: 1,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+5',
        alarmDescription: '检测到行人进入禁区'
    },
    {
        id: 6,
        alarmTypeName: '行人检测',
        modelname: '行人检测',
        deviceName: '摄像头-006',
        alarmTime: '2025-12-17 08:59:53',
        status: 0,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+6',
        alarmDescription: '检测到行人进入禁区'
    },
    {
        id: 7,
        alarmTypeName: '车辆检测',
        modelname: '车辆检测',
        deviceName: '摄像头-007',
        alarmTime: '2025-12-17 08:45:22',
        status: 2,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+7',
        alarmDescription: '检测到车辆违规停放'
    },
    {
        id: 8,
        alarmTypeName: '车辆检测',
        modelname: '车辆检测',
        deviceName: '摄像头-008',
        alarmTime: '2025-12-17 08:30:15',
        status: 0,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+8',
        alarmDescription: '检测到车辆违规停放'
    },
    {
        id: 9,
        alarmTypeName: '烟雾检测',
        modelname: '烟雾检测',
        deviceName: '摄像头-009',
        alarmTime: '2025-12-17 08:15:08',
        status: 1,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+9',
        alarmDescription: '检测到烟雾异常'
    },
    {
        id: 10,
        alarmTypeName: '烟雾检测',
        modelname: '烟雾检测',
        deviceName: '摄像头-010',
        alarmTime: '2025-12-17 08:00:00',
        status: 0,
        alarmImg: 'https://via.placeholder.com/200x150/0953bc/ffffff?text=Alarm+10',
        alarmDescription: '检测到烟雾异常'
    }
]

// 获取状态文本
const getStatusText = (status) => {
    const statusMap = {
        0: '未处理',
        1: '已处理',
        2: '误报'
    }
    return statusMap[status] || '-'
}

// 获取状态样式类
const getStatusClass = (status) => {
    const classMap = {
        0: 'status-pending',
        1: 'status-handled',
        2: 'status-false-alarm'
    }
    return classMap[status] || ''
}

// 获取告警列表（调用真实 API）
const getAlarmList = async () => {
    try {
        const query = {
            page: pager.pageIndex,
            size: pager.pageSize,
            alarmTypeName: searchForm.alarmTypeName || undefined,
            startTime: searchForm.startTime || undefined,
            endTime: searchForm.endTime || undefined,
            status: searchForm.status
        }

        const res = await listAlarmInfo(query)
        console.log('告警列表响应:', res)

        if (res && (res.code === 0 || res.code === '0')) {
            const records = res.data?.records || []
            alarmList.value = [...records]
            // 填充空行保证表格高度一致
            while (alarmList.value.length < pager.pageSize) {
                alarmList.value.push({})
            }
            pager.totalPage = res.data?.pages || 1
        } else {
            // API 返回失败，使用模拟数据
            console.warn('API 返回失败，使用模拟数据')
            useMockData()
        }
    } catch (error) {
        console.error('获取告警列表失败:', error)
        // 请求失败，使用模拟数据
        useMockData()
    }
}

// 使用模拟数据（回退方案）
const useMockData = () => {
    let filteredData = [...mockAlarmData]

    // 筛选条件
    if (searchForm.alarmTypeName) {
        filteredData = filteredData.filter(item =>
            item.alarmTypeName?.includes(searchForm.alarmTypeName)
        )
    }
    if (searchForm.status !== null && searchForm.status !== undefined) {
        filteredData = filteredData.filter(item => item.status === searchForm.status)
    }

    // 分页处理
    const startIndex = (pager.pageIndex - 1) * pager.pageSize
    const endIndex = startIndex + pager.pageSize
    const pageData = filteredData.slice(startIndex, endIndex)

    // 填充空行保证表格高度一致
    alarmList.value = [...pageData]
    while (alarmList.value.length < pager.pageSize) {
        alarmList.value.push({})
    }

    pager.totalPage = Math.ceil(filteredData.length / pager.pageSize) || 1
}

// 搜索
const handleSearch = () => {
    if (timeRange.value && timeRange.value.length === 2) {
        searchForm.startTime = timeRange.value[0]
        searchForm.endTime = timeRange.value[1] + ' 23:59:59'
    } else {
        searchForm.startTime = null
        searchForm.endTime = null
    }
    pager.pageIndex = 1
    getAlarmList()
}

// 分页
const handlePage = (direction) => {
    if (direction > 0) {
        if (pager.pageIndex >= pager.totalPage) {
            ElMessage.warning('已经是最后一页了')
            return
        }
        pager.pageIndex++
    } else {
        if (pager.pageIndex <= 1) {
            ElMessage.warning('已经是第一页了')
            return
        }
        pager.pageIndex--
    }
    getAlarmList()
}

// 点击行查看详情
const handleRowClick = (row) => {
    if (!row.alarmTypeName) return
    emit('show-detail', row)
}

// 暴露刷新方法给父组件，供详情处理完后调用
defineExpose({
    refreshList: getAlarmList
})

// 关闭弹窗
const handleClose = () => {
    emit('close')
    emit('update:visible', false)
}

// 组件挂载时获取数据
onMounted(() => {
    console.log('AlarmStatisticsDialog - 组件已挂载')
    getAlarmList()
})
</script>

<style lang="scss" scoped>
// 基于 html { font-size: 192px } 转换
// 0.1rem = 19.2px, 0.08rem = 15.36px, 0.05rem = 9.6px 等

.alarm-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 89998;
    padding: 19.2px;
    background-color: #061a40;
}

.close-btn {
    position: fixed;
    top: 19.2px;
    right: 19.2px;
    width: 115.2px;
    height: 38.4px;
    z-index: 89999;
    cursor: pointer;
    background-color: transparent; // 透明背景
    transition: background-color 0.3s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1); // 悬停时的微弱高亮
    }
}

.dialog-box {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 38.4px;
    background: #061a40 url("@/assets/datav/v1/warn_bg.png") no-repeat center;
    background-size: 100% 100%;
    color: #fff;
}

.dialog-content {
    padding: 15.36px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.search-bar {
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;

    :deep(.el-form) {
        width: 100%;
        display: flex;
        align-items: center;
    }

    :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: 19.2px;
        display: flex;
        align-items: center;
    }

    :deep(.el-form-item__label) {
        color: #fff;
        font-size: 15.36px;
        font-weight: normal;
        padding-right: 9.6px;
    }

    :deep(.el-input) {
        width: 200px;
    }

    :deep(.el-select) {
        width: 200px;
    }

    :deep(.el-input__wrapper) {
        background-color: #fff !important;
        border: 1px solid #0052d9 !important;
        box-shadow: none !important;
        padding: 0 11.52px;
        height: 32px;
    }

    :deep(.el-input__inner) {
        color: #333 !important;
        font-size: 15.36px;
        height: 32px;
        line-height: 32px;
    }

    :deep(.el-date-editor) {
        --el-date-editor-width: 300px;
        width: 300px;

        .el-range-separator {
            color: #333 !important;
            height: 32px;
            line-height: 32px;
        }

        .el-range-input {
            color: #333 !important;
        }
    }

    :deep(.el-button) {
        height: 32px; // 按钮高度
        font-size: 15.36px;
        background: #0052d9;
        border: none;
        color: #fff;

        &:hover {
            background: #0071bc;
        }
    }
}

.alarm-table {
    width: 100%;
    height: 642px;
    border-collapse: collapse;
    font-size: 19.2px;

    thead {
        tr {
            height: 91px;
            background: #062B5A;

            th {
                color: #fff;
                font-weight: bold;
                text-align: center;
                padding: 9.6px;
                border: none;
            }
        }
    }

    tbody {
        tr {
            height: 91px;
            border-top: 1px solid #062B5A;
            text-align: center;
            cursor: pointer;
            transition: background 0.3s ease;

            &:hover {
                background: rgba(9, 83, 188, 0.3);
            }

            td {
                color: #fff;
                padding: 9.6px;
                border: none;
            }
        }
    }
}

.thumbnail {
    width: 38.4px;
    height: 28.8px;
    object-fit: cover;
    border-radius: 4px;
}

.status-pending {
    color: #ff6b6b;
}

.status-handled {
    color: #52c41a;
}

.status-false-alarm {
    color: #faad14;
}

.pager {
    width: 100%;
    padding: 9.6px 19.2px;
    display: flex;
    color: var(--text-page-color);
    font-size: 15.36px;
    margin-bottom: 19.2px;
}

.pager-right {
    flex: 1;
    justify-content: right;
    display: flex;
    align-items: center;
}

.pager-btn {
    width: 96px;
    height: 38.4px;
    line-height: 38.4px;
    text-align: center;
    background: #0071bc;
    background-size: 100% 100%;
    margin-left: 7.68px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 6px; // WarnBox 似乎没有圆角，或者是图片背景自带圆角
    color: var(--text-page-color);

    &:hover {
        background: #0091ff;
        background-size: 100% 100%;
    }

    &.active {
        background: #0071bc;
        background-size: 100% 100%;
    }
}

.page-num {
    line-height: 38.4px;
    font-size: 15.36px;
    padding: 0 5.76px 0 11.52px;
    color: #fff;
}
</style>
