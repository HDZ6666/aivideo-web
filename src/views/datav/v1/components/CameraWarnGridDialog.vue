<template>
    <div class="alarm-dialog">
        <div class="close-btn" @click="handleClose"></div>
        <div class="dialog-box">
            <div class="dialog-content">
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

                <div class="warn-body">
                    <div class="camera-warn">
                        <div class="camera-item" v-for="(item, index) in warnList" :key="index"
                            @click="handleDetail(item)">
                            <img :src="item.alarmImg" alt="告警图片">
                            <div class="camera-addr">
                                <span v-if="item.status != 0" class="handled">【已处理】</span>
                                【{{ item.alarmTypeName || '未知' }}】{{ item.deviceName }}
                            </div>
                        </div>
                    </div>
                </div>

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

const emit = defineEmits(['close', 'show-detail'])

const statusOptions = [
    { label: '未处理', value: 0 },
    { label: '已处理', value: 1 },
    { label: '误报', value: 2 },
]

const warnList = ref([])
// const detailVisible = ref(false)
// const detailInfo = ref({})

const pager = reactive({
    pageIndex: 1,
    pageSize: 8,
    totalPage: 1
})

const searchForm = reactive({
    alarmTypeName: null,
    startTime: null,
    endTime: null,
    status: null
})

const timeRange = ref([])

// 模拟数据 (参考 AlarmStatisticsDialog)
const mockAlarmData = [
    {
        "alarmId": 216614,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/bf931a44-d553-48cf-bbcc-f2aaaadc5f02.jpg",
        "alarmTime": "2025-12-17 10:25:30",
        "alarmTypeName": "行人检测",
        "deviceName": "高铁桥出口底闸机方向",
        "status": 0,
        "alarmDescription": "检测到行人闯入禁区"
    },
    {
        "alarmId": 216613,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/e5017870-b856-4cfa-b177-88811f2175f9.jpg",
        "alarmTime": "2025-12-17 10:19:06",
        "alarmTypeName": "行人检测",
        "deviceName": "高铁桥出口底闸机方向",
        "status": 0,
        "alarmDescription": "检测到行人闯入禁区"
    },
    {
        "alarmId": 216612,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/ebeda6c8-785c-406c-916b-b4399e79bb83.jpg",
        "alarmTime": "2025-12-17 10:18:34",
        "alarmTypeName": "行人检测",
        "deviceName": "塘美出口方向",
        "status": 1,
        "alarmDescription": "检测到行人闯入禁区"
    },
    {
        "alarmId": 216611,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/113505b0-e4f8-454c-a1b3-5a8c7af79b44.jpg",
        "alarmTime": "2025-12-17 10:10:42",
        "alarmTypeName": "行人检测",
        "deviceName": "高铁桥出口底闸机方向",
        "status": 2,
        "alarmDescription": "误报，排除"
    },
    {
        "alarmId": 216610,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/9f6d729b-da6c-4279-99e2-9835621afd62.jpg",
        "alarmTime": "2025-12-17 09:53:50",
        "alarmTypeName": "车辆检测",
        "deviceName": "塘美出口方向",
        "status": 0,
        "alarmDescription": "检测到车辆违停"
    },
    {
        "alarmId": 216609,
        "alarmImg": "http://120.237.149.244:19000/ai-images/2025-12-17/2ddecafa-ef31-4d97-8589-325310fe51d0.jpg",
        "alarmTime": "2025-12-17 09:45:59",
        "alarmTypeName": "烟雾检测",
        "deviceName": "塘美出口方向",
        "status": 0,
        "alarmDescription": "检测到烟雾"
    },
    {
        "alarmId": 216608,
        "alarmImg": "https://via.placeholder.com/300x200?text=Mock+Image",
        "alarmTime": "2025-12-17 09:30:00",
        "alarmTypeName": "火焰检测",
        "deviceName": "仓库内部",
        "status": 0,
        "alarmDescription": "检测到明火"
    },
    {
        "alarmId": 216607,
        "alarmImg": "https://via.placeholder.com/300x200?text=Mock+Image",
        "alarmTime": "2025-12-17 09:15:00",
        "alarmTypeName": "人员聚集",
        "deviceName": "工厂大门",
        "status": 1,
        "alarmDescription": "人员聚集超过阈值"
    }
]

onMounted(() => {
    console.log("CameraWarnGridDialog mounted");
    getAlarmList()
})

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
            warnList.value = records
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
    if (searchForm.status !== null && searchForm.status !== undefined && searchForm.status !== '') {
        filteredData = filteredData.filter(item => item.status === searchForm.status)
    }

    // 分页处理
    const startIndex = (pager.pageIndex - 1) * pager.pageSize
    const endIndex = startIndex + pager.pageSize
    const pageData = filteredData.slice(startIndex, endIndex)

    warnList.value = pageData
    pager.totalPage = Math.ceil(filteredData.length / pager.pageSize) || 1
}

const handleDetail = (data) => {
    emit('show-detail', data)
}

// 暴露刷新方法
defineExpose({
    refreshList: getAlarmList
})

const handleClose = () => {
    emit("close", false)
}

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

const handlePage = (direction) => {
    if (direction > 0) {
        if (pager.pageIndex >= pager.totalPage) {
            ElMessage.warning("没有下一页了");
        } else {
            pager.pageIndex++;
            getAlarmList();
        }
    } else {
        if (pager.pageIndex <= 1) {
            ElMessage.warning("没有上一页了");
        } else {
            pager.pageIndex--;
            getAlarmList();
        }
    }
}
</script>

<style lang="scss" scoped>
// 统一使用 px 单位 (基于 1rem = 192px)
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
    background-color: transparent;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
}

.dialog-box {
    position: relative;
    width: 100%;
    height: 100%;
    background: #061A40 url("@/assets/datav/v1/warn_bg.png") no-repeat center;
    background-size: 100% 100%;
    color: #fff;
    padding-top: 38.4px; // 0.2rem
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
        height: 32px;
        font-size: 15.36px;
        background: #0052d9;
        border: none;
        color: #fff;

        &:hover {
            background: #0071bc;
        }
    }
}

.warn-body {
    width: 100%;
    height: 79%;
    font-size: 19.2px; // 0.1rem

    .camera-warn {
        width: 100%;
        height: 100%;
        padding: 9.6px;
        display: flex;
        flex-wrap: wrap; // 允许换行
        align-content: flex-start; // 内容顶部对齐

        .camera-item {
            width: 25%;
            height: 50%;
            cursor: pointer;
            padding: 19.2px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;

            img {
                width: 100%;
                height: 80%;
                object-fit: cover;
                border: 1px solid #0052d9; // 加个边框
            }

            .camera-addr {
                color: #FFF;
                font-family: "PingFang SC";
                font-size: 15.36px;
                font-weight: 400;
                line-height: normal;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding-top: 9.6px;
                text-align: center;

                .handled {
                    color: #52c41a;
                }
            }
        }
    }
}

.pager {
    width: 100%;
    padding: 9.6px 19.2px;
    display: flex;
    color: #fff;
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
    margin-left: 7.68px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 6px;
    color: #fff;

    &:hover {
        background: #0091ff;
    }
}

.page-num {
    line-height: 38.4px;
    font-size: 15.36px;
    padding: 0 5.76px 0 11.52px;
    color: #fff;
}
</style>
