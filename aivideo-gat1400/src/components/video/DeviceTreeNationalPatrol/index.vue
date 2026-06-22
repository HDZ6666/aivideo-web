<template>
  <el-tree
    ref="treeRef"
    class="device-tree"
    :props="defaultProps"
    :load="loadNode"
    lazy
    show-checkbox
    check-descendants
    node-key="id"
    @check-change="handleCheckChange"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span class="tree-node-label">{{ node.label }}</span>
        <el-icon v-if="data.nodeType === 'channel'" :class="data.online ? 'device-online' : 'device-offline'">
          <VideoCameraFilled />
        </el-icon>
      </span>
    </template>
  </el-tree>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { VideoCameraFilled } from '@element-plus/icons-vue'
import request from '@/utils/video/request'

const emit = defineEmits(['check-event'])

const treeRef = ref(null)
const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'isLeaf',
  disabled: 'disabled'
}
const onlyCatalog = ref(false)

function loadNode(node, resolve) {
  if (node.level === 0) {
    getGroupTree(0, resolve, node)
    return
  }

  if (node.data.nodeType === 'group' && node.data.hasChildren) {
    getGroupTree(node.data.id, resolve, node)
    return
  }

  if (node.data.nodeType === 'group' && !node.data.hasChildren) {
    getDeviceTree(node.data.id, resolve, node)
    return
  }

  if (node.data.nodeType === 'device') {
    getChannelTree(node.data.id, resolve, node)
    return
  }

  resolve([])
}

function getGroupTree(parentId, resolve, parentNode) {
  request({
    method: 'get',
    url: '/ai/api/device/group/cameraGroupList',
    params: { parentId }
  })
    .then((res) => {
      const list = (res.data || []).map((item) => ({
        name: item.group_name,
        nodeType: 'group',
        id: item.id,
        isLeaf: false,
        disabled: false,
        hasChildren: item.children && item.children.length > 0,
        userData: item
      }))

      if (parentId === 0) {
        list.unshift({
          name: '全部设备',
          nodeType: 'group',
          id: 0,
          isLeaf: false,
          disabled: false,
          hasChildren: false
        })
      }

      resolve(list)
      validateParentAfterLoad(parentNode)
    })
    .catch(() => resolve([]))
}

function getDeviceTree(groupId, resolve, parentNode) {
  request({
    method: 'get',
    url: '/api/device/query/devices',
    params: {
      page: 1,
      count: 9999,
      groupId
    }
  })
    .then((res) => {
      const list = (res.data?.list || []).map((item) => ({
          name: item.name || item.deviceId,
          id: item.deviceId,
          nodeType: 'device',
          isLeaf: false,
          disabled: false,
          online: item.onLine,
          userData: item
        }))
      resolve(list)
      validateParentAfterLoad(parentNode)
    })
    .catch(() => resolve([]))
}

function getChannelTree(deviceId, resolve, parentNode) {
  request({
    method: 'get',
    url: `/api/device/query/tree/${deviceId}`,
    params: {
      page: 1,
      count: 9999,
      parentId: deviceId,
      onlyCatalog: onlyCatalog.value
    }
  })
    .then((res) => {
      const nodes = (res.data?.list || []).map((item) => {
        const type = getChannelNodeType(item)
        const channelId = item.basicData?.channelId || item.id
        const online = !!item.basicData?.status
        return {
          name: item.name || channelId,
          id: item.basicData?.id || `${item.deviceId}_${channelId}`,
          nodeType: 'channel',
          isLeaf: type !== 2,
          disabled: type === 2 || !online,
          deviceId: item.deviceId,
          channelId,
          online,
          userData: item.basicData
        }
      })
      resolve(nodes)
      validateParentAfterLoad(parentNode)
    })
    .catch(() => resolve([]))
}

function getChannelNodeType(item) {
  if (item.id?.length <= 10) return 2
  if (item.id?.length > 14) {
    const channelType = item.id.substring(10, 13)
    if (channelType === '215' || channelType === '216') return 2
    if ([1, 2, 3, 4].includes(item.basicData?.ptztype)) return 3
  }
  if (item.basicData?.subCount > 0 || item.basicData?.parental === 1) return 2
  return 3
}

function handleCheckChange(data, checked) {
  if (data.nodeType !== 'channel') {
    if (checked) validateNodeSelectable(data.id)
    return
  }
  emit('check-event', {
    deviceId: data.deviceId,
    channelId: data.channelId,
    checked,
    source: 'national',
    data
  })
}

function hasSelectableChannel(node) {
  if (!node) return false
  if (node.data?.nodeType === 'channel') return !node.disabled
  return node.childNodes?.some((child) => hasSelectableChannel(child))
}

function hasUnloadedBranch(node) {
  if (!node || node.data?.nodeType === 'channel') return false
  if (!node.loaded) return true
  return node.childNodes?.some((child) => hasUnloadedBranch(child))
}

function validateParentAfterLoad(parentNode) {
  if (!parentNode || parentNode.level === 0) return
  nextTick(() => {
    validateNodeSelectable(parentNode.data?.id)
  })
}

function validateNodeSelectable(key) {
  const node = treeRef.value?.getNode(key)
  if (!node || !node.loaded) return
  if (hasUnloadedBranch(node)) return
  if (hasSelectableChannel(node)) return
  if (node.data) {
    node.data.disabled = true
  }
  if (node.checked) {
    treeRef.value?.setChecked(key, false, true)
  }
}

function resetSelection() {
  treeRef.value?.setCheckedKeys([])
}

defineExpose({
  resetSelection
})
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
  padding-right: 8px;
}

.tree-node-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-online {
  color: #59c4e6;
}

.device-offline {
  color: #c6ced8;
}
</style>
