<template>
  <el-tree
    ref="gdTree"
    :class="isScreen ? 'screen-device-tree' : 'device-tree'"
    :data="deviceGroupList"
    :props="defaultProps"
    :load="loadNode"
    lazy
    node-key="id"
    style="width: 100%; display: inline-block !important"
    @node-click="handleNodeClick"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <div class="tree-node-label">{{ node.label }}</div>
        <el-icon
          v-if="data.nodeType === 'device' && data.online"
          title="在线设备"
          class="device-online"
        >
          <VideoCameraFilled />
        </el-icon>
        <el-icon
          v-if="data.nodeType === 'device' && !data.online"
          title="离线设备"
          class="device-offline"
        >
          <VideoCameraFilled />
        </el-icon>
      </span>
    </template>
  </el-tree>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { VideoCameraFilled } from '@element-plus/icons-vue'
import request from '@/utils/video/request'

defineProps({
  isScreen: Boolean
})

const emit = defineEmits(['node-click'])

const gdTree = ref(null)
const deviceGroupList = ref([])
const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'isLeaf'
}

function handleNodeClick(data) {
  if (data.nodeType === 'device') {
    if (!data.online) {
      ElMessage.error('设备离线!不允许点播')
    } else {
      emit('node-click', data)
    }
  }
}

function loadNode(node, resolve) {
  if (node.level === 0) {
    getGroupTree(node.level, resolve)
    return
  }

  if (node.level > 0) {
    if (node.data.nodeType === 'group' && node.data.hasChildren) {
      getGroupTree(node.data.id, resolve)
      return
    }

    if (node.data.nodeType === 'group' && !node.data.hasChildren) {
      getDeviceTree(node.data.id, resolve)
      return
    }
  }

  resolve([])
}

function getGroupTree(parentId, resolve) {
  request({
    method: 'get',
    url: '/ai/api/device/group/cameraGroupList',
    params: {
      parentId
    }
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        const list = res.data.map((item) => {
          return {
            name: item.group_name,
            nodeType: 'group',
            id: item.id,
            isLeaf: false,
            online: false,
            hasChildren: item.children && item.children.length > 0,
            userData: item
          }
        })

        if (parentId === 0) {
          const all = {
            name: '全部设备',
            nodeType: 'group',
            id: 0,
            isLeaf: false,
            online: false,
            hasChildren: false,
            userData: null
          }
          list.unshift(all)
        }
        resolve(list)
      } else {
        resolve([])
      }
    })
    .catch(() => {
      resolve([])
    })
}

function getDeviceTree(categoryId, resolve) {
  request({
    method: 'get',
    url: '/api/device/query/devicesChannel',
    params: {
      page: 1,
      count: 9999,
      groupId: categoryId
    }
  })
    .then((res) => {
      if (res.code === 0 || res.code === '0') {
        const list = res.data.list.map((item) => {
          return {
            name: item.channelName,
            nodeType: 'device',
            id: `${item.deviceId}_${item.channelId}`,
            isLeaf: true,
            online: item.onLine,
            userData: item
          }
        })
        resolve(list)
      } else {
        resolve([])
      }
    })
    .catch(() => {
      resolve([])
    })
}
</script>

<style scoped>
.screen-device-tree {
  background: transparent !important;
  color: #f1f4f7 !important;
  font-weight: 400;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: hidden;
  font-size: 14px;
  padding-right: 8px;
}

.device-online {
  font-size: 18px;
  color: #59c4e6;
}

.device-offline {
  font-size: 18px;
  color: #c6ced8;
}

.tree-node-label {
  width: 90%;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
