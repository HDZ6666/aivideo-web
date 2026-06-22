<template>
  <div class="app-container video-patrol-manager-page">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="addTask">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="getTaskList">刷新</el-button>
      </el-col>
      <right-toolbar :show-search="false" @queryTable="getTaskList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" style="width: 100%" header-row-class-name="table-header">
      <el-table-column prop="taskId" label="任务编号" width="90" align="center" />
      <el-table-column prop="taskName" label="任务名称" min-width="130" show-overflow-tooltip />
      <el-table-column label="所选摄像头" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover" width="360">
            <template #reference>
              <el-link type="primary" :underline="false">{{ getFirstCamera(row.selectedCameras) }}</el-link>
            </template>
            <div class="pre-wrap">{{ row.selectedCameras }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期" width="110" align="center" />
      <el-table-column prop="endDate" label="结束日期" width="110" align="center" />
      <el-table-column label="时间段" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <el-popover placement="top" trigger="hover" width="380">
            <template #reference>
              <el-link type="primary" :underline="false">{{ getFirstTime(row.selectedHours) }}</el-link>
            </template>
            <div class="pre-wrap">{{ row.selectedHours }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center" />
      <el-table-column label="任务状态" width="140" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.taskStatusSwitch"
            :active-text="getTaskStatusText(row, 'active')"
            :inactive-text="getTaskStatusText(row, 'inactive')"
            @change="handleTaskStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="editTask(row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="danger" icon="Delete" @click="deleteTask(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :page-sizes="[10, 20, 50]"
      @pagination="getTaskList"
    />

    <PatrolTaskAdd ref="taskAddRef" @success="getTaskList" />
    <PatrolTaskEdit ref="taskEditRef" @success="getTaskList" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/video/request'
import PatrolTaskAdd from '@/components/video/PatrolTaskAdd/index.vue'
import PatrolTaskEdit from '@/components/video/PatrolTaskEdit/index.vue'

const taskAddRef = ref(null)
const taskEditRef = ref(null)
const loading = ref(false)
const taskList = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})

onMounted(() => {
  getTaskList()
})

function getTaskList() {
  loading.value = true
  request({
    method: 'get',
    url: '/api/patrol/route_task/list',
    params: {
      page: queryParams.pageNum,
      count: queryParams.pageSize
    }
  })
    .then((res) => {
      total.value = res.data?.total || 0
      taskList.value = (res.data?.list || []).map((item) => ({
        ...item,
        taskStatusSwitch: item.taskStatus === 1,
        isUnlimited: item.isUnlimited === 'true' || item.isUnlimited
      }))
    })
    .finally(() => {
      loading.value = false
    })
}

function addTask() {
  if (total.value >= 10) {
    ElMessage.warning('任务配置数量已超过10条，请删除部分任务后再新增')
    return
  }
  taskAddRef.value?.openDialog()
}

function editTask(row) {
  if (row.taskStatus === 1) {
    ElMessage.warning('任务处于启动状态，不能编辑')
    return
  }
  taskEditRef.value?.openDialog(row)
}

function deleteTask(row) {
  if (row.taskStatus === 1) {
    ElMessage.warning('任务处于启动状态，不能删除')
    return
  }
  ElMessageBox.confirm('确认删除该任务吗？', '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: '/api/patrol/route_task/del',
        params: { taskId: row.taskId }
      })
    )
    .then(() => {
      ElMessage.success('删除成功')
      getTaskList()
    })
    .catch(() => {})
}

function handleTaskStatusChange(row) {
  const isRestart = getTaskStatusText(row, 'active') === '重启'
  if (isRestart && row.taskStatusSwitch) {
    row.taskStatusSwitch = false
    taskEditRef.value?.openDialog(row)
    return
  }
  if (row.taskStatusSwitch && new Date().getTime() > new Date(row.endDate).getTime()) {
    ElMessage.warning('当前日期大于任务结束日期，无法启用任务')
    row.taskStatusSwitch = false
    return
  }
  const newStatus = row.taskStatusSwitch ? 1 : 0
  request({
    method: 'post',
    url: '/api/patrol/route_task/edit_task_status',
    data: {
      taskId: row.taskId,
      taskStatus: newStatus
    }
  }).then(() => {
    ElMessage.success('任务状态修改成功')
    getTaskList()
  })
}

function getTaskStatusText(row, status) {
  const currentDate = formatDay(new Date())
  if (new Date(currentDate) > new Date(row.endDate)) {
    return status === 'active' ? '重启' : '结束'
  }
  return status === 'active' ? '启用' : '停用'
}

function getFirstCamera(value) {
  return String(value || '').split(',')[0] || '-'
}

function getFirstTime(value) {
  return String(value || '').split('\n')[0] || '-'
}

function formatDay(date) {
  const pad = (num) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
</script>

<style scoped>
.pre-wrap {
  white-space: pre-wrap;
  word-break: break-all;
}

.video-patrol-manager-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
