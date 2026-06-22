<template>
  <el-dialog
    v-model="showDialog"
    title="选择设备"
    width="90%"
    top="2rem"
    class="choose-device-for-group-dialog"
    :close-on-click-modal="false"
    destroy-on-close
    @close="close"
  >
    <div v-loading="isLoading">
      <el-form :inline="true" :model="searchParams" size="small">
        <el-form-item label="名称">
          <el-input v-model="searchParams.deviceName" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchParams.deviceType" placeholder="请选择类型" clearable style="width: 140px">
            <el-option label="国标设备" value="2" />
            <el-option label="代理设备" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchParams.deviceStaus" placeholder="请选择状态" clearable style="width: 140px">
            <el-option label="在线" value="1" />
            <el-option label="离线" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchForm">查询</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        show-icon
        :title="`当前分组【${group.group_name || ''}】，共选中：${groupDeviceList.length}个设备`"
        type="info"
        :closable="false"
      />

      <el-table
        ref="deviceTableRef"
        :data="deviceList"
        row-key="id"
        class="choose-device-for-group-table"
        :height="winHeight"
        @select-all="handleSelectAll"
        @select="handleSelect"
      >
        <el-table-column type="selection" width="55" reserve-selection :selectable="selectableFunc" />
        <el-table-column prop="deviceName" label="设备名称" min-width="150" fixed />
        <el-table-column prop="deviceType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="default">{{ row.deviceType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.deviceStaus === '1'" size="default">在线</el-tag>
            <el-tag v-else size="default" type="info">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceId" label="设备编号" width="200" />
        <el-table-column prop="channelId" label="通道编号" width="200" />
        <el-table-column prop="stream" label="流ID" width="150" />
        <el-table-column label="流地址" min-width="400" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.url" size="default">{{ row.url }}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="choose-device-for-group-pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-popover v-model:visible="popoverVisible" placement="top" width="180">
        <p>确定要为该分组绑定这些设备吗？</p>
        <div class="choose-device-for-group-popover">
          <el-button size="small" text @click="popoverVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        </div>
        <template #reference>
          <el-button type="primary">确定</el-button>
        </template>
      </el-popover>
    </template>
  </el-dialog>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/video/request'

const group = ref({})
const groupDeviceList = ref([])
const isLoading = ref(true)
const showDialog = ref(false)
const winHeight = window.innerHeight - 330
const deviceList = ref([])
const selectDevices = ref([])
const popoverVisible = ref(false)
const deviceTableRef = ref(null)
const searchParams = reactive({
  deviceName: '',
  deviceType: '',
  deviceStaus: ''
})
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 50, 100, 500]
})

function openDialog(row) {
  group.value = row
  group.value.deviceList = [
    {
      groupId: 1,
      id: 0,
      date: '2016-05-02',
      deviceName: '代理0代理0代理0代理0代理0',
      deviceType: '直接代理',
      deviceStaus: '1',
      deviceId: '',
      channelId: '',
      stream: '10.16.133.6-14',
      url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0'
    },
    {
      groupId: 1,
      id: 1,
      date: '2016-05-02',
      deviceName: '代理1代理1代理1代理1代理1',
      deviceType: '直接代理',
      deviceStaus: '1',
      deviceId: '',
      channelId: '',
      stream: '10.16.133.6-14',
      url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0'
    },
    {
      groupId: 1,
      id: 11,
      date: '2016-05-02',
      deviceName: '代理1代理1代理1代理1代理1',
      deviceType: '直接代理',
      deviceStaus: '1',
      deviceId: '',
      channelId: '',
      stream: '10.16.133.6-14',
      url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0'
    }
  ]
  groupDeviceList.value = [...group.value.deviceList]
  showDialog.value = true
  getDeviceList()
}

function getDeviceList() {
  const params = {
    ...searchParams,
    page: pagination.currentPage,
    pageSize: pagination.pageSize
  }

  isLoading.value = true
  request({
    method: 'get',
    url: '/ai/api/device/group/cameraGroupList',
    params
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        deviceList.value = createMockDeviceList(pagination.currentPage)
        pagination.total = 11
        checked()
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

function createMockDeviceList(page) {
  if (page !== 1) {
    return [
      {
        groupId: 1,
        id: 11,
        date: '2016-05-02',
        deviceName: '代理1代理1代理1代理1代理1',
        deviceType: '直接代理',
        deviceStaus: '1',
        deviceId: '',
        channelId: '',
        stream: '10.16.133.6-14',
        url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0'
      }
    ]
  }

  return [
    { groupId: 1, id: 0, deviceName: '代理0代理0代理0代理0代理0', deviceType: '直接代理', deviceStaus: '1', deviceId: '', channelId: '', stream: '10.16.133.6-14', url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0' },
    { groupId: 1, id: 1, deviceName: '代理1代理1代理1代理1代理1', deviceType: '直接代理', deviceStaus: '1', deviceId: '', channelId: '', stream: '10.16.133.6-14', url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0' },
    { groupId: 2, id: 2, deviceName: '代理2代理2代理2代理12代理1', deviceType: '直接代理', deviceStaus: '2', deviceId: '', channelId: '', stream: '10.16.133.6-14', url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0' },
    { groupId: 2, id: 3, deviceName: '国标1', deviceType: '国标', deviceStaus: '1', deviceId: '44060610091322000010', channelId: '44060610091182000010', stream: '', url: '' },
    { groupId: '', id: 4, deviceName: '国标2', deviceType: '国标', deviceStaus: '2', deviceId: '44060610091322000010', channelId: '44060610091182000010', stream: '', url: '' },
    { groupId: '', id: 5, deviceName: '代理1代理1代理1代理1代理1', deviceType: '直接代理', deviceStaus: '1', deviceId: '', channelId: '', stream: '10.16.133.6-14', url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0' },
    { groupId: '', id: 6, deviceName: '代理2代理2代理2代理12代理1', deviceType: '直接代理', deviceStaus: '2', deviceId: '', channelId: '', stream: '10.16.133.6-14', url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0' },
    { groupId: '', id: 7, deviceName: '国标1', deviceType: '国标', deviceStaus: '1', deviceId: '44060610091322000010', channelId: '44060610091182000010', stream: '', url: '' },
    { groupId: '', id: 8, deviceName: '国标2', deviceType: '国标', deviceStaus: '2', deviceId: '44060610091322000010', channelId: '44060610091182000010', stream: '', url: '' },
    { groupId: '', id: 9, deviceName: '代理1代理1代理1代理1代理1', deviceType: '直接代理', deviceStaus: '1', deviceId: '', channelId: '', stream: '10.16.133.6-14', url: 'rtsp://admin:fs2018@10.16.133.6:554/cam/realmonitor?channel=15&subtype=0' }
  ]
}

function checked() {
  nextTick(() => {
    deviceList.value.forEach((item) => {
      if (groupDeviceList.value.some((device) => device.id === item.id)) {
        deviceTableRef.value?.toggleRowSelection(item, true)
      }
    })
  })
}

function onSubmit() {
  popoverVisible.value = false
  if (selectDevices.value.length <= 0) {
    ElMessage.warning('请至少选择一台设备')
  }
}

function close() {
  showDialog.value = false
  reset()
}

function searchForm() {
  pagination.currentPage = 1
  getDeviceList()
}

function handleSizeChange(value) {
  pagination.currentPage = 1
  pagination.pageSize = value
  getDeviceList()
}

function handleCurrentChange(value) {
  pagination.currentPage = value
  getDeviceList()
}

function handleSelect(selection, row) {
  if (selection.some((device) => device.id === row.id)) {
    groupDeviceList.value = [...groupDeviceList.value, row]
  } else {
    groupDeviceList.value = groupDeviceList.value.filter((device) => device.id !== row.id)
  }
  selectDevices.value = selection
}

function handleSelectAll(selection) {
  if (selection.length > 0) {
    const list = selection.filter((item) => !groupDeviceList.value.some((device) => device.id === item.id))
    groupDeviceList.value = [...groupDeviceList.value, ...list]
  } else {
    groupDeviceList.value = groupDeviceList.value.filter(
      (device) => !deviceList.value.some((item) => item.id === device.id)
    )
  }
  selectDevices.value = selection
}

function reset() {
  Object.assign(searchParams, {
    deviceName: '',
    deviceType: '',
    deviceStaus: ''
  })
  Object.assign(pagination, {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    pageSizes: [10, 20, 30, 40]
  })
  selectDevices.value = []
  deviceList.value = []
}

function selectableFunc(row) {
  return row.groupId !== '' && row.groupId !== group.value.id ? false : true
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.choose-device-for-group-table {
  width: 100%;
  margin-top: 12px;
  font-size: 12px;
}

.choose-device-for-group-pagination {
  justify-content: flex-start;
  margin-top: 12px;
}

.choose-device-for-group-popover {
  text-align: right;
  margin: 0;
}
</style>
