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
import { useDatavStore } from '@/store/modules/datav'
import { ElMessage } from 'element-plus'
import { listAlarmInfo } from '@/api/datav/monitor.js'

const datavStore = useDatavStore()

const emit = defineEmits(['close'])

const statusOptions = [
    { label: '未处理', value: 0 },
    { label: '已处理', value: 1 },
    { label: '误报', value: 2 },
]

const warnList = ref([])


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
        }
    } catch (error) {
        console.error('获取告警列表失败:', error)
    }
}



const handleDetail = (data) => {
    datavStore.showDetailManual(data)
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
