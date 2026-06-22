<template>
  <div class="app-container video-device-list-page">
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
              <el-form-item label="关键字" prop="query">
                <el-input
                  v-model="queryParams.query"
                  placeholder="请输入名称/设备编号"
                  clearable
                  style="width: 240px"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
              <el-form-item label="状态" prop="online">
                <el-select v-model="queryParams.online" placeholder="设备状态" clearable style="width: 240px">
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
                <el-button type="primary" plain icon="Plus" @click="add">新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="info" plain icon="Refresh" :loading="getDeviceListLoading" @click="getDeviceList">
                  刷新
                </el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getDeviceList"></right-toolbar>
            </el-row>

            <el-table
              v-loading="getDeviceListLoading"
              :data="deviceList"
              style="width: 100%"
              header-row-class-name="table-header"
            >
              <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
              <el-table-column prop="deviceId" label="设备编号" min-width="200" show-overflow-tooltip />
              <el-table-column label="地址" min-width="160" align="center" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-tag v-if="row.hostAddress" size="default">{{ row.hostAddress }}</el-tag>
                  <el-tag v-else size="default">未知</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="manufacturer" label="厂家" min-width="120" show-overflow-tooltip />
              <el-table-column prop="transport" label="信令传输模式" min-width="120" align="center" />
              <el-table-column label="流传输模式" min-width="160" align="center">
                <template #default="{ row }">
                  <el-select
                    v-model="row.streamMode"
                    size="small"
                    placeholder="请选择"
                    style="width: 120px"
                    @change="transportChange(row)"
                  >
                    <el-option key="UDP" label="UDP" value="UDP" />
                    <el-option key="TCP-ACTIVE" label="TCP主动模式" value="TCP-ACTIVE" />
                    <el-option key="TCP-PASSIVE" label="TCP被动模式" value="TCP-PASSIVE" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="channelCount" label="通道数" min-width="90" align="center" />
              <el-table-column label="状态" min-width="90" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.onLine" size="default">在线</el-tag>
                  <el-tag v-else size="default" type="info">离线</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="keepaliveTime" label="最近心跳" min-width="160" align="center" />
              <el-table-column prop="registerTime" label="最近注册" min-width="160" align="center" />

              <el-table-column label="操作" align="center" width="190" fixed="right" class-name="small-padding fixed-width">
                <template #default="{ row }">
                  <el-tooltip content="刷新设备通道" placement="top">
                    <el-button
                      link
                      type="primary"
                      :disabled="row.online === 0"
                      icon="Refresh"
                      @click="refDevice(row)"
                    />
                  </el-tooltip>
                  <el-tooltip content="通道" placement="top">
                    <el-button link type="primary" icon="VideoCamera" @click="showChannelList(row)" />
                  </el-tooltip>
                  <el-tooltip content="定位" placement="top">
                    <el-button link type="primary" icon="Location" @click="showDevicePosition(row)" />
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top">
                    <el-button link type="primary" icon="Edit" @click="edit(row)" />
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button link type="primary" icon="Delete" @click="deleteDevice(row)" />
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
              @pagination="getDeviceList"
            />
          </el-col>
        </pane>
      </splitpanes>
    </el-row>

    <DeviceEdit ref="deviceEditRef" />
    <SyncChannelProgress ref="syncChannelProgressRef" />
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
import DeviceEdit from '@/components/video/DeviceEdit/index.vue'
import DeviceGroupList from '@/components/video/DeviceGroupList/index.vue'
import SyncChannelProgress from '@/components/video/SyncChannelProgress/index.vue'

const router = useRouter()
const appStore = useAppStore()

const deviceEditRef = ref(null)
const deviceGroupRef = ref(null)
const syncChannelProgressRef = ref(null)
const queryRef = ref(null)
const showSearch = ref(true)
const deviceList = ref([])
const total = ref(0)
const groupId = ref(0)
const getDeviceListLoading = ref(false)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15,
  query: '',
  online: ''
})

onMounted(() => {
  initData()
})

function initData(showLoading = true) {
  getDeviceList(showLoading)
}

function changeGroup(group) {
  groupId.value = group.id
  handleQuery()
}

function handleQuery() {
  queryParams.pageNum = 1
  getDeviceList()
}

function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.query = ''
  queryParams.online = ''
  handleQuery()
}

function getDeviceList(showLoading = true) {
  if (showLoading) {
    getDeviceListLoading.value = true
  }

  const params = {
    page: queryParams.pageNum,
    count: queryParams.pageSize,
    groupId: groupId.value
  }

  if (queryParams.query) {
    params.query = queryParams.query
  }
  if (queryParams.online !== '') {
    params.online = queryParams.online
  }

  request({
    method: 'get',
    url: '/api/device/query/devices',
    params
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        total.value = res.data.total
        deviceList.value = res.data.list
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      if (showLoading) {
        getDeviceListLoading.value = false
      }
    })
}

function deleteDevice(row) {
  let msg = '确定删除此设备？'
  if (row.online !== 0) {
    msg = '在线设备删除后仍可通过注册再次上线。<br/>如需彻底删除请先将设备离线。<br/><strong>确定删除此设备？</strong>'
  }

  ElMessageBox.confirm(msg, '提示', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true,
    type: 'warning'
  })
    .then(() => {
      request({
        method: 'delete',
        url: `/api/device/query/devices/${row.deviceId}/delete`
      }).then(() => {
        getDeviceList()
      })
    })
    .catch(() => {})
}

function showChannelList(row) {
  router.push({
    path: '/video/channel-list',
    query: {
      deviceId: row.deviceId,
      parentChannelId: 0
    }
  })
}

function showDevicePosition(row) {
  router.push({
    path: '/video/map',
    query: {
      deviceId: row.deviceId
    }
  })
}

function refDevice(itemData) {
  request({
    method: 'get',
    url: `/api/device/query/devices/${itemData.deviceId}/sync`
  })
    .then((res) => {
      if (res.code !== 0 && res.code !== '0') {
        ElMessage.error(res.msg)
      } else {
        syncChannelProgressRef.value?.openDialog(itemData.deviceId)
      }
      initData()
    })
    .catch((error) => {
      console.error(error)
      ElMessage.error(error?.message || String(error))
    })
}

function transportChange(row) {
  request({
    method: 'post',
    url: `/api/device/query/transport/${row.deviceId}/${row.streamMode}`
  }).catch((error) => {
    console.error(error)
  })
}

function edit(row) {
  deviceEditRef.value?.openDialog(row, () => {
    deviceEditRef.value?.close()
    ElMessage.success('设备修改成功，通道字符集将在下次更新生效')
    window.setTimeout(getDeviceList, 200)
  })
}

function add() {
  deviceEditRef.value?.openDialog(null, () => {
    deviceEditRef.value?.close()
    ElMessage.success('添加成功')
    window.setTimeout(getDeviceList, 200)
  })
}
</script>

<style scoped>
.video-device-list-page :deep(.splitpanes__pane) {
  min-width: 0;
}

.video-device-list-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
