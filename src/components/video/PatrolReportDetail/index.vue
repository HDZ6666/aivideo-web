<template>
  <el-dialog v-model="open" title="巡检报告" width="70%" append-to-body>
    <el-descriptions :column="4" border>
      <el-descriptions-item label="报告编号">{{ report.reportId }}</el-descriptions-item>
      <el-descriptions-item label="任务名称">{{ report.taskName }}</el-descriptions-item>
      <el-descriptions-item label="生成时间">{{ report.createTime }}</el-descriptions-item>
      <el-descriptions-item label="报告状态">{{ report.reportStatusStr }}</el-descriptions-item>
      <el-descriptions-item label="巡检总结" :span="4">{{ report.summarize }}</el-descriptions-item>
    </el-descriptions>
    <el-table :data="report.detailList || []" style="width: 100%; margin-top: 16px" header-row-class-name="table-header">
      <el-table-column type="index" label="序号" width="70" align="center" />
      <el-table-column prop="cameraName" label="摄像头名称" min-width="180" show-overflow-tooltip />
      <el-table-column label="巡检抓拍图片" width="160" align="center">
        <template #default="{ row }">
          <el-image
            v-if="row.imageUrl"
            :src="row.imageUrl"
            :preview-src-list="[row.imageUrl]"
            :z-index="4000"
            fit="cover"
            class="report-image"
            preview-teleported
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="告警名称" min-width="160" align="center">
        <template #default="{ row }">
          <el-tag :type="row.alarmName ? 'danger' : 'success'">{{ row.alarmName || '无告警' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="alarmTime" label="告警时间" min-width="160" align="center" />
    </el-table>
    <template #footer>
      <el-button @click="open = false">关闭</el-button>
      <el-button type="primary" icon="Download" @click="exportReport">导出报告</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import request from '@/utils/video/request'

const open = ref(false)
const report = reactive({})

function openDialog(row) {
  Object.keys(report).forEach((key) => delete report[key])
  Object.assign(report, row || {})
  open.value = true
}

function exportReport() {
  request({
    method: 'get',
    url: '/api/patrol/report/download',
    params: {
      reportId: report.reportId
    }
  }).then((res) => {
    const link = document.createElement('a')
    link.href = res.data
    link.download = `巡检报告_${report.reportId}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.report-image {
  width: 100px;
  height: 75px;
}
</style>
