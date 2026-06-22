<template>
  <div class="app-container video-patrol-report-page">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item label="日期" prop="filterDate">
        <el-date-picker v-model="queryParams.filterDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 180px" />
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="queryParams.taskName" placeholder="请输入任务名称" clearable style="width: 200px" @keyup.enter="applyFilter" />
      </el-form-item>
      <el-form-item label="摄像头" prop="selectedCameras">
        <el-input v-model="queryParams.selectedCameras" placeholder="请输入摄像头名称" clearable style="width: 200px" @keyup.enter="applyFilter" />
      </el-form-item>
      <el-form-item label="异常" prop="abnormality">
        <el-select v-model="queryParams.abnormality" placeholder="是否异常" clearable style="width: 140px">
          <el-option label="正常" value="正常" />
          <el-option label="异常" value="异常" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="applyFilter">查询</el-button>
        <el-button icon="Refresh" @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="exportList">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="getReportList">刷新</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getReportList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="filteredReportList" style="width: 100%" header-row-class-name="table-header">
      <el-table-column prop="reportId" label="报告编号" width="100" align="center" />
      <el-table-column prop="taskName" label="任务名称" min-width="150" show-overflow-tooltip />
      <el-table-column label="选择的摄像头" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover" width="360">
            <template #reference>
              <el-link type="primary" :underline="false">{{ getFirstCamera(row.selectedCameras) }}</el-link>
            </template>
            <div class="pre-wrap">{{ row.selectedCameras }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="报告生成时间" min-width="180" align="center" />
      <el-table-column prop="reportStatusStr" label="报告状态" width="130" align="center" />
      <el-table-column label="是否异常" width="100" align="center">
        <template #default="{ row }">
          <span :class="{ 'is-danger': row.abnormalityStr === '异常' }">{{ row.abnormalityStr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡逻报告" width="150" align="center" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="查看报告" placement="top">
            <el-button link type="primary" icon="Document" @click="viewReport(row)" />
          </el-tooltip>
          <el-tooltip content="导出报告" placement="top">
            <el-button link type="primary" icon="Download" @click="exportReport(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="pager.pageNum"
      v-model:limit="pager.pageSize"
      :page-sizes="[15, 30, 50]"
      @pagination="getReportList"
    />

    <PatrolReportDetail ref="reportDetailRef" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import request from '@/utils/video/request'
import PatrolReportDetail from '@/components/video/PatrolReportDetail/index.vue'

const queryRef = ref(null)
const reportDetailRef = ref(null)
const showSearch = ref(true)
const loading = ref(false)
const reportList = ref([])
const filteredReportList = ref([])
const total = ref(0)
const pager = reactive({
  pageNum: 1,
  pageSize: 15
})
const queryParams = reactive({
  filterDate: '',
  taskName: '',
  selectedCameras: '',
  abnormality: ''
})

onMounted(() => {
  getReportList()
})

function getReportList() {
  loading.value = true
  request({
    method: 'get',
    url: '/api/patrol/report/list',
    params: {
      page: pager.pageNum,
      count: pager.pageSize
    }
  })
    .then((res) => {
      total.value = res.data?.total || 0
      reportList.value = res.data?.list || []
      applyFilter()
    })
    .finally(() => {
      loading.value = false
    })
}

function applyFilter() {
  filteredReportList.value = reportList.value.filter((report) => {
    const dateMatch = !queryParams.filterDate || String(report.createTime || '').split(' ')[0] === queryParams.filterDate
    const taskNameMatch = !queryParams.taskName || String(report.taskName || '').toLowerCase().includes(queryParams.taskName.toLowerCase())
    const cameraMatch =
      !queryParams.selectedCameras ||
      String(report.selectedCameras || '').toLowerCase().includes(queryParams.selectedCameras.toLowerCase())
    const abnormalityMatch = !queryParams.abnormality || report.abnormalityStr === queryParams.abnormality
    return dateMatch && taskNameMatch && cameraMatch && abnormalityMatch
  })
}

function resetFilter() {
  queryRef.value?.resetFields()
  queryParams.filterDate = ''
  queryParams.taskName = ''
  queryParams.selectedCameras = ''
  queryParams.abnormality = ''
  applyFilter()
}

function exportList() {
  const csv = reportListToCsv(filteredReportList.value)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reportList_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function reportListToCsv(list) {
  const header = ['报告编号', '任务名称', '选择的摄像头', '报告生成时间', '是否异常']
  const rows = list.map((report) => [
    report.reportId,
    report.taskName,
    escapeCsv(report.selectedCameras),
    report.createTime,
    report.abnormalityStr
  ])
  return [header.join(','), ...rows.map((row) => row.join(','))].join('\n')
}

function escapeCsv(value) {
  const text = String(value ?? '')
  if (/[,"\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function viewReport(row) {
  reportDetailRef.value?.openDialog(row)
}

function exportReport(row) {
  request({
    method: 'get',
    url: '/api/patrol/report/download',
    params: {
      reportId: row.reportId
    }
  }).then((res) => {
    const link = document.createElement('a')
    link.href = res.data
    link.download = `巡检报告_${row.reportId}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

function getFirstCamera(value) {
  return String(value || '').split(',')[0] || '-'
}
</script>

<style scoped>
.pre-wrap {
  white-space: pre-wrap;
  word-break: break-all;
}

.is-danger {
  color: var(--el-color-danger);
}

.video-patrol-report-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
