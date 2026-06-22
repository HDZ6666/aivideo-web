<template>
  <div class="app-container visual-entity-page">
    <el-card shadow="never" class="filter-card">
      <el-form :model="queryParams" inline label-width="90px">
        <el-form-item v-for="field in config.filters || []" :key="field.prop" :label="field.label">
          <component
            :is="fieldComponent(field)"
            v-model="queryParams[field.prop]"
            v-bind="fieldProps(field)"
            clearable
            filterable
            style="width: 220px"
          >
            <el-option
              v-for="option in fieldOptions(field)"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </component>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>{{ config.title }}</span>
          <div class="table-actions">
            <el-button v-if="!config.readonly" type="primary" icon="Plus" @click="openCreate">新增</el-button>
            <el-button icon="Refresh" @click="loadList">刷新</el-button>
          </div>
        </div>
      </template>

      <el-row v-if="config.cardView" :gutter="16" v-loading="loading">
        <el-col v-for="row in tableList" :key="rowKey(row)" :xs="24" :sm="12" :lg="8">
          <el-card shadow="hover" class="media-card">
            <div class="media-preview">
              <video v-if="pickMedia(row).type === 'video'" :src="pickMedia(row).url" controls />
              <el-image v-else-if="pickMedia(row).url" :src="pickMedia(row).url" fit="cover" />
              <el-empty v-else description="暂无预览" />
            </div>
            <div class="media-meta">
              <div class="media-title">{{ pickValue(row, 'deviceName') || pickValue(row, 'id') || '视频片段' }}</div>
              <div>{{ pickValue(row, 'datetime') || pickValue(row, 'beginTime') || '-' }}</div>
            </div>
            <div class="media-actions">
              <el-button link type="primary" @click="openDetail(row)">详情</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-table v-else v-loading="loading" :data="tableList" border>
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column
          v-for="column in config.columns || []"
          :key="column.prop"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :min-width="column.minWidth"
          align="center"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-image
              v-if="column.type === 'image' && displayValue(row, column)"
              :src="displayValue(row, column)"
              fit="cover"
              class="thumb"
              :preview-src-list="[displayValue(row, column)]"
              :z-index="4000"
              preview-teleported
            />
            <el-tag v-else-if="column.type === 'boolean'" :type="displayValue(row, column) ? 'success' : 'info'">
              {{ displayValue(row, column) ? '在线/启用' : '离线/停用' }}
            </el-tag>
            <el-progress v-else-if="column.type === 'progress'" :percentage="toProgress(displayValue(row, column))" />
            <span v-else>{{ displayValue(row, column) || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)">详情</el-button>
            <el-button v-if="!config.readonly" link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button
              v-for="action in config.rowActions || []"
              :key="action.label"
              link
              type="warning"
              @click="runRowAction(action, row)"
            >
              {{ action.label }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="!config.tableMode"
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        class="pager"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 50]"
        :total="total"
        @size-change="loadList"
        @current-change="loadList"
      />
    </el-card>

    <el-dialog v-model="formOpen" :title="formTitle" width="860px" append-to-body destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="entity-form">
        <template v-for="field in config.formFields || []" :key="field.prop">
          <el-form-item v-if="field.type !== 'subImages'" :label="field.label" :prop="field.prop">
            <component
              :is="fieldComponent(field)"
              :model-value="getByPath(form, field.prop)"
              v-bind="fieldProps(field)"
              :disabled="field.disabled"
              clearable
              filterable
              @update:model-value="(value) => setByPath(form, field.prop, value)"
            >
              <el-option
                v-for="option in fieldOptions(field)"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </component>
          </el-form-item>
          <el-form-item v-else :label="field.label">
            <el-table :data="getByPath(form, field.prop) || []" border>
              <el-table-column
                v-for="subField in field.fields"
                :key="subField.prop"
                :label="subField.label"
                :prop="subField.prop"
                align="center"
              >
                <template #default="{ row }">
                  <component
                    :is="fieldComponent(subField)"
                    :model-value="row[subField.prop]"
                    v-bind="fieldProps(subField)"
                    clearable
                    filterable
                    @update:model-value="(value) => (row[subField.prop] = value)"
                  >
                    <el-option
                      v-for="option in fieldOptions(subField)"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </component>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90" align="center">
                <template #default="{ $index }">
                  <el-button link type="danger" @click="removeSubImage(field.prop, $index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button class="sub-add" type="primary" plain icon="Plus" @click="addSubImage(field.prop)">新增图片</el-button>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="formOpen = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="detailOpen" title="详情" size="46%" append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item v-for="item in detailItems" :key="item.key" :label="item.label">
          <el-image
            v-if="isImageUrl(item.value)"
            :src="item.value"
            fit="cover"
            class="detail-image"
            :preview-src-list="[item.value]"
            :z-index="4000"
            preview-teleported
          />
          <pre v-else-if="typeof item.value === 'object'" class="json-view">{{ JSON.stringify(item.value, null, 2) }}</pre>
          <span v-else>{{ item.value || '-' }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  customResourceAction,
  deleteResource,
  getDeviceOptions,
  getInstanceOptions,
  getResource,
  getSubscribeDetailOptions,
  getTollgateOptions,
  pageResource,
  saveResource,
  tableResource,
  updateResource
} from '@/api/visual-library'
import { entityConfigs } from '../configs'

const props = defineProps({
  configKey: {
    type: String,
    required: true
  }
})

const config = computed(() => entityConfigs[props.configKey] || {})
const loading = ref(false)
const submitLoading = ref(false)
const tableList = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})
const formOpen = ref(false)
const formMode = ref('create')
const form = reactive({})
const formRef = ref(null)
const detailOpen = ref(false)
const detail = ref({})
const optionMap = reactive({})

const formTitle = computed(() => `${formMode.value === 'create' ? '新增' : '编辑'}${config.value.title || ''}`)
const rules = computed(() => {
  const result = {}
  ;(config.value.formFields || []).forEach((field) => {
    if (field.required) {
      result[field.prop] = [{ required: true, message: `请输入${field.label}`, trigger: 'blur' }]
    }
  })
  return result
})

const detailItems = computed(() => {
  const row = detail.value || {}
  const keys = Object.keys(row)
  return keys.map((key) => ({
    key,
    label: key,
    value: row[key]
  }))
})

watch(
  () => props.configKey,
  () => {
    resetQuery()
    loadOptions()
  }
)

onMounted(() => {
  loadOptions()
  loadList()
})

function fieldComponent(field) {
  if (['select', 'remoteDevice', 'remoteInstance', 'remoteTollgate', 'remoteSubscribeDetail'].includes(field.type)) return 'el-select'
  if (field.type === 'datetime') return 'el-date-picker'
  if (field.type === 'textarea') return 'el-input'
  if (field.type === 'switch') return 'el-switch'
  if (field.type === 'number') return 'el-input-number'
  return 'el-input'
}

function fieldProps(field) {
  if (field.type === 'datetime') {
    return {
      type: 'datetime',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: field.placeholder || `请选择${field.label}`
    }
  }
  if (field.type === 'textarea') {
    return {
      type: 'textarea',
      rows: 3,
      placeholder: field.placeholder || `请输入${field.label}`
    }
  }
  if (field.type === 'number') {
    return {
      controlsPosition: 'right',
      placeholder: field.placeholder || `请输入${field.label}`
    }
  }
  if (field.type === 'switch') return {}
  return {
    placeholder: field.placeholder || `请输入${field.label}`
  }
}

function fieldOptions(field) {
  if (field.options) return field.options
  if (field.type === 'remoteDevice') return optionMap.device || []
  if (field.type === 'remoteInstance') return optionMap.instance || []
  if (field.type === 'remoteTollgate') return optionMap.tollgate || []
  if (field.type === 'remoteSubscribeDetail') return optionMap.subscribeDetail || []
  return []
}

async function loadOptions() {
  const fields = [
    ...(config.value.filters || []),
    ...(config.value.formFields || []),
    ...((config.value.formFields || []).find((field) => field.type === 'subImages')?.fields || [])
  ]
  const types = new Set(fields.map((field) => field.type))
  const tasks = []
  if (types.has('remoteDevice')) tasks.push(getDeviceOptions().then((res) => (optionMap.device = normalizeOptions(res))))
  if (types.has('remoteInstance')) tasks.push(getInstanceOptions().then((res) => (optionMap.instance = normalizeOptions(res))))
  if (types.has('remoteTollgate')) tasks.push(getTollgateOptions().then((res) => (optionMap.tollgate = normalizeOptions(res))))
  if (types.has('remoteSubscribeDetail')) tasks.push(getSubscribeDetailOptions().then((res) => (optionMap.subscribeDetail = normalizeOptions(res))))
  await Promise.allSettled(tasks)
}

async function loadList() {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      ...(config.value.fixedParams || {})
    }
    const response = config.value.tableMode ? await tableResource(config.value, params) : await pageResource(config.value, params)
    const normalized = normalizePage(response)
    tableList.value = normalized.rows
    total.value = normalized.total
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  loadList()
}

function resetQuery() {
  Object.keys(queryParams).forEach((key) => {
    if (!['pageNum', 'pageSize'].includes(key)) delete queryParams[key]
  })
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  ;(config.value.filters || []).forEach((field) => {
    queryParams[field.prop] = undefined
  })
  loadList()
}

function openCreate() {
  clearForm()
  formMode.value = 'create'
  formOpen.value = true
}

async function openEdit(row) {
  clearForm()
  formMode.value = 'edit'
  const id = rowKey(row)
  try {
    const response = id ? await getResource(config.value, id) : row
    Object.assign(form, normalizeDetail(response) || row)
  } catch {
    Object.assign(form, row)
  }
  formOpen.value = true
}

async function openDetail(row) {
  const id = rowKey(row)
  try {
    const response = id ? await getResource(config.value, id) : row
    detail.value = normalizeDetail(response) || row
  } catch {
    detail.value = row
  }
  detailOpen.value = true
}

function submitForm() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    submitLoading.value = true
    try {
      if (formMode.value === 'create') {
        await saveResource(config.value, cleanupPayload(form))
      } else {
        await updateResource(config.value, cleanupPayload(form))
      }
      ElMessage.success('保存成功')
      formOpen.value = false
      loadList()
    } finally {
      submitLoading.value = false
    }
  })
}

function handleDelete(row) {
  const id = rowKey(row)
  if (!id) {
    ElMessage.warning('缺少主键，无法删除')
    return
  }
  ElMessageBox.confirm('确认删除该数据项？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteResource(config.value, id)
      ElMessage.success('删除成功')
      loadList()
    })
    .catch(() => {})
}

function runRowAction(action, row) {
  ElMessageBox.confirm(`确认执行“${action.label}”？`, '提示', { type: 'warning' })
    .then(async () => {
      await customResourceAction(action, row)
      ElMessage.success('操作成功')
      loadList()
    })
    .catch(() => {})
}

function rowKey(row) {
  return row?.[config.value.idField || 'id'] || row?.id || row?.Id || row?.ID || row?.instanceId || row?.ApeID || row?.TollgateID || row?.LaneNo || row?.unitCode
}

function displayValue(row, column) {
  if (column.join) {
    return column.join.map((key) => pickValue(row, key)).filter((value) => value !== undefined && value !== null && value !== '').join(column.joinSeparator || ':')
  }
  return pickValue(row, column.prop)
}

function pickValue(row, prop) {
  return getByPath(row, prop) ?? row?.[upperFirst(prop)] ?? row?.[lowerFirst(prop)]
}

function upperFirst(value) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function lowerFirst(value) {
  if (!value) return value
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function toProgress(value) {
  const number = Number(String(value || '0').replace('%', ''))
  if (Number.isNaN(number)) return 0
  return Math.max(0, Math.min(100, number))
}

function pickMedia(row) {
  const url = pickValue(row, 'storagePath') || pickValue(row, 'videoUrl') || pickValue(row, 'largeImage') || pickValue(row, 'StoragePath') || ''
  return {
    url,
    type: /\.(mp4|webm|ogg|m3u8|flv)$/i.test(url) ? 'video' : 'image'
  }
}

function addSubImage(prop) {
  const list = getByPath(form, prop) || []
  list.push({})
  setByPath(form, prop, list)
}

function removeSubImage(prop, index) {
  const list = getByPath(form, prop) || []
  list.splice(index, 1)
  setByPath(form, prop, list)
}

function clearForm() {
  Object.keys(form).forEach((key) => delete form[key])
  ;(config.value.formFields || []).forEach((field) => {
    if (field.type === 'subImages') setByPath(form, field.prop, [])
    else if (field.type === 'switch') setByPath(form, field.prop, false)
    else setByPath(form, field.prop, undefined)
  })
}

function cleanupPayload(source) {
  return JSON.parse(JSON.stringify(source))
}

function getByPath(source, path) {
  if (!path) return undefined
  return String(path).split('.').reduce((target, key) => (target ? target[key] : undefined), source)
}

function setByPath(target, path, value) {
  const keys = String(path).split('.')
  let cursor = target
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value
      return
    }
    if (!cursor[key] || typeof cursor[key] !== 'object') cursor[key] = {}
    cursor = cursor[key]
  })
}

function normalizePage(response) {
  const data = response?.data ?? response
  const rows = response?.rows || data?.rows || data?.records || data?.list || data?.data || (Array.isArray(data) ? data : [])
  const totalValue = response?.total || data?.total || data?.totalCount || rows.length
  return {
    rows: Array.isArray(rows) ? rows : [],
    total: Number(totalValue || 0)
  }
}

function normalizeDetail(response) {
  return response?.data || response?.row || response
}

function normalizeOptions(response) {
  const data = response?.data ?? response
  const list = data?.rows || data?.records || data?.list || data?.data || data || []
  if (!Array.isArray(list)) return []
  return list.map((item) => ({
    label: item.label || item.name || item.Name || item.instanceName || item.deviceName || item.tollgateName || item.title || item.value,
    value: item.value || item.id || item.instanceId || item.ApeID || item.TollgateID || item.subscribeDetail || item.code || item.label
  }))
}

function isImageUrl(value) {
  return typeof value === 'string' && /\.(png|jpe?g|gif|webp|bmp)$/i.test(value)
}
</script>

<style scoped>
.visual-entity-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-card :deep(.el-card__body) {
  padding-bottom: 0;
}

.card-header,
.table-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.thumb {
  width: 56px;
  height: 42px;
  border-radius: 4px;
}

.pager {
  justify-content: flex-end;
  margin-top: 16px;
}

.entity-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 12px;
}

.entity-form :deep(.el-form-item) {
  min-width: 0;
}

.entity-form :deep(.el-form-item:has(.el-table)) {
  grid-column: 1 / -1;
}

.entity-form :deep(.el-input),
.entity-form :deep(.el-select),
.entity-form :deep(.el-date-editor),
.entity-form :deep(.el-input-number) {
  width: 100%;
}

.sub-add {
  margin-top: 10px;
}

.json-view {
  max-height: 240px;
  margin: 0;
  overflow: auto;
  white-space: pre-wrap;
}

.detail-image {
  width: 220px;
  max-height: 160px;
  border-radius: 4px;
}

.media-card {
  margin-bottom: 16px;
}

.media-preview {
  height: 180px;
  background: #f5f7fa;
}

.media-preview video,
.media-preview :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.media-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  color: #606266;
}

.media-title {
  color: #303133;
  font-weight: 600;
}

.media-actions {
  margin-top: 8px;
  text-align: right;
}
</style>
