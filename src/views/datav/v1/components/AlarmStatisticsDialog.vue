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
import { useDatavStore } from '@/store/modules/datav'
import { ElMessage } from 'element-plus'
import { listAlarmInfo } from '@/api/datav/monitor.js'

const datavStore = useDatavStore()



const emit = defineEmits(['close'])

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
            while (alarmList.value.length < pager.pageSize) {
                alarmList.value.push({})
            }
            pager.totalPage = res.data?.pages || 1
        }
    } catch (error) {
        console.error('获取告警列表失败:', error)
    }
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
    datavStore.showDetailManual(row)
}

// 暴露刷新方法给父组件，供详情处理完后调用
defineExpose({
    refreshList: getAlarmList
})

const handleClose = () => {
    emit('close')
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
