<template>
  <el-dialog v-model="open" title="选择通道" width="90%" append-to-body destroy-on-close @closed="handleClosed">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-tabs model-value="catalog">
          <el-tab-pane label="目录结构" name="catalog">
            <div class="catalog-panel">
              <el-tree
                ref="catalogTreeRef"
                node-key="id"
                lazy
                :load="loadCatalogNode"
                :props="catalogTreeProps"
                highlight-current
                :expand-on-click-node="false"
                @node-click="catalogIdChange"
                @node-contextmenu="handleCatalogContextMenu"
              >
                <template #default="{ node, data }">
                  <span class="catalog-node">
                    <el-radio
                      v-if="data.type === 0 || data.type === -1"
                      :model-value="catalogId"
                      :label="data.id"
                      @change="catalogIdChange(data)"
                    >
                      <span />
                    </el-radio>
                    <el-icon v-if="data.type === 0"><Folder /></el-icon>
                    <el-icon v-else><VideoCamera /></el-icon>
                    <span>{{ node.label }}</span>
                    <el-tag v-if="data.id === defaultCatalogIdSign" size="small" type="info">默认</el-tag>
                  </span>
                </template>
              </el-tree>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>

      <el-col :span="16">
        <el-tabs v-model="tabActiveName">
          <el-tab-pane label="国标通道" name="gbChannel">
            <div class="current-title">{{ currentCatalogTitle }}的国标通道</div>
            <el-form :model="gbQuery" :inline="true" label-width="68px">
              <el-form-item label="关键字">
                <el-input v-model="gbQuery.query" placeholder="关键字" clearable style="width: 180px" @keyup.enter="getGbChannelList" />
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="gbQuery.channelType" clearable style="width: 120px" @change="getGbChannelList">
                  <el-option label="设备" value="false" />
                  <el-option label="子目录" value="true" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="gbQuery.online" clearable style="width: 120px" @change="getGbChannelList">
                  <el-option label="在线" value="true" />
                  <el-option label="离线" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleGbSearch">搜索</el-button>
                <el-button v-if="isUnassignedCatalog" type="success" plain icon="Plus" :disabled="gbSelection.length === 0" @click="batchAddGb">批量添加</el-button>
                <el-button v-if="isUnassignedCatalog" type="success" plain icon="Plus" @click="addAllGb">全部添加</el-button>
                <el-button v-if="!isUnassignedCatalog" type="danger" plain icon="Delete" :disabled="gbSelection.length === 0" @click="batchRemoveGb">批量移除</el-button>
                <el-button v-if="!isUnassignedCatalog" type="danger" plain icon="Delete" @click="removeAllGb">全部移除</el-button>
              </el-form-item>
            </el-form>

            <el-table
              ref="gbTableRef"
              v-loading="gbLoading"
              :data="gbChannels"
              height="430"
              row-key="channelId"
              @selection-change="gbSelection = $event"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="channelId" label="通道编号" min-width="160" show-overflow-tooltip />
              <el-table-column prop="name" label="通道名称" min-width="160" show-overflow-tooltip />
              <el-table-column prop="deviceId" label="设备编号" min-width="160" show-overflow-tooltip />
              <el-table-column prop="hostAddress" label="设备地址" min-width="150" show-overflow-tooltip />
              <el-table-column prop="manufacturer" label="厂家" min-width="120" />
              <el-table-column label="操作" width="110" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="isUnassignedCatalog" link type="primary" icon="Plus" @click="addGb(row)">添加</el-button>
                  <el-button v-else link type="danger" icon="Delete" @click="removeGb(row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="gbTotal > 0"
              :total="gbTotal"
              v-model:page="gbQuery.pageNum"
              v-model:limit="gbQuery.pageSize"
              :page-sizes="[10, 20, 30, 50]"
              @pagination="getGbChannelList"
            />
          </el-tab-pane>

          <el-tab-pane label="直播流通道" name="streamChannel">
            <div class="current-title">{{ currentCatalogTitle }}的直播通道</div>
            <el-form :model="streamQuery" :inline="true" label-width="68px">
              <el-form-item label="关键字">
                <el-input v-model="streamQuery.query" placeholder="关键字" clearable style="width: 180px" @keyup.enter="getStreamList" />
              </el-form-item>
              <el-form-item label="推流状态">
                <el-select v-model="streamQuery.pushing" clearable style="width: 140px" @change="getStreamList">
                  <el-option label="推流进行中" value="true" />
                  <el-option label="推流未进行" value="false" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleStreamSearch">搜索</el-button>
                <el-button v-if="isUnassignedCatalog" type="success" plain icon="Plus" :disabled="streamSelection.length === 0" @click="batchAddStream">批量添加</el-button>
                <el-button v-if="isUnassignedCatalog" type="success" plain icon="Plus" @click="addAllStream">全部添加</el-button>
                <el-button v-if="!isUnassignedCatalog" type="danger" plain icon="Delete" :disabled="streamSelection.length === 0" @click="batchRemoveStream">批量移除</el-button>
                <el-button v-if="!isUnassignedCatalog" type="danger" plain icon="Delete" @click="removeAllStream">全部移除</el-button>
              </el-form-item>
            </el-form>

            <el-table
              ref="streamTableRef"
              v-loading="streamLoading"
              :data="gbStreams"
              height="430"
              row-key="stream"
              @selection-change="streamSelection = $event"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip />
              <el-table-column prop="app" label="应用名" min-width="120" show-overflow-tooltip />
              <el-table-column prop="stream" label="流ID" min-width="160" show-overflow-tooltip />
              <el-table-column prop="gbId" label="国标编码" min-width="160" show-overflow-tooltip />
              <el-table-column label="流来源" width="120" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.streamType === 'proxy'">拉流代理</el-tag>
                  <el-tag v-else>推流</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="110" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="isUnassignedCatalog" link type="primary" icon="Plus" @click="addStream(row)">添加</el-button>
                  <el-button v-else link type="danger" icon="Delete" @click="removeStream(row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="streamTotal > 0"
              :total="streamTotal"
              v-model:page="streamQuery.pageNum"
              v-model:limit="streamQuery.pageSize"
              :page-sizes="[10, 20, 30, 50]"
              @pagination="getStreamList"
            />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <div
      v-if="contextMenu.visible"
      class="catalog-context-menu"
      :style="{ left: `${contextMenu.left}px`, top: `${contextMenu.top}px` }"
    >
      <button v-if="contextMenu.data?.type === 0" @click="refreshCatalog(contextMenu.node)">刷新节点</button>
      <button v-if="contextMenu.data?.type === 0" @click="openCatalogEdit(false, null, contextMenu.data?.id, contextMenu.node)">新建节点</button>
      <button v-if="contextMenu.data?.type === 0" :disabled="contextMenu.node?.level === 1" @click="openCatalogEdit(true, contextMenu.data, contextMenu.data?.parentId, contextMenu.node)">修改节点</button>
      <button v-if="contextMenu.data?.type === 0" :disabled="contextMenu.node?.level === 1" @click="removeCatalog(contextMenu.data, contextMenu.node)">删除节点</button>
      <button v-if="contextMenu.data?.type === 0" :disabled="contextMenu.data?.id === defaultCatalogIdSign" @click="setDefaultCatalog(contextMenu.data?.id)">设为默认</button>
      <button v-if="contextMenu.data?.type !== 0" @click="removeCatalogRelation(contextMenu.data, contextMenu.node)">移除通道</button>
    </div>

    <el-dialog v-model="catalogEditOpen" title="节点编辑" width="520px" append-to-body destroy-on-close>
      <el-form ref="catalogFormRef" :model="catalogForm" :rules="catalogRules" label-width="100px">
        <el-form-item label="节点编号" prop="id">
          <el-input v-model="catalogForm.id" :disabled="catalogEditMode" clearable />
        </el-form-item>
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="catalogForm.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="catalogEditOpen = false">取消</el-button>
        <el-button type="primary" @click="submitCatalog">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="targetCatalogOpen" title="选择目标目录" width="520px" append-to-body destroy-on-close>
      <div class="target-catalog-panel">
        <el-tree
          node-key="id"
          lazy
          :load="loadCatalogNode"
          :props="catalogTreeProps"
          highlight-current
          :expand-on-click-node="false"
          @node-click="targetCatalogChange"
        />
      </div>
      <template #footer>
        <el-button @click="targetCatalogOpen = false">取消</el-button>
        <el-button type="primary" :disabled="!targetCatalogId" @click="confirmTargetCatalog">确定</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, VideoCamera } from '@element-plus/icons-vue'
import request from '@/utils/video/request'

const open = ref(false)
const closeCallback = ref(null)
const tabActiveName = ref('gbChannel')
const platformId = ref('')
const platformDeviceId = ref('')
const platformName = ref('')
const defaultCatalogIdSign = ref('')
const catalogId = ref(null)
const catalogName = ref('')
const catalogTreeRef = ref(null)
const gbTableRef = ref(null)
const streamTableRef = ref(null)
const gbLoading = ref(false)
const gbChannels = ref([])
const gbSelection = ref([])
const gbTotal = ref(0)
const streamLoading = ref(false)
const gbStreams = ref([])
const streamSelection = ref([])
const streamTotal = ref(0)
const catalogEditOpen = ref(false)
const catalogEditMode = ref(false)
const catalogFormRef = ref(null)
const catalogEditNode = ref(null)
const targetCatalogOpen = ref(false)
const targetCatalogId = ref('')
const targetCatalogCallback = ref(null)

const catalogTreeProps = {
  label: 'name',
  children: 'children',
  isLeaf: 'leaf'
}

const gbQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  query: '',
  online: '',
  channelType: ''
})
const streamQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  query: '',
  pushing: ''
})
const catalogForm = reactive({
  id: '',
  name: '',
  platformId: '',
  parentId: ''
})
const catalogRules = {
  id: [{ required: true, validator: validateCatalogId, trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
}
const contextMenu = reactive({
  visible: false,
  left: 0,
  top: 0,
  data: null,
  node: null
})

const isUnassignedCatalog = computed(() => catalogId.value === null || catalogId.value === undefined || catalogId.value === '')
const currentCatalogTitle = computed(() => {
  if (isUnassignedCatalog.value) return catalogName.value || '未分配'
  return `${catalogName.value || '-'}(${catalogId.value})`
})

function openDialog(currentPlatformId, currentPlatformDeviceId, currentPlatformName, currentDefaultCatalogId, callback) {
  platformId.value = currentPlatformId
  platformDeviceId.value = currentPlatformDeviceId
  platformName.value = currentPlatformName
  defaultCatalogIdSign.value = currentDefaultCatalogId
  catalogId.value = currentDefaultCatalogId || null
  catalogName.value = currentPlatformName || ''
  closeCallback.value = callback
  open.value = true
  getGbChannelList()
  getStreamList()
}

function handleClosed() {
  closeContextMenu()
  closeCallback.value?.()
}

function loadCatalogNode(node, resolve) {
  if (node.level === 0) {
    resolve([
      { name: '未分配', id: null, type: -1, leaf: true },
      { name: platformName.value, id: platformDeviceId.value, type: 0, leaf: false }
    ])
    return
  }

  request({
    method: 'get',
    url: '/api/platform/catalog',
    params: {
      platformId: platformId.value,
      parentId: node.data.id
    }
  }).then((res) => {
    resolve(res.data || [])
  })
}

function catalogIdChange(data) {
  closeContextMenu()
  catalogId.value = data.id
  catalogName.value = data.name
  gbQuery.pageNum = 1
  streamQuery.pageNum = 1
  getGbChannelList()
  getStreamList()
}

function handleCatalogContextMenu(event, data, node) {
  event.preventDefault()
  contextMenu.visible = true
  contextMenu.left = event.clientX
  contextMenu.top = event.clientY
  contextMenu.data = data
  contextMenu.node = node
}

function closeContextMenu() {
  contextMenu.visible = false
  contextMenu.data = null
  contextMenu.node = null
}

function refreshCatalog(node) {
  closeContextMenu()
  if (!node) return
  node.loaded = false
  node.expand()
}

function openCatalogEdit(isEdit, data, parentId, node) {
  closeContextMenu()
  catalogEditMode.value = isEdit
  catalogEditNode.value = node
  catalogForm.id = data?.id || ''
  catalogForm.name = data?.name || ''
  catalogForm.platformId = platformId.value
  catalogForm.parentId = parentId || platformDeviceId.value
  catalogEditOpen.value = true
}

function submitCatalog() {
  catalogFormRef.value?.validate((valid) => {
    if (!valid) return
    request({
      method: 'post',
      url: `/api/platform/catalog/${catalogEditMode.value ? 'edit' : 'add'}`,
      data: { ...catalogForm }
    }).then(() => {
      ElMessage.success('保存成功')
      catalogEditOpen.value = false
      refreshAfterCatalogEdit()
    })
  })
}

function refreshAfterCatalogEdit() {
  const node = catalogEditNode.value
  if (!node) return
  const targetNode = catalogEditMode.value ? node.parent : node
  if (targetNode) {
    targetNode.loaded = false
    targetNode.expand()
  }
  if (catalogEditMode.value && catalogForm.id === catalogId.value) {
    catalogName.value = catalogForm.name
  }
}

function removeCatalog(data, node) {
  closeContextMenu()
  ElMessageBox.confirm('确定删除该节点吗？', '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: '/api/platform/catalog/del',
        params: {
          id: data.id,
          platformId: platformId.value
        }
      })
    )
    .then((res) => {
      ElMessage.success('删除成功')
      if (res.data) defaultCatalogIdSign.value = res.data
      if (node?.parent) {
        node.parent.loaded = false
        node.parent.expand()
      }
    })
    .catch(() => {})
}

function removeCatalogRelation(data, node) {
  closeContextMenu()
  request({
    method: 'delete',
    url: '/api/platform/catalog/relation/del',
    data: {
      ...data,
      parentId: node?.parent?.data?.id
    }
  }).then(() => {
    ElMessage.success('移除成功')
    if (node?.parent) {
      node.parent.loaded = false
      node.parent.expand()
    }
  })
}

function setDefaultCatalog(id) {
  closeContextMenu()
  request({
    method: 'post',
    url: '/api/platform/catalog/default/update',
    params: {
      platformId: platformId.value,
      catalogId: id
    }
  }).then(() => {
    defaultCatalogIdSign.value = id
    ElMessage.success('设置成功')
  })
}

function validateCatalogId(rule, value, callback) {
  if (!value) {
    callback(new Error('编号不能为空'))
    return
  }

  const id = String(value).trim()
  const parentId = String(catalogForm.parentId || '')
  if (id.length <= 8) {
    if (id.length % 2 !== 0) {
      callback(new Error('行政区划编号必须为2/4/6/8位'))
      return
    }
    if (parentId !== platformDeviceId.value && parentId.length >= id.length) {
      callback(new Error(parentId.length === 20 ? '业务分组/虚拟组织下不可创建行政区划' : '行政区划编号长度应该每次两位递增'))
      return
    }
  } else {
    if (id.length !== 20) {
      callback(new Error('编号必须为2/4/6/8位的行政区划或20位的虚拟组织/业务分组'))
      return
    }
    const catalogType = id.substring(10, 13)
    if (catalogType !== '215' && catalogType !== '216') {
      callback(new Error('业务分组11-13位为215，虚拟组织11-13位为216'))
      return
    }
    if (catalogType === '216' && parentId !== platformDeviceId.value && parentId.length <= 8) {
      callback(new Error('建立虚拟组织前必须先建立业务分组'))
      return
    }
    if (catalogType === '215' && parentId.substring(10, 13) === '215') {
      callback(new Error('业务分组下只能建立虚拟组织'))
      return
    }
  }

  callback()
}

function handleGbSearch() {
  gbQuery.pageNum = 1
  getGbChannelList()
}

function getGbChannelList() {
  gbLoading.value = true
  request({
    method: 'get',
    url: '/api/platform/channel_list',
    params: {
      page: gbQuery.pageNum,
      count: gbQuery.pageSize,
      query: gbQuery.query,
      online: gbQuery.online,
      catalogId: catalogId.value,
      platformId: platformId.value,
      channelType: gbQuery.channelType
    }
  })
    .then((res) => {
      gbTotal.value = res.data?.total || 0
      gbChannels.value = res.data?.list || []
    })
    .finally(() => {
      gbLoading.value = false
    })
}

function addGb(row) {
  withTargetCatalog((targetId) => updateGbChannels(false, [row], targetId))
}

function batchAddGb() {
  withTargetCatalog((targetId) => updateGbChannels(false, gbSelection.value, targetId))
}

function addAllGb() {
  withTargetCatalog((targetId) => updateGbChannels(true, [], targetId))
}

function removeGb(row) {
  removeGbChannels(false, [row])
}

function batchRemoveGb() {
  removeGbChannels(false, gbSelection.value)
}

function removeAllGb() {
  removeGbChannels(true, [])
}

function updateGbChannels(all, rows, targetId) {
  request({
    method: 'post',
    url: '/api/platform/update_channel_for_gb',
    data: {
      platformId: platformId.value,
      all,
      channelReduces: all ? [] : rows,
      catalogId: targetId
    }
  }).then(() => {
    ElMessage.success('保存成功')
    gbTableRef.value?.clearSelection()
    getGbChannelList()
  })
}

function removeGbChannels(all, rows) {
  ElMessageBox.confirm(`确定移除${all ? '所有' : rows.length + '个'}通道吗？`, '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: '/api/platform/del_channel_for_gb',
        data: {
          platformId: platformId.value,
          all,
          channelReduces: all ? [] : rows
        }
      })
    )
    .then(() => {
      ElMessage.success('移除成功')
      gbTableRef.value?.clearSelection()
      getGbChannelList()
    })
    .catch(() => {})
}

function handleStreamSearch() {
  streamQuery.pageNum = 1
  getStreamList()
}

function getStreamList() {
  streamLoading.value = true
  request({
    method: 'get',
    url: '/api/gbStream/list',
    params: {
      page: streamQuery.pageNum,
      count: streamQuery.pageSize,
      query: streamQuery.query,
      pushing: streamQuery.pushing,
      platformId: platformId.value,
      catalogId: catalogId.value
    }
  })
    .then((res) => {
      streamTotal.value = res.data?.total || 0
      gbStreams.value = res.data?.list || []
    })
    .finally(() => {
      streamLoading.value = false
    })
}

function addStream(row) {
  withTargetCatalog((targetId) => updateStreams(false, [row], targetId))
}

function batchAddStream() {
  withTargetCatalog((targetId) => updateStreams(false, streamSelection.value, targetId))
}

function addAllStream() {
  withTargetCatalog((targetId) => updateStreams(true, [], targetId))
}

function removeStream(row) {
  removeStreams(false, [row])
}

function batchRemoveStream() {
  removeStreams(false, streamSelection.value)
}

function removeAllStream() {
  removeStreams(true, [])
}

function updateStreams(all, rows, targetId) {
  request({
    method: 'post',
    url: '/api/gbStream/add',
    data: {
      platformId: platformId.value,
      catalogId: targetId,
      all,
      gbStreams: all ? [] : rows
    }
  }).then(() => {
    ElMessage.success('保存成功')
    streamTableRef.value?.clearSelection()
    getStreamList()
  })
}

function removeStreams(all, rows) {
  ElMessageBox.confirm(`确定移除${all ? '所有' : rows.length + '个'}通道吗？`, '提示', { type: 'warning' })
    .then(() =>
      request({
        method: 'delete',
        url: '/api/gbStream/del',
        data: {
          platformId: platformId.value,
          all,
          gbStreams: all ? [] : rows
        }
      })
    )
    .then(() => {
      ElMessage.success('移除成功')
      streamTableRef.value?.clearSelection()
      getStreamList()
    })
    .catch(() => {})
}

function withTargetCatalog(callback) {
  if (!isUnassignedCatalog.value && catalogId.value) {
    callback(catalogId.value)
    return
  }

  targetCatalogCallback.value = callback
  targetCatalogId.value = defaultCatalogIdSign.value || ''
  targetCatalogOpen.value = true
}

function targetCatalogChange(data) {
  if (data.type !== 0) return
  targetCatalogId.value = data.id
}

function confirmTargetCatalog() {
  if (!targetCatalogId.value) {
    ElMessage.warning('请选择目录')
    return
  }
  const callback = targetCatalogCallback.value
  targetCatalogOpen.value = false
  targetCatalogCallback.value = null
  callback?.(targetCatalogId.value)
}

defineExpose({
  openDialog
})
</script>

<style scoped>
.catalog-panel {
  height: 562px;
  overflow: auto;
  padding: 10px;
  border: 1px solid var(--el-border-color-light);
}

.catalog-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.current-title {
  margin-bottom: 10px;
  color: #606266;
  font-size: 15px;
  line-height: 24px;
}

.catalog-context-menu {
  position: fixed;
  z-index: 3000;
  min-width: 120px;
  padding: 4px 0;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
}

.catalog-context-menu button {
  display: block;
  width: 100%;
  height: 30px;
  padding: 0 14px;
  border: 0;
  background: transparent;
  color: var(--el-text-color-regular);
  text-align: left;
  cursor: pointer;
}

.catalog-context-menu button:hover {
  background: var(--el-fill-color-light);
}

.catalog-context-menu button:disabled {
  color: var(--el-text-color-disabled);
  cursor: not-allowed;
}

.target-catalog-panel {
  height: 360px;
  overflow: auto;
  border: 1px solid var(--el-border-color-light);
  padding: 8px;
}
</style>
