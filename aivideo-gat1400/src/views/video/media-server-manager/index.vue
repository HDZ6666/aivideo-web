<template>
  <div class="app-container video-media-server-page">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="add">添加节点</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="getServerList">刷新</el-button>
      </el-col>
      <right-toolbar :show-search="false" @queryTable="getServerList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mediaServerList" style="width: 100%" header-row-class-name="table-header">
      <el-table-column prop="id" label="节点ID" min-width="160" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP" min-width="140" />
      <el-table-column prop="streamIp" label="流IP" min-width="140" />
      <el-table-column prop="httpPort" label="HTTP端口" width="100" align="center" />
      <el-table-column prop="rtmpPort" label="RTMP端口" width="100" align="center" />
      <el-table-column prop="rtspPort" label="RTSP端口" width="100" align="center" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.status">在线</el-tag>
          <el-tag v-else type="info">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="默认节点" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.defaultServer">默认</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="160" align="center" />
      <el-table-column label="操作" align="center" width="130" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip :content="row.defaultServer ? '查看' : '编辑'" placement="top">
            <el-button link type="primary" icon="Edit" @click="edit(row)" />
          </el-tooltip>
          <el-tooltip v-if="!row.defaultServer" content="移除" placement="top">
            <el-button link type="danger" icon="Delete" @click="del(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <MediaServerEdit ref="mediaServerEditRef" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/video/request'
import MediaServerEdit from '@/components/video/MediaServerEdit/index.vue'

const mediaServerEditRef = ref(null)
const loading = ref(false)
const mediaServerList = ref([])

onMounted(() => {
  getServerList()
})

function getServerList(showLoading = true) {
  if (showLoading) {
    loading.value = true
  }
  request({ method: 'get', url: '/api/server/media_server/list' })
    .then((res) => {
      mediaServerList.value = res.data || []
    })
    .finally(() => {
      if (showLoading) {
        loading.value = false
      }
    })
}

function add() {
  mediaServerEditRef.value?.openDialog(null, getServerList)
}

function edit(row) {
  mediaServerEditRef.value?.openDialog(row, getServerList)
}

function del(row) {
  ElMessageBox.confirm('确认删除此节点？', '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: '/api/server/media_server/delete',
        params: { id: row.id }
      })
    )
    .then(() => {
      ElMessage.success('删除成功')
      getServerList()
    })
    .catch(() => {})
}
</script>
