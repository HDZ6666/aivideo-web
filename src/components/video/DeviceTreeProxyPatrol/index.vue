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
        <el-icon v-if="data.nodeType === 'device'" class="device-online">
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

function getDeviceTree(categoryId, resolve, parentNode) {
  request({
    method: 'get',
    url: '/ai/api/device/queryManager/list',
    params: {
      page: 1,
      pageSize: 9999,
      categoryId
    }
  })
    .then((res) => {
      const list = (res.data?.list || []).map((item) => ({
          name: item.name,
          nodeType: 'device',
          id: item.streamKey || `${item.app}_${item.stream}`,
          isLeaf: true,
          disabled: false,
          online: true,
          userData: item
        }))
      resolve(list)
      validateParentAfterLoad(parentNode)
    })
    .catch(() => resolve([]))
}

function handleCheckChange(data, checked) {
  if (data.nodeType !== 'device') {
    if (checked) validateNodeSelectable(data.id)
    return
  }
  const item = data.userData || {}
  emit('check-event', {
    id: data.id,
    checked,
    source: 'proxy',
    cameraId: item.streamKey || `${item.app || ''}-${item.stream || ''}-非国标`,
    data
  })
}

function hasSelectableDevice(node) {
  if (!node) return false
  if (node.data?.nodeType === 'device') return !node.disabled
  return node.childNodes?.some((child) => hasSelectableDevice(child))
}

function hasUnloadedBranch(node) {
  if (!node || node.data?.nodeType === 'device') return false
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
  if (hasSelectableDevice(node)) return
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
</style>
