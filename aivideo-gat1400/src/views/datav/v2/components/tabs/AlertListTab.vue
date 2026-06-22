<template>
  <div class="tab-pane">
    <div class="table-section">
      <div class="section-header">
        <span class="section-icon">🚨</span>
        <span class="section-title">门店告警列表</span>
        <span class="tenant-count">共 {{ totalCount }} 条告警</span>

        <div class="filter-item">
          <label class="filter-label">状态筛选：</label>
          <select v-model="statusFilter" @change="handleStatusFilterChange" class="filter-select">
            <option value="">全部状态</option>
            <option value="待处理">待处理</option>
            <option value="处理中">处理中</option>
            <option value="已处理">已处理</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <el-table
          :data="paginatedAlerts"
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-background="rgba(20, 50, 120, 0.8)"
          element-loading-spinner="el-icon-loading"
          class="tenant-table"
          height="100%"
          empty-text="暂无告警数据"
        >
          <el-table-column prop="alertType" label="告警类型" min-width="120" align="center">
            <template #default="{ row }">
              <div class="alert-type-cell">
                <div class="alert-type-dot" :class="getAlertTypeColor(row.alertType)"></div>
                <span class="alert-type-text" :class="getAlertTypeStyle(row.alertType)">
                  {{ row.alertType }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="deviceName" label="设备名称" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.deviceName || "-" }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="alertTime" label="告警时间" min-width="160" align="center">
            <template #default="{ row }">
              <span>{{ row.alertTime || "-" }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="description" label="告警描述" min-width="200" align="left">
            <template #default="{ row }">
              <span class="alert-description">{{ row.description || "-" }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="处理状态" min-width="100" align="center">
            <template #default="{ row }">
              <span class="status-badge" :class="getStatusClass(row.status)">
                {{ row.status }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="thumbnail" label="告警缩略图" min-width="120" align="center">
            <template #default="{ row }">
              <div class="thumbnail-container">
                <el-image
                  v-if="row.thumbnail"
                  :src="row.thumbnail"
                  :alt="row.alertType"
                  class="alert-thumbnail"
                  fit="cover"
                  :preview-src-list="[row.thumbnail]"
                  :z-index="4000"
                  :initial-index="0"
                  preview-teleported
                  hide-on-click-modal
                />
                <div v-else class="no-thumbnail">
                  <span class="no-thumbnail__text">无图片</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="totalCount"
          :disabled="loading"
          layout="total, prev, pager, next"
          class="tenant-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, watch, onMounted } from "vue";
import { alertTableMockData } from "../../alarmMockData";

const props = defineProps({
  buildingData: {
    type: Object,
    default: () => ({}),
  },
});

const loading = ref(false);
const alertsList = ref([]);

const pagination = ref({
  currentPage: 1,
  pageSize: 5,
  total: 0,
});

const statusFilter = ref("");

const alertTypeColorMap = {
  老鼠识别: "alert-type-dot--danger",
  垃圾桶满溢: "alert-type-dot--warning",
  厨师服和口罩: "alert-type-dot--info",
  未佩戴厨师帽: "alert-type-dot--danger",
};

const alertTypeStyleMap = {
  老鼠识别: "alert-type-text--danger",
  垃圾桶满溢: "alert-type-text--warning",
  厨师服和口罩: "alert-type-text--info",
  未佩戴厨师帽: "alert-type-text--danger",
};

const statusClassMap = {
  待处理: "status-active",
  未处理: "status-active",
  处理中: "status-warning",
  已处理: "status-inactive",
};

const filteredAlerts = computed(() => {
  if (!statusFilter.value) {
    return alertsList.value;
  }
  return alertsList.value.filter((alert) => alert.status === statusFilter.value);
});

const totalCount = computed(() => filteredAlerts.value.length);

const paginatedAlerts = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredAlerts.value.slice(start, end);
});

const getAlertTypeColor = (alertType) => {
  return alertTypeColorMap[alertType] || "alert-type-dot--default";
};

const getAlertTypeStyle = (alertType) => {
  return alertTypeStyleMap[alertType] || "alert-type-text--default";
};

const getStatusClass = (status) => {
  return statusClassMap[status] || "status-default";
};

const handleStatusFilterChange = () => {
  pagination.value.currentPage = 1;
};

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page;
};

const handleSizeChange = (size) => {
  pagination.value.pageSize = size;
  pagination.value.currentPage = 1;
};

const fetchAlertsList = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  alertsList.value = [...alertTableMockData];
  pagination.value.total = alertsList.value.length;
  loading.value = false;
};

watch(
  () => props.buildingData,
  () => {
    pagination.value.currentPage = 1;
    fetchAlertsList();
  },
  { deep: true }
);

watch(totalCount, (count) => {
  pagination.value.total = count;
  const maxPage = Math.max(1, Math.ceil(count / pagination.value.pageSize));
  if (pagination.value.currentPage > maxPage) {
    pagination.value.currentPage = maxPage;
  }
});

onMounted(() => {
  fetchAlertsList();
});
</script>
<style lang="scss" scoped>
.tab-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
}

.table-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
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

.alert-type-cell {
    display: flex;
    align-items: center;
    justify-content: center;
}

.alert-type-dot {
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 50%;
    box-shadow: 0 0 8px currentColor;
}

.alert-type-dot--danger {
    color: #f87171;
    background: #f87171;
}

.alert-type-dot--info {
    color: #60a5fa;
    background: #60a5fa;
}

.alert-type-dot--success {
    color: #4ade80;
    background: #4ade80;
}

.alert-type-dot--warning {
    color: #c084fc;
    background: #c084fc;
}

.alert-type-dot--default {
    color: #9ca3af;
    background: #9ca3af;
}

.alert-type-text {
    font-size: 14px;
    font-weight: 500;
}

.alert-type-text--danger {
    color: #fca5a5;
}

.alert-type-text--info {
    color: #93c5fd;
}

.alert-type-text--success {
    color: #86efac;
}

.alert-type-text--warning {
    color: #d8b4fe;
}

.alert-type-text--default {
    color: #d1d5db;
}

.table-container {
    flex: 1;
    background: rgba(20, 50, 120, 0.2);
    border: 1px solid rgba(0, 149, 255, 0.3);
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    min-height: 0;
}

.tenant-table {
    width: 100%;
    height: 100%;
}

.tenant-table :deep(.el-table) {
    background: transparent !important;
    color: rgba(255, 255, 255, 0.9) !important;
    --el-table-border-color: rgba(0, 149, 255, 0.2);
    --el-table-header-bg-color: transparent;
    --el-table-tr-bg-color: rgba(20, 50, 120, 0.2);
    --el-table-row-hover-bg-color: rgba(0, 149, 255, 0.1);
}

.tenant-table :deep(.el-table__inner-wrapper),
.tenant-table :deep(.el-table__header),
.tenant-table :deep(.el-table__body),
.tenant-table :deep(.el-scrollbar__view),
.tenant-table :deep(.el-table__empty-block),
.tenant-table :deep(.el-table__empty-text),
.tenant-table :deep(.el-table__cell) {
    background: transparent !important;
}

.tenant-table :deep(.el-table--border .el-table__inner-wrapper:after) {
    height: 0px !important;
}

.tenant-table :deep(.el-table__header-wrapper) {
    background: linear-gradient(135deg,
            rgba(20, 50, 120, 0.8) 0%,
            rgba(25, 55, 125, 0.9) 100%) !important;
}

.tenant-table :deep(.el-table__header) {
    background: transparent !important;
}

.tenant-table :deep(.el-table__header th) {
    background: rgba(20, 50, 120, 1) !important;
    color: #00feff !important;
    font-weight: 600 !important;
    border-bottom: 2px solid rgba(0, 149, 255, 0.3) !important;
    border-right: 1px solid rgba(0, 149, 255, 0.2) !important;
    padding: 12px 8px !important;
}

.tenant-table :deep(.el-table__header th:last-child) {
    border-right: none !important;
}

.tenant-table :deep(.el-table__body-wrapper) {
    background: transparent !important;
}

.tenant-table :deep(.el-table__body) {
    background: transparent !important;
}

.tenant-table :deep(.el-table__row) {
    background: rgba(20, 50, 120) !important;
    color: rgba(255, 255, 255, 0.9) !important;
    transition: all 0.3s ease !important;
}

.tenant-table :deep(.el-table__row--striped) {
    background: rgba(25, 55, 125, 0.3) !important;
}

.tenant-table :deep(.el-table__row:hover) {
    background: rgba(2, 7, 11, 0.35) !important;
    transform: scale(1.01) !important;
}

.tenant-table :deep(.el-table__body tr:hover>td.el-table__cell) {
    background: rgba(0, 149, 255, 0.1) !important;
    transform: scale(1.01) !important;
}


.tenant-table :deep(.el-table__row td) {
    border-bottom: 1px solid rgba(0, 149, 255, 0.1) !important;
    border-right: 1px solid rgba(0, 149, 255, 0.1) !important;
    padding: 10px 8px !important;
}

.tenant-table :deep(.el-table__row td:last-child) {
    border-right: none !important;
}

.tenant-table :deep(.el-table__border-left-patch) {
    background: transparent !important;
}

.tenant-table :deep(.el-table__border-right-patch) {
    background: transparent !important;
}

.tenant-table :deep(.el-table__empty-text) {
    color: rgba(255, 255, 255, 0.5) !important;
}

.tenant-table :deep(.el-loading-mask) {
    background-color: rgba(20, 50, 120, 0.8) !important;
}

.tenant-table :deep(.el-loading-text) {
    color: #00feff !important;
}

.tenant-table :deep(.el-table--fit .el-table__inner-wrapper:before) {
    width: 0px !important;
}
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
.pagination-wrapper {
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(20, 50, 120, 0.3) 0%, rgba(25, 55, 125, 0.5) 100%);
    border: 1px solid rgba(0, 149, 255, 0.3);
    border-top: none;
    border-radius: 0 0 8px 8px;
    display: flex;
    justify-content: center;
}

:deep(.tenant-pagination) {
    background: transparent !important;
}

:deep(.tenant-pagination .el-pagination__total) {
    color: rgba(0, 254, 255, 0.8) !important;
    font-size: 12px !important;
}

:deep(.tenant-pagination .el-pager li) {
    background: rgba(20, 50, 120, 0.4) !important;
    border: 1px solid rgba(0, 149, 255, 0.3) !important;
    color: rgba(0, 254, 255, 0.8) !important;
    margin: 0 2px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    min-width: 28px !important;
    height: 28px !important;
    line-height: 26px !important;
    transition: all 0.3s ease !important;
}

:deep(.tenant-pagination .el-pager li:hover) {
    background: rgba(0, 149, 255, 0.2) !important;
    border-color: rgba(0, 254, 255, 0.6) !important;
    color: #00feff !important;
    box-shadow: 0 0 8px rgba(0, 149, 255, 0.4) !important;
}

:deep(.tenant-pagination .el-pager li.is-active) {
    background: linear-gradient(135deg, rgba(0, 149, 255, 0.4) 0%, rgba(0, 254, 255, 0.3) 100%) !important;
    border-color: rgba(0, 254, 255, 0.8) !important;
    color: #00feff !important;
    box-shadow: 0 0 12px rgba(0, 149, 255, 0.6) !important;
    text-shadow: 0 0 6px rgba(0, 254, 255, 0.8) !important;
}

:deep(.tenant-pagination .btn-prev),
:deep(.tenant-pagination .btn-next) {
    background: rgba(20, 50, 120, 0.4) !important;
    border: 1px solid rgba(0, 149, 255, 0.3) !important;
    color: rgba(0, 254, 255, 0.8) !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    width: 28px !important;
    height: 28px !important;
    transition: all 0.3s ease !important;
}

:deep(.tenant-pagination .btn-prev:hover),
:deep(.tenant-pagination .btn-next:hover) {
    background: rgba(0, 149, 255, 0.2) !important;
    border-color: rgba(0, 254, 255, 0.6) !important;
    color: #00feff !important;
    box-shadow: 0 0 8px rgba(0, 149, 255, 0.4) !important;
}

:deep(.tenant-pagination .btn-prev:disabled),
:deep(.tenant-pagination .btn-next:disabled) {
    background: rgba(20, 50, 120, 0.2) !important;
    border-color: rgba(0, 149, 255, 0.1) !important;
    color: rgba(0, 254, 255, 0.3) !important;
    cursor: not-allowed !important;
}
.alert-description {
    color: rgba(0, 254, 255, 0.8);
    font-size: 13px;
    line-height: 1.4;
    max-width: 200px;
    word-wrap: break-word;
    text-align: left;
}
.thumbnail-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
}

.alert-thumbnail {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid rgba(0, 149, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
}

.alert-thumbnail:hover {
    border-color: rgba(0, 254, 255, 0.8);
    box-shadow: 0 0 8px rgba(0, 149, 255, 0.4);
    transform: scale(1.05);
}

.no-thumbnail {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(20, 50, 120, 0.3);
    border: 1px dashed rgba(0, 149, 255, 0.3);
    border-radius: 4px;
    color: rgba(0, 254, 255, 0.5);
}

.no-thumbnail__text {
    color: #9ca3af;
    font-size: 12px;
}
</style>
