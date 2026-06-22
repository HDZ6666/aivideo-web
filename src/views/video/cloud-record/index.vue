<template>
  <div class="app-container video-cloud-record-page">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item label="关键字" prop="query">
        <el-input v-model="queryParams.query" placeholder="请输入应用名/流ID/文件名" clearable style="width: 240px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="开始时间"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="结束时间"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="流媒体" prop="mediaServerId">
        <el-select v-model="queryParams.mediaServerId" placeholder="流媒体" clearable style="width: 200px">
          <el-option v-for="item in mediaServerList" :key="item.id" :label="item.id" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="getRecordList">刷新</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getRecordList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" style="width: 100%" header-row-class-name="table-header">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="app" label="应用名" min-width="110" show-overflow-tooltip />
      <el-table-column prop="stream" label="流ID" min-width="240" show-overflow-tooltip />
      <el-table-column label="开始时间" min-width="160" align="center">
        <template #default="{ row }">{{ formatTimestamp(row.startTime) }}</template>
      </el-table-column>
      <el-table-column label="结束时间" min-width="160" align="center">
        <template #default="{ row }">{{ formatTimestamp(row.endTime) }}</template>
      </el-table-column>
      <el-table-column label="时长" width="110" align="center">
        <template #default="{ row }">
          <el-tag>{{ formatDuration(row.timeLen) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="文件名称" min-width="220" show-overflow-tooltip />
      <el-table-column prop="mediaServerId" label="流媒体" min-width="120" align="center" />
      <el-table-column label="操作" align="center" width="150" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="播放" placement="top">
            <el-button link type="primary" icon="VideoPlay" @click="play(row)" />
          </el-tooltip>
          <el-tooltip content="详情" placement="top">
            <el-button link type="primary" icon="Document" @click="showDetail(row)" />
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
      @pagination="getRecordList"
    />

    <el-dialog v-model="playerOpen" :title="playerTitle" width="760px" append-to-body destroy-on-close @closed="videoUrl = ''">
      <div class="cloud-record-player">
        <StreamPlayer :url="videoUrl" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/video/request'
import StreamPlayer from '@/components/video/StreamPlayer/index.vue'

const router = useRouter()
const queryRef = ref(null)
const showSearch = ref(true)
const loading = ref(false)
const recordList = ref([])
const total = ref(0)
const mediaServerList = ref([])
const playerOpen = ref(false)
const playerTitle = ref('云端录像')
const videoUrl = ref('')
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15,
  query: '',
  startTime: '',
  endTime: '',
  mediaServerId: ''
})

onMounted(() => {
  initData()
})

function initData() {
  getMediaServerList()
  getRecordList()
}

function getMediaServerList() {
  request({
    method: 'get',
    url: '/api/server/media_server/online/list'
  }).then((res) => {
    mediaServerList.value = res.data || []
  })
}

function getRecordList() {
  loading.value = true
  request({
    method: 'get',
    url: '/api/cloud/record/list',
    params: {
      app: '',
      stream: '',
      query: queryParams.query,
      startTime: queryParams.startTime,
      endTime: queryParams.endTime,
      mediaServerId: queryParams.mediaServerId,
      page: queryParams.pageNum,
      count: queryParams.pageSize
    }
  })
    .then((res) => {
      total.value = res.data?.total || 0
      recordList.value = res.data?.list || []
    })
    .finally(() => {
      loading.value = false
    })
}

function handleQuery() {
  queryParams.pageNum = 1
  getRecordList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.query = ''
  queryParams.startTime = ''
  queryParams.endTime = ''
  queryParams.mediaServerId = ''
  handleQuery()
}

function play(row) {
  playerTitle.value = `${row.app || '-'} / ${row.stream || '-'}`
  playerOpen.value = true
  request({
    method: 'get',
    url: '/api/cloud/record/play/path',
    params: {
      recordId: row.id
    }
  }).then((res) => {
    const data = res.data || {}
    videoUrl.value = window.location.protocol === 'https:' ? data.httpsPath || data.httpPath : data.httpPath || data.httpsPath
  })
}

function showDetail(row) {
  router.push({
    path: '/video/cloud-record-detail',
    query: {
      app: row.app,
      stream: row.stream,
      mediaServerId: row.mediaServerId
    }
  })
}

function formatTimestamp(value) {
  if (!value) return '-'
  const date = new Date(Number(value) * 1000)
  if (Number.isNaN(date.getTime())) return value
  return formatDate(date)
}

function formatDuration(value) {
  const seconds = Number(value) || 0
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.ceil(seconds % 60)
  return `${h > 0 ? `${h}小时` : ''}${m > 0 ? `${m}分` : ''}${s}秒`
}

function formatDate(date) {
  const pad = (num) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
</script>

<style scoped>
.cloud-record-player {
  width: 100%;
  height: 430px;
  background: #000;
}

.video-cloud-record-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
