<template>
  <div class="device-group-container" v-loading="getDeviceGroupLoading">
    <div class="head-container">
      <el-input
        v-model="groupName"
        placeholder="请输入分组名称"
        clearable
        prefix-icon="Search"
        style="margin-bottom: 20px"
      />
    </div>

    <div class="head-container">
      <div class="device-group-title">
        <span>设备分组</span>
        <el-button size="small" type="primary" plain @click="addGroup">全部</el-button>
      </div>
      <el-tree
        ref="groupTreeRef"
        node-key="id"
        default-expand-all
        :data="deviceGroupList"
        :props="treeProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        highlight-current
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import request from '@/utils/video/request'

const emit = defineEmits(['change-group'])

const groupTreeRef = ref(null)
const groupName = ref('')
const getDeviceGroupLoading = ref(false)
const deviceGroupList = ref([])
const treeProps = {
  children: 'children',
  label: 'group_name'
}

watch(groupName, (value) => {
  groupTreeRef.value?.filter(value)
})

onMounted(() => {
  getDeviceGroup()
})

function addGroup() {
  groupTreeRef.value?.setCurrentKey(null)
  emit('change-group', { id: 0 })
}

function filterNode(value, data) {
  if (!value) return true
  return data.group_name?.includes(value)
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

function getGroup() {
  return [...deviceGroupList.value]
}

function getNode(id) {
  return groupTreeRef.value?.getNode(id)
}

function handleNodeClick(data) {
  emit('change-group', data)
}

defineExpose({
  getDeviceGroup,
  getGroup,
  getNode
})
</script>

<style scoped>
.device-group-container {
  width: 100%;
  overflow: hidden;
}

.device-group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
