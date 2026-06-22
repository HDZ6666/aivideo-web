<template>
  <div class="app-container video-push-list-page">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item label="关键字" prop="query">
        <el-input v-model="queryParams.query" placeholder="请输入名称/应用/流ID" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="流媒体" prop="mediaServerId">
        <el-select v-model="queryParams.mediaServerId" placeholder="流媒体" clearable style="width: 200px">
          <el-option v-for="item in mediaServerList" :key="item.id" :label="item.id" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="推流状态" prop="pushing">
        <el-select v-model="queryParams.pushing" placeholder="推流状态" clearable style="width: 180px">
          <el-option label="推流进行中" value="true" />
          <el-option label="推流未进行" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="addStream">添加通道</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multipleSelection.length === 0" @click="batchDel">批量移除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Upload" @click="importChannel">通道导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download">
          <a class="template-link" href="/static/file/推流通道导入.zip" download="推流通道导入.zip">下载模板</a>
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="refresh">刷新</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getPushList"></right-toolbar>
    </el-row>

    <el-table
      ref="pushTableRef"
      v-loading="loading"
      :data="pushList"
      style="width: 100%"
      row-key="stream"
      header-row-class-name="table-header"
      @selection-change="multipleSelection = $event"
    >
      <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
      <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="app" label="APP" min-width="120" show-overflow-tooltip />
      <el-table-column prop="stream" label="流ID" min-width="170" show-overflow-tooltip />
      <el-table-column prop="gbId" label="国标编码" min-width="180" show-overflow-tooltip />
      <el-table-column prop="mediaServerId" label="流媒体" min-width="120" align="center" />
      <el-table-column prop="pushTime" label="开始时间" min-width="160" align="center" />
      <el-table-column label="正在推流" width="100" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.pushIng">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="本平台推流" width="110" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.pushIng && row.self">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="播放" placement="top">
            <el-button v-if="row.pushIng" link type="primary" icon="VideoPlay" @click="playPush(row)" />
          </el-tooltip>
          <el-tooltip content="移除" placement="top">
            <el-button link type="danger" icon="Delete" @click="stopPush(row)" />
          </el-tooltip>
          <el-tooltip :content="row.gbId ? '移出国标' : '加入国标'" placement="top">
            <el-button link type="primary" icon="Position" @click="row.gbId ? removeFromGB(row) : addToGB(row)" />
          </el-tooltip>
          <el-tooltip content="云端录像" placement="top">
            <el-button link type="primary" icon="Cloudy" @click="queryCloudRecords(row)" />
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
      @pagination="getPushList"
    />

    <DevicePlayer ref="devicePlayerRef" />
    <PushStreamEdit ref="pushStreamEditRef" />
    <ImportChannel ref="importChannelRef" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import request from '@/utils/video/request'
import DevicePlayer from '@/components/video/DevicePlayer/index.vue'
import PushStreamEdit from '@/components/video/PushStreamEdit/index.vue'
import ImportChannel from '@/components/video/ImportChannel/index.vue'

const router = useRouter()
const queryRef = ref(null)
const pushTableRef = ref(null)
const devicePlayerRef = ref(null)
const pushStreamEditRef = ref(null)
const importChannelRef = ref(null)
const showSearch = ref(true)
const loading = ref(false)
const pushList = ref([])
const total = ref(0)
const mediaServerList = ref([])
const multipleSelection = ref([])
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15,
  query: '',
  pushing: '',
  mediaServerId: ''
})

onMounted(() => {
  initData()
})

function initData() {
  getMediaServerList()
  getPushList()
}

function getMediaServerList() {
  request({ method: 'get', url: '/api/server/media_server/online/list' }).then((res) => {
    mediaServerList.value = res.data || []
  })
}

function getPushList(showLoading = true) {
  if (showLoading) {
    loading.value = true
  }
  request({
    method: 'get',
    url: '/api/push/list',
    params: {
      page: queryParams.pageNum,
      count: queryParams.pageSize,
      query: queryParams.query,
      pushing: queryParams.pushing,
      mediaServerId: queryParams.mediaServerId
    }
  })
    .then((res) => {
      total.value = res.data?.total || 0
      pushList.value = res.data?.list || []
    })
    .finally(() => {
      if (showLoading) {
        loading.value = false
      }
    })
}

function handleQuery() {
  queryParams.pageNum = 1
  getPushList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.query = ''
  queryParams.pushing = ''
  queryParams.mediaServerId = ''
  handleQuery()
}

function playPush(row) {
  request({
    method: 'get',
    url: '/api/push/getPlayUrl',
    params: {
      app: row.app,
      stream: row.stream,
      mediaServerId: row.mediaServerId
    }
  }).then((res) => {
    devicePlayerRef.value?.openDialog('streamPlay', null, null, {
      streamInfo: res.data,
      hasAudio: true
    })
  })
}

function stopPush(row) {
  request({
    method: 'post',
    url: '/api/push/stop',
    params: {
      app: row.app,
      streamId: row.stream
    }
  }).then(initData)
}

function addToGB(row) {
  pushStreamEditRef.value?.openDialog(
    {
      app: row.app,
      stream: row.stream,
      mediaServerId: row.mediaServerId,
      name: row.name
    },
    initData
  )
}

function removeFromGB(row) {
  request({
    method: 'delete',
    url: '/api/push/remove_form_gb',
    data: row
  }).then(initData)
}

function queryCloudRecords(row) {
  router.push({
    path: '/video/cloud-record-detail',
    query: {
      app: row.app,
      stream: row.stream
    }
  })
}

function addStream() {
  pushStreamEditRef.value?.openDialog(null, initData)
}

function batchDel() {
  ElMessageBox.confirm(`确定删除选中的 ${multipleSelection.value.length} 个通道？`, '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: '/api/push/batchStop',
        data: {
          gbStreams: multipleSelection.value
        }
      })
    )
    .then(() => {
      initData()
      pushTableRef.value?.clearSelection()
    })
    .catch(() => {})
}

function importChannel() {
  importChannelRef.value?.openDialog(getPushList)
}

function refresh() {
  initData()
}
</script>

<style scoped>
.template-link {
  color: inherit;
  text-decoration: none;
}

.video-push-list-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
