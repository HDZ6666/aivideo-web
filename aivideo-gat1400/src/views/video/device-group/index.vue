<template>
  <div class="app-container video-device-group-page">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分组名称" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入分组名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="分组状态" clearable style="width: 240px">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="addUser">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="getDeviceGroupLoading" @click="getDeviceGroup">
          刷新
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getDeviceGroup"></right-toolbar>
    </el-row>

    <el-table
      v-loading="getDeviceGroupLoading"
      :data="pagedDeviceGroupList"
      row-key="id"
      style="width: 100%"
      header-row-class-name="table-header"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="group_name" label="分组名称" min-width="240" show-overflow-tooltip />
      <el-table-column prop="level" label="等级" width="100" align="center" />
      <el-table-column prop="state" label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.state === 1 ? 'primary' : 'danger'" disable-transitions>
            {{ row.state === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-tooltip content="修改分组" placement="top">
            <el-button link type="primary" icon="Edit" @click="edit(row)" />
          </el-tooltip>
          <el-tooltip content="删除分组" placement="top">
            <el-button link type="primary" icon="Delete" @click="deleteUser(row)" />
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
    />

    <DeviceGroupEdit ref="deviceGroupEditRef" @get-device-group="getDeviceGroup" />
    <ChooseDeviceForGroup ref="chooseDeviceForGroupRef" @get-device-group="getDeviceGroup" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import request from '@/utils/video/request'
import DeviceGroupEdit from '@/components/video/DeviceGroupEdit/index.vue'
import ChooseDeviceForGroup from '@/components/video/ChooseDeviceForGroup/index.vue'

const deviceGroupEditRef = ref(null)
const chooseDeviceForGroupRef = ref(null)
const queryRef = ref(null)
const showSearch = ref(true)
const deviceGroupList = ref([])
const getDeviceGroupLoading = ref(false)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 15,
  groupName: '',
  state: ''
})

const filteredDeviceGroupList = computed(() => {
  return filterGroupTree(deviceGroupList.value)
})

const total = computed(() => filteredDeviceGroupList.value.length)

const pagedDeviceGroupList = computed(() => {
  const start = (queryParams.pageNum - 1) * queryParams.pageSize
  const end = start + queryParams.pageSize
  return filteredDeviceGroupList.value.slice(start, end)
})

onMounted(() => {
  initData()
})

function initData() {
  getDeviceGroup()
}

function handleQuery() {
  queryParams.pageNum = 1
}

function resetQuery() {
  queryRef.value?.resetFields()
  queryParams.groupName = ''
  queryParams.state = ''
  handleQuery()
}

function filterGroupTree(list) {
  const groupName = queryParams.groupName.trim()
  const state = queryParams.state

  return list
    .map((item) => {
      const children = Array.isArray(item.children) ? filterGroupTree(item.children) : []
      const matchName = !groupName || item.group_name?.includes(groupName)
      const matchState = state === '' || item.state === state
      const matched = matchName && matchState

      if (matched || children.length > 0) {
        return {
          ...item,
          children
        }
      }
      return null
    })
    .filter(Boolean)
}

function getDeviceGroup() {
  getDeviceGroupLoading.value = true
  request({
    method: 'get',
    url: '/ai/api/device/group/cameraGroupList'
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        deviceGroupList.value = res.data
      }
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      getDeviceGroupLoading.value = false
    })
}

function edit(row) {
  const options = deviceGroupList.value.filter((item) => item.level === 0)
  deviceGroupEditRef.value?.openDialog('edit', options, row)
}

function deleteUser(row) {
  ElMessageBox.confirm('确定删除此分组？', '提示', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    center: true,
    type: 'warning'
  })
    .then(() => {
      getDeviceGroupLoading.value = true
      request({
        method: 'delete',
        url: `/ai/api/device/group/deleteGroup?id=${row.id}`
      })
        .then(() => {
          getDeviceGroup()
        })
        .finally(() => {
          getDeviceGroupLoading.value = false
        })
    })
    .catch(() => {})
}

function addUser() {
  const options = deviceGroupList.value.filter((item) => item.level === 0)
  deviceGroupEditRef.value?.openDialog('add', options, null)
}

function chooseDevice(row) {
  chooseDeviceForGroupRef.value?.openDialog(row)
}

defineExpose({
  chooseDevice
})
</script>

<style scoped>
.video-device-group-page :deep(.pagination-container) {
  margin-top: 8px;
}
</style>
