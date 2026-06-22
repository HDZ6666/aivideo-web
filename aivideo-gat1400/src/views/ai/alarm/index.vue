<template>
  <div class="app-container ai-alarm-page">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          style="width: 220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择状态" style="width: 150px">
          <el-option v-for="item in ALARM_STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="告警类型" prop="alarm_type_name">
        <el-select
          v-model="queryParams.alarm_type_name"
          clearable
          filterable
          placeholder="请选择告警类型"
          style="width: 180px"
        >
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 260px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>告警列表</span>
          <el-space>
            <template v-if="showCheckBox">
              <el-checkbox
                :model-value="checkAll"
                :indeterminate="indeterminate"
                :disabled="untreatedList.length === 0"
                @change="handleCheckAll"
              >
                全选
              </el-checkbox>
              <el-button :disabled="checkedList.length === 0" @click="batchVisible = true">批量处理</el-button>
              <el-button type="primary" @click="cancelBatch">取消</el-button>
            </template>
            <el-button v-else type="primary" @click="showCheckBox = true">编辑</el-button>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
          </el-space>
        </div>
      </template>

      <div v-loading="loading" min-height="420px">
        <el-empty v-if="tableData.length === 0" description="暂无告警" />
        <el-checkbox-group v-else v-model="checkedList">
          <el-row :gutter="16">
            <el-col v-for="item in tableData" :key="item.id" :xs="24" :sm="12" :lg="6" class="alarm-col">
              <div class="alarm-card-wrap">
                <el-checkbox
                  v-if="showCheckBox && item.status === 0"
                  class="alarm-checkbox"
                  :label="item.id"
                >
                  &nbsp;
                </el-checkbox>
                <el-card shadow="hover" class="alarm-card" @click="openDetail(item)">
                  <img :src="toImageUrl(item.alarmImg)" class="alarm-image" />
                  <div class="alarm-body">
                    <div class="alarm-title" :title="item.deviceName">{{ item.deviceName || '-' }}</div>
                    <div class="alarm-meta">告警ID：{{ item.id }}</div>
                    <div class="alarm-meta">{{ item.createTime || item.alarmTime }}</div>
                    <div class="alarm-tags">
                      <el-tag>{{ item.modelname || '-' }}</el-tag>
                      <el-tag :type="getStatusOption(item.status).type">{{ getStatusOption(item.status).label }}</el-tag>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </div>

      <pagination
        v-show="total > 0"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        :total="total"
        :page-sizes="[8, 20, 40, 100]"
        @pagination="getList"
      />
    </el-card>

    <AlarmDetailDialog v-model="detailVisible" :alarm-item="currentAlarm" @handled="getList" />

    <el-dialog v-model="batchVisible" title="批量处理" width="520px">
      <p>是否批量处理 <strong class="danger-text">{{ checkedList.length }}</strong> 条告警事件？</p>
      <p>告警ID为：{{ checkedList.join(', ') }}</p>
      <template #footer>
        <el-button @click="batchVisible = false">取消</el-button>
        <el-button type="warning" :loading="batchLoading" @click="batchHandle(2)">误报</el-button>
        <el-button type="primary" :loading="batchLoading" @click="batchHandle(1)">处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { batchHandleAlarm, listAlarm } from '@/api/ai/alarm'
import { listCategory } from '@/api/ai/category'
import { ALARM_STATUS_OPTIONS, normalizeList, toImageUrl } from '../utils'
import AlarmDetailDialog from './components/AlarmDetailDialog.vue'

const queryRef = ref()
const showSearch = ref(true)
const showCheckBox = ref(false)
const loading = ref(false)
const batchLoading = ref(false)
const batchVisible = ref(false)
const detailVisible = ref(false)
const tableData = ref([])
const total = ref(0)
const checkedList = ref([])
const currentAlarm = ref()
const dateRange = ref([])
const categoryOptions = ref([])
const queryParams = reactive({
  page: 1,
  pageSize: 8,
  status: undefined,
  deviceName: undefined,
  alarm_type_name: undefined,
  startTime: undefined,
  endTime: undefined
})

const untreatedList = computed(() => tableData.value.filter((item) => item.status === 0))
const checkAll = computed(() => untreatedList.value.length > 0 && checkedList.value.length === untreatedList.value.length)
const indeterminate = computed(() => checkedList.value.length > 0 && !checkAll.value)

function getList() {
  loading.value = true
  listAlarm(queryParams).then((res) => {
    const data = normalizeList(res)
    tableData.value = data.list
    total.value = data.total
    checkedList.value = []
  }).finally(() => {
    loading.value = false
  })
}

function getCategories() {
  listCategory({
    page: 1,
    pageSize: 1000
  }).then((res) => {
    const data = normalizeList(res)
    categoryOptions.value = [...new Set(data.list.filter((item) => item.isUse === 1).map((item) => item.alarmTypeName))]
  })
}

function handleQuery() {
  queryParams.page = 1
  if (Array.isArray(dateRange.value) && dateRange.value.length === 2) {
    queryParams.startTime = `${dateRange.value[0]} 00:00:00`
    queryParams.endTime = `${dateRange.value[1]} 23:59:59`
  } else {
    queryParams.startTime = undefined
    queryParams.endTime = undefined
  }
  getList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  dateRange.value = []
  queryParams.startTime = undefined
  queryParams.endTime = undefined
  handleQuery()
}

function handleCheckAll(checked) {
  checkedList.value = checked ? untreatedList.value.map((item) => item.id) : []
}

function cancelBatch() {
  showCheckBox.value = false
  checkedList.value = []
}

function openDetail(item) {
  if (showCheckBox.value) return
  currentAlarm.value = item
  detailVisible.value = true
}

function batchHandle(status) {
  if (checkedList.value.length === 0) {
    ElMessage.warning('请至少选择一个告警事件')
    return
  }
  batchLoading.value = true
  batchHandleAlarm({
    alarmIds: checkedList.value,
    status
  }).then(() => {
    ElMessage.success('操作成功')
    batchVisible.value = false
    showCheckBox.value = false
    getList()
  }).finally(() => {
    batchLoading.value = false
  })
}

function getStatusOption(status) {
  return ALARM_STATUS_OPTIONS.find((item) => item.value === Number(status)) || ALARM_STATUS_OPTIONS[0]
}

getCategories()
getList()
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alarm-col {
  margin-bottom: 16px;
}

.alarm-card-wrap {
  position: relative;
}

.alarm-checkbox {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 2;
}

.alarm-card {
  cursor: pointer;
}

.alarm-card :deep(.el-card__body) {
  padding: 0;
}

.alarm-image {
  display: block;
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #000;
}

.alarm-body {
  padding: 10px;
}

.alarm-title {
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 6px;
}

.alarm-meta {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 6px;
}

.alarm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.danger-text {
  color: var(--el-color-danger);
}
</style>

