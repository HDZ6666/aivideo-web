<template>
  <div class="app-container video-device-inspection-page">
    <el-alert
      class="inspection-tip"
      title="一键巡检默认巡检所有通道；如需巡检指定设备，请勾选设备后点击批量巡检。操作耗时较长，请耐心等待。"
      type="warning"
      :closable="false"
      show-icon
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Finished" :disabled="multipleSelection.length < 2" @click="handleBatchInspection">
          批量巡检
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="MagicStick" @click="handleAllInspection">一键巡检</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="getDeviceInspection">刷新</el-button>
      </el-col>
      <right-toolbar :show-search="false" @queryTable="getDeviceInspection"></right-toolbar>
    </el-row>

    <el-table
      ref="inspectionTableRef"
      v-loading="loading"
      :data="deviceList"
      row-key="deviceId"
      style="width: 100%"
      header-row-class-name="table-header"
      @selection-change="multipleSelection = $event"
    >
      <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
      <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="deviceId" label="设备编号" min-width="200" show-overflow-tooltip />
      <el-table-column label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="statusDescribe" label="状态信息" min-width="220" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="最新巡检时间" min-width="170" align="center" />
      <el-table-column label="操作" width="100" align="center" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="巡检" placement="top">
            <el-button link type="primary" icon="View" @click="handleInspection([row.deviceId])" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :page-sizes="[15, 25, 35, 50]"
      @pagination="getDeviceInspection"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/video/request'

const loading = ref(false)
const deviceList = ref([])
const total = ref(0)
const multipleSelection = ref([])
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15
})

onMounted(() => {
  getDeviceInspection()
})

function getDeviceInspection(showLoading = true) {
  if (showLoading) {
    loading.value = true
  }
  request({
    method: 'get',
    url: '/ai/api/device/inspection/devices',
    params: {
      page: queryParams.pageNum,
      count: queryParams.pageSize,
      groupId: 0
    }
  })
    .then((res) => {
      total.value = res.data?.total || 0
      deviceList.value = res.data?.list || []
    })
    .finally(() => {
      if (showLoading) {
        loading.value = false
      }
    })
}

function handleBatchInspection() {
  if (multipleSelection.value.length < 2) {
    ElMessage.warning('请选择至少两个设备')
    return
  }

  ElMessageBox.confirm(
    `此操作将在后台巡检选中的 ${multipleSelection.value.length} 个设备，比较耗时，请确认。`,
    '批量巡检',
    { type: 'warning' }
  ).then(() => {
    handleInspection(multipleSelection.value.map((item) => item.deviceId))
  })
}

function handleAllInspection() {
  ElMessageBox.confirm('此操作将在后台巡检所有设备，比较耗时，请确认。', '一键巡检', {
    type: 'warning'
  }).then(() => {
    handleInspection()
  })
}

function handleInspection(list = []) {
  const url =
    list.length > 0
      ? '/ai/api/device/inspection/devices/inspection/status'
      : '/ai/api/device/inspection/devices/inspection/all'

  loading.value = true
  request({
    method: 'post',
    url,
    data: list
  })
    .then(() => {
      ElMessage.success('巡检任务已启动，请稍后查看结果')
    })
    .finally(() => {
      loading.value = false
    })
}

function getStatusType(status) {
  if (status === 0) return 'success'
  if (status === 1) return 'warning'
  if (status === 2) return 'danger'
  return 'info'
}

function getStatusText(status) {
  if (status === 0) return '正常'
  if (status === 1) return '告警'
  if (status === 2) return '异常'
  return '未知'
}
</script>

<style scoped>
.inspection-tip {
  margin-bottom: 12px;
}
</style>
