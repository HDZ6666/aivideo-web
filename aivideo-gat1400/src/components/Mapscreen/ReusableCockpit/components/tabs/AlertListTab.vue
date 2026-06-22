<template>
    <!-- 告警列表 Tab -->
    <div class="tab-pane">
        <div class="table-section">
            <div class="section-header">
                <span class="section-icon">🚨</span>
                <span class="section-title">摄像头告警列表</span>
                <span class="tenant-count">共 {{ totalCount }} 条告警</span>

                <!-- 筛选器，选择的未处理等信息就是statusFilter.value并且双向绑定 -->
                <div class="filter-item">
                    <label class="filter-label">状态筛选：</label>
                    <select v-model="statusFilter" @change="handleStatusFilterChange" class="filter-select">
                        <option value="">全部状态</option>
                        <option value="未处理">未处理</option>
                        <option value="已处理">已处理</option>
                        <option value="误报">误报</option>
                    </select>
                </div>
            </div>

            <div class="table-container">
                <div v-if="loading" class="table-loading">
                    <div class="spinner"></div>
                    <span>告警数据加载中...</span>
                </div>

                <template v-else>
                    <div v-if="paginatedAlerts.length" class="custom-table">
                        <div class="table-head">
                            <div class="th col-type">告警类型</div>
                            <div class="th col-device">设备名称</div>
                            <div class="th col-time">告警时间</div>
                            <div class="th col-desc">告警描述</div>
                            <div class="th col-status">处理状态</div>
                            <div class="th col-thumb">缩略图</div>
                        </div>

                        <div class="table-body">
                            <div class="table-row" v-for="alert in paginatedAlerts" :key="alert.alarmId">
                                <div class="td col-type">
                                    <div class="type-badge" :class="getAlertTypeColor(alert.alarmTypeName || alert.modelname)">
                                        <span>{{ alert.alarmTypeName || alert.modelname || '-' }}</span>
                                    </div>
                                </div>

                                <div class="td col-device">
                                    <span class="cell-text" :title="alert.deviceName">{{ alert.deviceName || '-' }}</span>
                                </div>

                                <div class="td col-time">
                                    <span>{{ alert.alarmTime || alert.createTime || '-' }}</span>
                                </div>

                                <div class="td col-desc">
                                    <span class="cell-text" :title="alert.alarmDescription || alert.alarmCategory">
                                        {{ alert.alarmDescription || alert.alarmCategory || '-' }}
                                    </span>
                                </div>

                                <div class="td col-status">
                                    <span class="status-badge" :class="formatStatusClass(alert.status)">
                                        {{ formatStatusText(alert.status) }}
                                    </span>
                                </div>

                                <div class="td col-thumb">
                                    <div class="thumbnail-container">
                                        <button
                                            v-if="!alert._imageError && resolveAlarmImage(alert)"
                                            type="button"
                                            class="thumbnail-button"
                                            @click="handleImagePreview(alert)"
                                        >
                                            <img
                                                :src="resolveAlarmImage(alert)"
                                                :alt="alert.alarmTypeName || alert.modelname || '告警图片'"
                                                class="thumbnail-image"
                                                loading="lazy"
                                                @error="handleImageError(alert)"
                                            />
                                            <span class="thumbnail-hint">点击查看</span>
                                        </button>
                                        <div v-else class="no-thumbnail">
                                            <span class="text-xs text-gray-400">无图片</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 自定义分页组件 - 放在表格底部 -->
                        <div class="custom-pagination">
                            <div class="pagination-info">
                                <span class="pagination-text">共 {{ totalCount }} 条</span>
                                <span class="pagination-divider">|</span>
                                <span class="pagination-text">每页</span>
                                <select v-model="pagination.pageSize" @change="handleSizeChange" class="pagination-select">
                                    <option :value="5">5</option>
                                    <option :value="10">10</option>
                                    <option :value="20">20</option>
                                    <option :value="50">50</option>
                                    <option :value="100">100</option>
                                </select>
                                <span class="pagination-text">条</span>
                            </div>
                            
                            <div class="pagination-controls">
                                <button 
                                    class="pagination-btn"
                                    :disabled="pagination.currentPage === 1 || loading"
                                    @click="handlePrevPage"
                                >
                                    <span>‹</span>
                                </button>
                                
                                <div class="pagination-pages">
                                    <button
                                        v-for="page in visiblePages"
                                        :key="page"
                                        class="pagination-page"
                                        :class="{ active: page === pagination.currentPage, ellipsis: page === '...' }"
                                        :disabled="page === '...' || loading"
                                        @click="page !== '...' && handlePageChange(page)"
                                    >
                                        {{ page }}
                                    </button>
                                </div>
                                
                                <button 
                                    class="pagination-btn"
                                    :disabled="pagination.currentPage >= totalPages || loading"
                                    @click="handleNextPage"
                                >
                                    <span>›</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="empty-state">
                        <span>暂无告警数据</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue';
import { getAlarmCameraListAll } from '@/api/datav/cockpit';

const props = defineProps({
    buildingData: {
        type: Object,
        default: () => ({})
    }
});

const loading = ref(false);
const alertsList = ref([]);
const pagination = ref({
    currentPage: 1,
    pageSize: 5
});
const statusFilter = ref('');

const STATUS_LABEL_MAP = {
    0: '未处理',
    1: '已处理',
    2: '误报'
};

const resolveDeviceId = () => props.buildingData?.deviceId || props.buildingData?.device_id || props.buildingData?.id;
const resolveChannelId = () => props.buildingData?.channelId || props.buildingData?.channel_id;

const formatStatusText = (status) => {
    if (status === null || status === undefined) return '-';
    return STATUS_LABEL_MAP[status] ?? status ?? '-';
};

const getStatusClass = (status) => {
    const statusMap = {
        '未处理': 'status-active',
        '已处理': 'status-inactive',
        '误报': 'status-warning'
    };
    return statusMap[status] || 'status-default';
};

const formatStatusClass = (status) => getStatusClass(formatStatusText(status));

const fetchAlertsList = async () => {
    const deviceId = resolveDeviceId();
    if (!deviceId) {
        alertsList.value = [];
        return;
    }

    loading.value = true;
    try {
        const params = {
            page: 1,
            pageSize: 999,
            deviceId: String(deviceId)
        };

        const channelId = resolveChannelId();
        if (channelId) {
            params.channelId = String(channelId);
        }

        const result = await getAlarmCameraListAll(params);

        if (result.code !== 0 && result.code !== '0' && result.code !== 200) {
            throw new Error(result.msg || '获取告警数据失败');
        }

        const rawList = Array.isArray(result.data?.list)
            ? result.data.list
            : Array.isArray(result.data?.records)
                ? result.data.records
                : Array.isArray(result.data)
                    ? result.data
                    : Array.isArray(result.list)
                        ? result.list
                        : [];

        alertsList.value = rawList;
        pagination.value.currentPage = 1;
    } catch (error) {
        console.error('AlertListTab: 获取告警数据失败:', error);
        alertsList.value = [];
    } finally {
        loading.value = false;
    }
};

const filteredAlerts = computed(() => {
    if (!statusFilter.value) {
        return alertsList.value;
    }
    return alertsList.value.filter((alert) => formatStatusText(alert.status) === statusFilter.value);
});

const totalCount = computed(() => filteredAlerts.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pagination.value.pageSize)));

const paginatedAlerts = computed(() => {
    const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    return filteredAlerts.value.slice(start, end);
});

const visiblePages = computed(() => {
    const current = pagination.value.currentPage;
    const total = totalPages.value;
    const pages = [];

    if (total <= 7) {
        for (let i = 1; i <= total; i += 1) {
            pages.push(i);
        }
        return pages;
    }

    if (current <= 3) {
        for (let i = 1; i <= 5; i += 1) {
            pages.push(i);
        }
        pages.push('...');
        pages.push(total);
        return pages;
    }

    if (current >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i += 1) {
            pages.push(i);
        }
        return pages;
    }

    pages.push(1);
    pages.push('...');
    for (let i = current - 1; i <= current + 1; i += 1) {
        pages.push(i);
    }
    pages.push('...');
    pages.push(total);
    return pages;
});

const handleStatusFilterChange = () => {
    pagination.value.currentPage = 1;
};

watch(totalCount, (count) => {
    const pages = Math.max(1, Math.ceil(count / pagination.value.pageSize));
    if (pagination.value.currentPage > pages) {
        pagination.value.currentPage = 1;
    }
});

const getAlertTypeColor = (alertType) => {
    const colorMap = {
        鼠患检测: 'text-red-400',
        厨师帽检测: 'text-blue-400',
        手套检测: 'text-green-400',
        厨师服检测: 'text-purple-400'
    };
    return colorMap[alertType] || 'text-gray-400';
};

const handleSizeChange = () => {
    pagination.value.currentPage = 1;
};

const resolveAlarmImage = (alert) => {
    if (!alert) return '';
    const candidates = [alert.alarmImg];
    const url = candidates.find((item) => typeof item === 'string' && item.trim().length);
    return url || '';
};

const handleImageError = (alert) => {
    if (alert) {
        alert._imageError = true;
    }
};

const handleImagePreview = (alert) => {
    const url = resolveAlarmImage(alert);
    if (!url) return;
    window.open(url, '_blank');
};

const handlePageChange = (page) => {
    if (page !== '...' && page >= 1 && page <= totalPages.value) {
        pagination.value.currentPage = page;
    }
};

const handlePrevPage = () => {
    if (pagination.value.currentPage > 1) {
        pagination.value.currentPage -= 1;
    }
};

const handleNextPage = () => {
    if (pagination.value.currentPage < totalPages.value) {
        pagination.value.currentPage += 1;
    }
};

watch(
    () => [resolveDeviceId(), resolveChannelId()],
    () => {
        statusFilter.value = '';
        pagination.value.currentPage = 1;
        fetchAlertsList();
    },
    { immediate: true }
);
</script>

<style scoped>
/* 琛ㄦ牸鐩稿叧鏍峰紡 */
.tab-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    overflow: hidden;
    position: relative;
}

.table-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: visible;
    position: relative;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(20, 50, 120, 0.4) 0%, rgba(25, 55, 125, 0.6) 100%);
    border: 1px solid rgba(0, 149, 255, 0.3);
    border-radius: 8px 8px 0 0;
    margin-bottom: 1px;
    flex-shrink: 0;
}

.section-icon {
    font-size: 24px;
    filter: drop-shadow(0 0 5px rgba(0, 254, 255, 0.5));
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #00feff;
    text-shadow: 0 0 8px rgba(0, 254, 255, 0.4);
}

.tenant-count {
    font-size: 14px;
    color: rgba(0, 254, 255, 0.7);
    background: rgba(0, 149, 255, 0.1);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(0, 149, 255, 0.3);
}

.filter-item {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
}

.filter-label {
    font-size: 14px;
    color: rgba(0, 254, 255, 0.8);
    white-space: nowrap;
}

.filter-select {
    background: rgba(20, 50, 120, 0.6);
    border: 1px solid rgba(0, 149, 255, 0.4);
    border-radius: 4px;
    padding: 4px 8px;
    color: #00feff;
    font-size: 12px;
    outline: none;
    transition: all 0.3s ease;
}

.filter-select:focus {
    border-color: rgba(0, 254, 255, 0.8);
    box-shadow: 0 0 8px rgba(0, 149, 255, 0.3);
}

.filter-select option {
    background: rgba(20, 50, 120, 0.9);
    color: #00feff;
}

.table-container {
    flex: 1;
    background: rgba(20, 50, 120, 0.2);
    border: 1px solid rgba(0, 149, 255, 0.3);
    border-radius: 0;
    overflow: hidden;
    min-height: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 0;
}

.table-loading,
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    gap: 12px;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(0, 254, 255, 0.2);
    border-top-color: #00feff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.custom-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
    height: 100%;
}

.table-head {
    display: grid;
    grid-template-columns: 140px 180px 170px 1fr 120px 140px;
    background: linear-gradient(135deg, rgba(20, 50, 120, 0.8), rgba(25, 55, 125, 0.9));
    border-bottom: 1px solid rgba(0, 149, 255, 0.3);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 10;
}

.th {
    padding: 12px 16px;
    font-weight: 600;
    color: #00feff;
    text-align: left;
}

.table-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
}

.table-row {
    display: grid;
    grid-template-columns: 140px 180px 170px 1fr 120px 140px;
    padding: 12px 16px;
    align-items: center;
    border-bottom: 1px solid rgba(0, 149, 255, 0.1);
    background: rgba(20, 50, 120, 0.25);
    transition: background 0.2s ease;
}

.table-row:hover {
    background: rgba(0, 149, 255, 0.12);
}

.td {
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(255, 255, 255, 0.9);
    min-height: 40px;
}

.type-badge {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    border: 1px solid currentColor;
    color: #9ca3af;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 90px;
    text-align: center;
}

.cell-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(255, 255, 255, 0.85);
}

/* 鐘舵€佸窘绔犳牱寮?*/
.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    border: 1px solid;
    display: inline-block;
    min-width: 60px;
    text-shadow: 0 0 4px currentColor;
}

.status-active {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    border-color: rgba(255, 107, 107, 0.4);
}

.status-warning {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border-color: rgba(255, 193, 7, 0.4);
}

.status-inactive {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
    border-color: rgba(76, 175, 80, 0.4);
}

.status-default {
    background: rgba(158, 158, 158, 0.2);
    color: #9e9e9e;
    border-color: rgba(158, 158, 158, 0.3);
}

.level-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    border: 1px solid;
    display: inline-block;
    min-width: 40px;
    text-shadow: 0 0 4px currentColor;
}

/* 鑷畾涔夊垎椤电粍浠舵牱寮?*/
.custom-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(20, 50, 120, 0.5) 0%, rgba(25, 55, 125, 0.7) 100%);
    border-top: 1px solid rgba(0, 149, 255, 0.4);
    flex-shrink: 0;
    min-height: 60px;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    z-index: 5;
}

.pagination-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(0, 254, 255, 0.8);
    font-size: 13px;
}

.pagination-text {
    color: rgba(0, 254, 255, 0.8);
    font-size: 13px;
}

.pagination-divider {
    color: rgba(0, 149, 255, 0.5);
    margin: 0 4px;
}

.pagination-select {
    background: rgba(20, 50, 120, 0.6);
    border: 1px solid rgba(0, 149, 255, 0.4);
    border-radius: 4px;
    padding: 4px 8px;
    color: #00feff;
    font-size: 12px;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 60px;
}

.pagination-select:hover {
    border-color: rgba(0, 254, 255, 0.6);
    background: rgba(20, 50, 120, 0.8);
}

.pagination-select:focus {
    border-color: rgba(0, 254, 255, 0.8);
    box-shadow: 0 0 8px rgba(0, 149, 255, 0.3);
}

.pagination-select option {
    background: rgba(20, 50, 120, 0.9);
    color: #00feff;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

.pagination-btn {
    background: rgba(20, 50, 120, 0.6);
    border: 1px solid rgba(0, 149, 255, 0.4);
    border-radius: 4px;
    color: rgba(0, 254, 255, 0.8);
    font-size: 18px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    line-height: 1;
}

.pagination-btn:hover:not(:disabled) {
    background: rgba(0, 149, 255, 0.3);
    border-color: rgba(0, 254, 255, 0.6);
    color: #00feff;
    box-shadow: 0 0 8px rgba(0, 149, 255, 0.4);
    transform: scale(1.05);
}

.pagination-btn:disabled {
    background: rgba(20, 50, 120, 0.3);
    border-color: rgba(0, 149, 255, 0.2);
    color: rgba(0, 254, 255, 0.3);
    cursor: not-allowed;
    opacity: 0.5;
}

.pagination-pages {
    display: flex;
    align-items: center;
    gap: 4px;
}

.pagination-page {
    background: rgba(20, 50, 120, 0.6);
    border: 1px solid rgba(0, 149, 255, 0.4);
    border-radius: 4px;
    color: rgba(0, 254, 255, 0.8);
    font-size: 13px;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0 8px;
}

.pagination-page:hover:not(:disabled):not(.ellipsis) {
    background: rgba(0, 149, 255, 0.3);
    border-color: rgba(0, 254, 255, 0.6);
    color: #00feff;
    box-shadow: 0 0 8px rgba(0, 149, 255, 0.4);
}

.pagination-page.active {
    background: linear-gradient(135deg, rgba(0, 149, 255, 0.5) 0%, rgba(0, 254, 255, 0.4) 100%);
    border-color: rgba(0, 254, 255, 0.8);
    color: #00feff;
    box-shadow: 0 0 12px rgba(0, 149, 255, 0.6);
    text-shadow: 0 0 6px rgba(0, 254, 255, 0.8);
    font-weight: 600;
}

.pagination-page.ellipsis {
    cursor: default;
    border: none;
    background: transparent;
    color: rgba(0, 254, 255, 0.5);
}

.pagination-page:disabled {
    cursor: not-allowed;
}

/* 鍛婅鎻忚堪鏍峰紡 */
.alert-description {
    color: rgba(0, 254, 255, 0.8);
    font-size: 13px;
    line-height: 1.4;
    max-width: 200px;
    word-wrap: break-word;
    text-align: left;
}

/* 缂╃暐鍥炬牱寮?*/
.thumbnail-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
}

.thumbnail-button {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    border: 1px solid rgba(0, 149, 255, 0.4);
    overflow: hidden;
    padding: 0;
    background: rgba(20, 50, 120, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.thumbnail-button:hover {
    border-color: rgba(0, 254, 255, 0.7);
    box-shadow: 0 0 12px rgba(0, 149, 255, 0.4);
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.thumbnail-hint {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 2px 4px;
    font-size: 10px;
    color: #00feff;
    background: linear-gradient(180deg, transparent, rgba(0, 29, 88, 0.8));
    text-align: center;
    letter-spacing: 1px;
    pointer-events: none;
    text-transform: uppercase;
}

.no-thumbnail {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(20, 50, 120, 0.3);
    border: 1px dashed rgba(0, 149, 255, 0.3);
    border-radius: 4px;
    color: rgba(0, 254, 255, 0.5);
}
</style>





