<template>
  <div class="app-container video-channel-list-page">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch && !showTree" label-width="78px">
      <el-form-item label="关键字" prop="query">
        <el-input
          v-model="queryParams.query"
          placeholder="请输入通道编号/通道名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通道类型" prop="channelType">
        <el-select v-model="queryParams.channelType" placeholder="通道类型" clearable style="width: 180px">
          <el-option label="设备" value="false" />
          <el-option label="子目录" value="true" />
        </el-select>
      </el-form-item>
      <el-form-item label="在线状态" prop="online">
        <el-select v-model="queryParams.online" placeholder="在线状态" clearable style="width: 180px">
          <el-option label="在线" value="true" />
          <el-option label="离线" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="清晰度" prop="isSubStream">
        <el-select v-model="queryParams.isSubStream" placeholder="清晰度" style="width: 180px">
          <el-option label="原画" :value="false" />
          <el-option label="流畅" :value="true" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button icon="Back" plain @click="backToDeviceList">返回设备</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="getChannelList">刷新</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain :icon="showTree ? 'Tickets' : 'Share'" @click="showTree ? switchList() : switchTree()">
          {{ showTree ? '列表模式' : '树形模式' }}
        </el-button>
      </el-col>
      <el-col :span="1.5" v-if="isSubChannel">
        <el-button type="warning" plain icon="TopLeft" @click="backToRootChannel">返回根通道</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getChannelList"></right-toolbar>
    </el-row>

    <el-alert
      v-if="device"
      class="channel-device-tip"
      type="info"
      :closable="false"
      show-icon
      :title="`${device.name || '-'}（${deviceId || '-'}）`"
    />

    <div class="channel-main" :class="{ 'is-tree': showTree }">
      <div v-if="showTree" class="channel-tree-panel">
        <el-tree
          :key="channelTreeKey"
          ref="channelTreeRef"
          lazy
          node-key="id"
          :load="loadCatalogNode"
          :props="treeProps"
          highlight-current
          @node-click="handleTreeNodeClick"
        >
          <template #default="{ node, data }">
            <span class="channel-tree-node" :class="{ 'is-offline': data.online === false }">
              <el-icon v-if="data.nodeType === 'device'"><Monitor /></el-icon>
              <el-icon v-else-if="data.isLeaf"><VideoCameraFilled /></el-icon>
              <el-icon v-else><Folder /></el-icon>
              <span>{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>

      <div class="channel-table-panel">
        <el-table
          ref="channelTableRef"
          v-loading="loading"
          :data="channelList"
          style="width: 100%"
          header-row-class-name="table-header"
        >
      <el-table-column prop="channelId" label="通道编号" min-width="190" show-overflow-tooltip />
      <el-table-column prop="deviceId" label="设备编号" min-width="190" show-overflow-tooltip />
      <el-table-column label="通道名称" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <el-input v-if="row.edit" v-model="row.name" maxlength="255" show-word-limit clearable />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="快照" width="96" align="center">
        <template #default="{ row }">
          <el-image
            :src="getSnap(row)"
            :preview-src-list="[getSnap(row)]"
            :z-index="4000"
            fit="contain"
            preview-teleported
            class="channel-snap"
          >
            <template #error>
              <div class="channel-snap__error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="subCount" label="子节点数" width="100" align="center" />
      <el-table-column prop="manufacture" label="厂家" min-width="120" show-overflow-tooltip />
      <el-table-column label="位置信息" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          <el-input v-if="row.edit" v-model="row.location" placeholder="例：117.234,36.378" maxlength="30" clearable />
          <span v-else>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="云台类型" min-width="130" align="center">
        <template #default="{ row }">
          <el-select v-if="row.edit" v-model="row.PTZType" placeholder="云台类型" filterable style="width: 110px">
            <el-option v-for="(label, value) in ptzTypes" :key="value" :label="label" :value="value" />
          </el-select>
          <span v-else>{{ row.PTZTypeText || ptzTypes[String(row.PTZType)] || '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="音频" width="90" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.hasAudio" @change="updateChannel(row)" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.status === true || row.status === 1">在线</el-tag>
          <el-tag v-else type="info">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="310" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="播放" placement="top">
            <el-button link type="primary" icon="VideoPlay" :disabled="isDeviceOffline" @click="sendDevicePush(row)" />
          </el-tooltip>
          <el-tooltip content="停止" placement="top">
            <el-button
              link
              type="danger"
              icon="SwitchButton"
              :disabled="isDeviceOffline || !row.streamId"
              @click="stopDevicePush(row)"
            />
          </el-tooltip>
          <el-tooltip :content="row.edit ? '保存' : '编辑'" placement="top">
            <el-button link type="primary" :icon="row.edit ? 'Check' : 'Edit'" @click="row.edit ? handleSave(row) : handleEdit(row)" />
          </el-tooltip>
          <el-tooltip v-if="row.subCount > 0 || row.parental === 1" content="查看子通道" placement="top">
            <el-button link type="primary" icon="FolderOpened" @click="changeSubchannel(row)" />
          </el-tooltip>
          <el-tooltip content="设备录像" placement="top">
            <el-button link type="primary" icon="VideoCamera" :disabled="isDeviceOffline" @click="queryRecords(row)" />
          </el-tooltip>
          <el-tooltip content="云端录像" placement="top">
            <el-button link type="primary" icon="Cloudy" :disabled="isDeviceOffline" @click="queryCloudRecords(row)" />
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
          @pagination="getChannelList"
        />
      </div>
    </div>

    <DevicePlayer ref="devicePlayerRef" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Folder, Monitor, Picture, VideoCameraFilled } from '@element-plus/icons-vue'
import request, { VIDEO_API_BASE_URL } from '@/utils/video/request'
import DevicePlayer from '@/components/video/DevicePlayer/index.vue'

const route = useRoute()
const router = useRouter()

const queryRef = ref(null)
const channelTableRef = ref(null)
const channelTreeRef = ref(null)
const devicePlayerRef = ref(null)
const showSearch = ref(true)
const showTree = ref(false)
const channelTreeKey = ref(0)
const loading = ref(false)
const device = ref(null)
const channelList = ref([])
const total = ref(0)
const deviceId = ref('')
const parentChannelId = ref('0')
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15,
  query: '',
  online: '',
  channelType: '',
  isSubStream: false
})
const ptzTypes = {
  0: '未知',
  1: '球机',
  2: '半球',
  3: '固定枪机',
  4: '遥控枪机'
}
const treeProps = {
  label: 'name',
  isLeaf: 'isLeaf'
}

const isDeviceOffline = computed(() => {
  if (!device.value) return true
  return device.value.online === 0 || device.value.onLine === false
})

const isSubChannel = computed(() => {
  return !showTree.value && parentChannelId.value && parentChannelId.value !== '0'
})

watch(
  () => route.query,
  () => {
    initParam()
    initData()
  }
)

onMounted(() => {
  initParam()
  initData()
})

function initParam() {
  deviceId.value = route.query.deviceId || ''
  parentChannelId.value = String(route.query.parentChannelId ?? '0')
  queryParams.pageNum = 1
}

function initData() {
  if (!deviceId.value) {
    ElMessage.warning('缺少设备编号')
    return
  }
  getDevice()
  getChannelList()
}

function getDevice() {
  request({
    method: 'get',
    url: `/api/device/query/devices/${deviceId.value}`
  }).then((res) => {
    device.value = res.data || null
  })
}

function getChannelList() {
  if (!deviceId.value) return
  loading.value = true
  const isRoot = !parentChannelId.value || parentChannelId.value === '0'
  request({
    method: 'get',
    url: getChannelListUrl(isRoot),
    params: {
      page: queryParams.pageNum,
      count: queryParams.pageSize,
      query: queryParams.query,
      online: showTree.value ? '' : queryParams.online,
      channelType: showTree.value ? '' : queryParams.channelType,
      parentId: showTree.value ? (parentChannelId.value || deviceId.value) : undefined
    }
  })
    .then((res) => {
      const pageData = getPageData(res)
      total.value = pageData.total || 0
      channelList.value = (pageData.list || []).map(normalizeChannel)
      nextTick(() => channelTableRef.value?.doLayout?.())
    })
    .finally(() => {
      loading.value = false
    })
}

function getChannelListUrl(isRoot) {
  if (showTree.value) {
    return `/api/device/query/tree/channel/${deviceId.value}`
  }
  return isRoot
    ? `/api/device/query/devices/${deviceId.value}/channels`
    : `/api/device/query/sub_channels/${deviceId.value}/${parentChannelId.value}/channels`
}

function getPageData(res) {
  if (res?.data?.list || typeof res?.data?.total !== 'undefined') {
    return res.data
  }
  if (res?.list || typeof res?.total !== 'undefined') {
    return res
  }
  return { list: [], total: 0 }
}

function normalizeChannel(row) {
  const ptzType = row.PTZType ?? row.ptzType ?? 0
  return {
    ...row,
    PTZType: String(ptzType),
    PTZTypeText: row.PTZTypeText || ptzTypes[String(ptzType)] || '未知',
    edit: false,
    location: row.longitude && row.latitude ? `${row.longitude},${row.latitude}` : ''
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  getChannelList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.query = ''
  queryParams.online = ''
  queryParams.channelType = ''
  queryParams.isSubStream = false
  handleQuery()
}

function getSnap(row) {
  return `${VIDEO_API_BASE_URL}/api/device/query/snap/${row.deviceId}/${row.channelId}`
}

function sendDevicePush(row) {
  loading.value = true
  request({
    method: 'get',
    url: `/api/play/start/${deviceId.value}/${row.channelId}`,
    params: {
      isSubStream: queryParams.isSubStream
    }
  })
    .then((res) => {
      row.streamId = res.data?.stream
      devicePlayerRef.value?.openDialog('media', deviceId.value, row.channelId, {
        streamInfo: res.data,
        hasAudio: row.hasAudio
      })
      window.setTimeout(getChannelList, 1000)
    })
    .finally(() => {
      loading.value = false
    })
}

function stopDevicePush(row) {
  request({
    method: 'get',
    url: `/api/play/stop/${deviceId.value}/${row.channelId}`,
    params: {
      isSubStream: queryParams.isSubStream
    }
  }).finally(getChannelList)
}

function updateChannel(row) {
  request({
    method: 'post',
    url: `/api/device/query/channel/update/${deviceId.value}`,
    params: cleanChannelPayload(row)
  })
}

function handleEdit(row) {
  if (channelList.value.some((item) => item.edit)) {
    ElMessage.warning('请先保存当前编辑项')
    return
  }
  row.edit = true
}

function handleSave(row) {
  const payload = cleanChannelPayload(row)
  if (row.location) {
    const segments = row.location.split(',')
    if (segments.length !== 2 || Number.isNaN(Number(segments[0])) || Number.isNaN(Number(segments[1]))) {
      ElMessage.warning('位置信息格式有误，例：117.234,36.378')
      return
    }
    payload.longitude = Number(segments[0])
    payload.latitude = Number(segments[1])
  } else {
    delete payload.longitude
    delete payload.latitude
  }

  request({
    method: 'post',
    url: `/api/device/query/channel/update/${deviceId.value}`,
    params: payload
  }).then(() => {
    ElMessage.success('修改成功')
    getChannelList()
  })
}

function cleanChannelPayload(row) {
  const payload = { ...row }
  delete payload.edit
  delete payload.location
  Object.keys(payload).forEach((key) => {
    const value = payload[key]
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      delete payload[key]
    }
  })
  return payload
}

function switchTree() {
  showTree.value = true
  queryParams.pageNum = 1
  parentChannelId.value = deviceId.value
  channelTreeKey.value += 1
  getChannelList()
}

function switchList() {
  showTree.value = false
  queryParams.pageNum = 1
  parentChannelId.value = '0'
  getChannelList()
}

function loadCatalogNode(node, resolve) {
  if (node.level === 0) {
    resolve([buildDeviceTreeNode()])
    return
  }

  if (node.data?.isLeaf) {
    resolve([])
    return
  }

  const parentId = node.data?.userData?.channelId || node.data?.id || deviceId.value
  request({
    method: 'get',
    url: `/api/device/query/tree/${deviceId.value}`,
    params: {
      page: 1,
      count: 9999,
      parentId,
      onlyCatalog: true
    }
  })
    .then((res) => {
      const pageData = getPageData(res)
      resolve((pageData.list || []).map(buildChannelTreeNode))
    })
    .catch(() => {
      resolve([])
    })
}

function buildDeviceTreeNode() {
  const row = device.value || {}
  return {
    name: row.name || deviceId.value,
    id: deviceId.value,
    nodeType: 'device',
    isLeaf: false,
    online: row.online === 1 || row.onLine === true || row.online === true,
    userData: row
  }
}

function buildChannelTreeNode(item) {
  const basicData = item.basicData || item
  const nodeType = resolveChannelNodeType(item, basicData)
  return {
    name: item.name || basicData.name || basicData.channelId || item.id,
    id: item.id || basicData.channelId,
    deviceId: item.deviceId || basicData.deviceId || deviceId.value,
    nodeType: 'channel',
    type: nodeType,
    isLeaf: nodeType !== 2,
    online: basicData.status === 1 || basicData.status === true,
    userData: basicData
  }
}

function resolveChannelNodeType(item, basicData) {
  const id = String(item.id || basicData.channelId || '')
  if (id.length <= 10) return 2
  if (id.length > 14) {
    const channelType = id.substring(10, 13)
    if (channelType === '215' || channelType === '216') return 2
    if (basicData.ptztype === 1) return 4
    if (basicData.ptztype === 2) return 5
    if (basicData.ptztype === 3 || basicData.ptztype === 4) return 6
  }
  if (basicData.subCount > 0 || basicData.parental === 1) return 2
  return 3
}

function handleTreeNodeClick(data) {
  parentChannelId.value = data.nodeType === 'device' ? deviceId.value : (data.userData?.channelId || data.id)
  queryParams.pageNum = 1
  getChannelList()
}

function changeSubchannel(row) {
  router.push({
    path: '/video/channel-list',
    query: {
      deviceId: deviceId.value,
      parentChannelId: row.channelId
    }
  })
}

function queryRecords(row) {
  router.push({
    path: '/video/gb-record-detail',
    query: {
      deviceId: deviceId.value,
      channelId: row.channelId
    }
  })
}

function queryCloudRecords(row) {
  router.push({
    path: '/video/cloud-record-detail',
    query: {
      app: 'rtp',
      stream: `${deviceId.value}_${row.channelId}`
    }
  })
}

function backToRootChannel() {
  router.push({
    path: '/video/channel-list',
    query: {
      deviceId: deviceId.value,
      parentChannelId: 0
    }
  })
}

function backToDeviceList() {
  router.push('/video/device-list')
}
</script>

<style scoped>
.channel-device-tip {
  margin-bottom: 10px;
}

.channel-main {
  display: flex;
  gap: 12px;
  min-width: 0;
}

.channel-tree-panel {
  width: 260px;
  flex: 0 0 260px;
  min-height: calc(100vh - 220px);
  padding: 10px;
  overflow: auto;
  background: #fff;
  border: 1px solid #e5e6eb;
}

.channel-table-panel {
  flex: 1;
  min-width: 0;
}

.channel-tree-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  color: #303133;
}

.channel-tree-node.is-offline {
  color: #909399;
}

.channel-snap {
  width: 60px;
  height: 40px;
  vertical-align: middle;
}

.channel-snap__error {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  background: #f5f7fa;
}

.video-channel-list-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
