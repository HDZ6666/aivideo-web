<template>
  <div class="app-container video-stream-proxy-page">
    <el-row :gutter="20">
      <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
        <pane size="16">
          <el-col>
            <DeviceGroupList ref="deviceGroupRef" @change-group="changeGroup" />
          </el-col>
        </pane>
        <pane size="84">
          <el-col>
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item label="在线状态" prop="online">
                <el-select v-model="queryParams.online" placeholder="在线状态" clearable style="width: 180px">
                  <el-option label="在线" value="true" />
                  <el-option label="离线" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="addStreamProxy">添加代理</el-button>
              </el-col>
              <el-col v-if="false" :span="1.5">
                <el-button type="primary" plain icon="Search" @click="addOnvif">搜索 ONVIF</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="info" plain icon="Refresh" :loading="loading" @click="refresh">刷新</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getStreamProxyList"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="streamProxyList" style="width: 100%" header-row-class-name="table-header">
              <el-table-column prop="name" label="名称" min-width="130" show-overflow-tooltip />
              <el-table-column prop="app" label="流应用名" min-width="120" show-overflow-tooltip />
              <el-table-column prop="stream" label="流ID" min-width="140" show-overflow-tooltip />
              <el-table-column label="流地址" min-width="260" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-link type="primary" :underline="false" @click="copy(row.type === 'default' ? row.url : row.srcUrl)">
                    {{ row.type === 'default' ? row.url : row.srcUrl }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="mediaServerId" label="流媒体" min-width="120" align="center" />
              <el-table-column label="类型" width="110" align="center">
                <template #default="{ row }">
                  <el-tag>{{ row.type === 'default' ? '直接代理' : 'FFMPEG代理' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="gbId" label="国标编码" min-width="160" show-overflow-tooltip />
              <el-table-column label="状态" width="90" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.status">在线</el-tag>
                  <el-tag v-else type="info">离线</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="启用" width="90" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.enable">已启用</el-tag>
                  <el-tag v-else type="info">未启用</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" min-width="150" show-overflow-tooltip />
              <el-table-column label="操作" align="center" width="260" fixed="right" class-name="small-padding fixed-width">
                <template #default="{ row }">
                  <el-tooltip content="播放" placement="top">
                    <el-button v-if="row.enable" link type="primary" icon="VideoPlay" @click="play(row)" />
                  </el-tooltip>
                  <el-tooltip :content="row.enable ? '停用' : '启用'" placement="top">
                    <el-button link type="primary" :icon="row.enable ? 'SwitchButton' : 'Check'" :loading="row.startBtnLoading" @click="row.enable ? stop(row) : start(row)" />
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top">
                    <el-button link type="primary" icon="Edit" @click="editStreamProxy(row)" />
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button link type="danger" icon="Delete" @click="deleteStreamProxy(row)" />
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
              @pagination="getStreamProxyList"
            />
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <StreamProxyEdit ref="streamProxyEditRef" />
    <OnvifEdit ref="onvifEditRef" />
    <DevicePlayer ref="devicePlayerRef" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import useAppStore from '@/store/modules/app'
import request from '@/utils/video/request'
import DeviceGroupList from '@/components/video/DeviceGroupList/index.vue'
import DevicePlayer from '@/components/video/DevicePlayer/index.vue'
import StreamProxyEdit from '@/components/video/StreamProxyEdit/index.vue'
import OnvifEdit from '@/components/video/OnvifEdit/index.vue'

const router = useRouter()
const appStore = useAppStore()
const queryRef = ref(null)
const deviceGroupRef = ref(null)
const streamProxyEditRef = ref(null)
const onvifEditRef = ref(null)
const devicePlayerRef = ref(null)
const showSearch = ref(true)
const loading = ref(false)
const streamProxyList = ref([])
const total = ref(0)
const groupId = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15,
  online: ''
})

onMounted(() => {
  getStreamProxyList()
})

function getStreamProxyList(showLoading = true) {
  if (showLoading) {
    loading.value = true
  }
  request({
    method: 'get',
    url: '/ai/api/device/queryManager/list',
    params: {
      page: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      categoryId: groupId.value,
      online: queryParams.online
    }
  })
    .then((res) => {
      total.value = res.data?.total || 0
      streamProxyList.value = (res.data?.list || []).map((item) => ({ ...item, startBtnLoading: false }))
    })
    .finally(() => {
      if (showLoading) {
        loading.value = false
      }
    })
}

function handleQuery() {
  queryParams.pageNum = 1
  getStreamProxyList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.online = ''
  handleQuery()
}

function addStreamProxy() {
  streamProxyEditRef.value?.openDialog(null, getStreamProxyList, 'add', deviceGroupRef.value?.getGroup?.() || [])
}

function editStreamProxy(row) {
  streamProxyEditRef.value?.openDialog(row, getStreamProxyList, 'edit', deviceGroupRef.value?.getGroup?.() || [])
}

function addOnvif() {
  request({
    method: 'get',
    url: '/api/onvif/search',
    params: {
      timeout: 3000
    }
  }).then((res) => {
    const list = res.data || []
    if (!list.length) {
      ElMessage.success('未找到可用设备')
      return
    }

    onvifEditRef.value?.openDialog(list, (url) => {
      if (!url) return
      streamProxyEditRef.value?.openDialog(
        {
          type: 'default',
          url,
          srcUrl: url
        },
        getStreamProxyList,
        'add',
        deviceGroupRef.value?.getGroup?.() || []
      )
    })
  })
}

function play(row) {
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

function deleteStreamProxy(row) {
  ElMessageBox.confirm('确定删除此代理吗？', '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: '/api/proxy/del',
        params: {
          app: row.app,
          stream: row.stream
        }
      })
    )
    .then(getStreamProxyList)
    .catch(() => {})
}

function start(row) {
  row.startBtnLoading = true
  request({
    method: 'get',
    url: '/api/proxy/start',
    params: {
      app: row.app,
      stream: row.stream
    }
  })
    .then(getStreamProxyList)
    .finally(() => {
      row.startBtnLoading = false
    })
}

function stop(row) {
  request({
    method: 'get',
    url: '/api/proxy/stop',
    params: {
      app: row.app,
      stream: row.stream
    }
  }).then(getStreamProxyList)
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

function changeGroup(group) {
  groupId.value = group.id
  handleQuery()
}

function copy(value) {
  if (!value) return
  navigator.clipboard?.writeText(value)
  ElMessage.success('已复制到剪贴板')
}

function refresh() {
  getStreamProxyList()
}
</script>

<style scoped>
.video-stream-proxy-page :deep(.splitpanes__pane) {
  min-width: 0;
}

.video-stream-proxy-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
