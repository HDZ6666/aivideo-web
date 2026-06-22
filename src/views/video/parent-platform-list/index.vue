<template>
  <div class="app-container video-platform-page">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="addParentPlatform">添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="refresh">刷新</el-button>
      </el-col>
      <right-toolbar :show-search="false" @queryTable="getPlatformList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="platformList" style="width: 100%" header-row-class-name="table-header">
      <el-table-column prop="name" label="名称" min-width="130" show-overflow-tooltip />
      <el-table-column prop="serverGBId" label="平台编号" min-width="190" show-overflow-tooltip />
      <el-table-column label="启用" width="90" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.enable">已启用</el-tag>
          <el-tag v-else type="info">未启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.status">在线</el-tag>
          <el-tag v-else type="info">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="150" align="center">
        <template #default="{ row }">
          <el-tag>{{ row.serverIP }}:{{ row.serverPort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="deviceGBId" label="设备国标编号" min-width="190" show-overflow-tooltip />
      <el-table-column prop="transport" label="信令传输" width="100" align="center" />
      <el-table-column prop="channelCount" label="通道数" width="90" align="center" />
      <el-table-column label="订阅信息" width="130" align="center">
        <template #default="{ row }">
          <div class="subscribe-icons">
            <el-tooltip content="报警订阅" placement="top">
              <el-icon class="subscribe-icon" :class="row.alarmSubscribe ? 'subscribe-on' : 'subscribe-off'">
                <Bell />
              </el-icon>
            </el-tooltip>
            <el-tooltip content="目录订阅" placement="top">
              <el-icon class="subscribe-icon" :class="row.catalogSubscribe ? 'subscribe-on' : 'subscribe-off'">
                <Tickets />
              </el-icon>
            </el-tooltip>
            <el-tooltip content="位置订阅" placement="top">
              <el-icon class="subscribe-icon" :class="row.mobilePositionSubscribe ? 'subscribe-on' : 'subscribe-off'">
                <Location />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="editPlatform(row)" />
          </el-tooltip>
          <el-tooltip content="选择通道" placement="top">
            <el-button link type="primary" icon="Share" @click="chooseChannel(row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="danger" icon="Delete" @click="deletePlatform(row)" />
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
      @pagination="getPlatformList"
    />

    <PlatformEdit ref="platformEditRef" />
    <ChooseChannel ref="chooseChannelRef" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Bell, Location, Tickets } from '@element-plus/icons-vue'
import request from '@/utils/video/request'
import PlatformEdit from '@/components/video/PlatformEdit/index.vue'
import ChooseChannel from '@/components/video/ChooseChannel/index.vue'

const platformEditRef = ref(null)
const chooseChannelRef = ref(null)
const loading = ref(false)
const platformList = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15
})

onMounted(() => {
  getPlatformList()
})

function addParentPlatform() {
  platformEditRef.value?.openDialog(null, getPlatformList)
}

function editPlatform(platform) {
  platformEditRef.value?.openDialog(platform, getPlatformList)
}

function deletePlatform(platform) {
  ElMessageBox.confirm('确认删除？', '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: `/api/platform/delete/${platform.serverGBId}`
      })
    )
    .then(() => {
      ElMessage.success('删除成功')
      getPlatformList()
    })
    .catch(() => {})
}

function chooseChannel(platform) {
  chooseChannelRef.value?.openDialog(
    platform.serverGBId,
    platform.deviceGBId,
    platform.name,
    platform.catalogId,
    getPlatformList
  )
}

function getPlatformList(showLoading = true) {
  if (showLoading) {
    loading.value = true
  }
  request({
    method: 'get',
    url: `/api/platform/query/${queryParams.pageSize}/${queryParams.pageNum}`
  })
    .then((res) => {
      total.value = res.data?.total || 0
      platformList.value = res.data?.list || []
    })
    .finally(() => {
      if (showLoading) {
        loading.value = false
      }
    })
}

function refresh() {
  getPlatformList()
}
</script>

<style scoped>
.video-platform-page :deep(.pagination-container) {
  margin-top: 8px;
}

.subscribe-icons {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.subscribe-icon {
  font-size: 20px;
  cursor: default;
}

.subscribe-on {
  color: #409eff;
}

.subscribe-off {
  color: #afafb3;
}
</style>
