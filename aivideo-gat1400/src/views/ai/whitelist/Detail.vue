<template>
  <div class="app-container whitelist-detail">
    <el-row :gutter="16" class="detail-main">
      <el-col :lg="6" :md="8" :sm="24" class="detail-side">
        <el-card shadow="never" class="side-card">
          <template #header>
            <div class="card-header">
              <div>
                <div>{{ isNew ? '新增白名单区域' : '白名单区域编辑' }}</div>
                <div class="side-subtitle">{{ form.name || '-' }}</div>
              </div>
            </div>
          </template>

          <el-form label-position="top">
            <el-form-item label="区域名称">
              <el-input v-model.trim="form.name" maxlength="50" show-word-limit placeholder="请输入区域名称" />
            </el-form-item>
          </el-form>

          <div class="camera-head">
            <div>
              <div class="side-label">摄像头列表</div>
              <div class="side-tip">新增后可用于白名单区域布控</div>
            </div>
            <el-button type="primary" size="small" icon="Plus" @click="openCameraDialog">新增</el-button>
          </div>

          <div v-if="cameras.length" class="camera-list">
            <div v-for="camera in cameras" :key="camera.id" class="camera-item">
              <div class="camera-info">
                <div class="camera-name" :title="camera.name">{{ camera.name || '-' }}</div>
                <div class="camera-id">{{ camera.id }}</div>
              </div>
              <el-button type="danger" link @click="removeCamera(camera)">删除</el-button>
            </div>
          </div>
          <el-empty v-else description="暂无摄像头" :image-size="90" />
        </el-card>
      </el-col>

      <el-col :lg="18" :md="16" :sm="24" class="detail-result">
        <el-card shadow="never" class="result-card">
          <template #header>
            <div class="card-header">
              <span>白名单图片列表</span>
              <el-space>
                <el-button type="primary" icon="Plus" @click="triggerSingleUpload">新增</el-button>
                <el-button icon="Upload" @click="triggerBatchUpload">导入</el-button>
                <el-button icon="Refresh" @click="syncImages">同步</el-button>
              </el-space>
            </div>
          </template>

          <div class="image-body">
            <el-row v-if="images.length" :gutter="16">
              <el-col v-for="item in images" :key="item.id" :xs="24" :sm="12" :md="8" :lg="6" class="image-col">
                <el-card shadow="hover" :body-style="{ padding: '0' }" class="image-card">
                  <el-image
                    :src="item.url"
                    :preview-src-list="[item.url]"
                    :z-index="4000"
                    fit="cover"
                    preview-teleported
                    class="image-item"
                  />
                  <div class="image-meta">
                    <div class="image-name" :title="item.name">{{ item.name }}</div>
                    <div class="image-time">{{ formatDate(item.createdAt) }}</div>
                    <div class="image-actions">
                      <el-button type="danger" link @click="removeImage(item)">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div v-else class="empty-wrap">
              <el-empty description="暂无白名单图片" :image-size="120" />
            </div>
          </div>

          <div class="result-footer">
            <el-button @click="goBack">返回</el-button>
            <el-button type="primary" :loading="saveLoading" @click="saveArea">保存</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="cameraDialogVisible" title="新增摄像头" width="560px" append-to-body>
      <el-form label-width="110px">
        <el-form-item label="摄像头名称">
          <el-select
            v-model="cameraForm.id"
            filterable
            remote
            clearable
            :remote-method="loadDeviceOption"
            :loading="deviceOptionsLoading"
            placeholder="请选择摄像头"
            style="width: 100%"
          >
            <el-option v-for="option in dialogDeviceOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="摄像头ID">
          <span>{{ cameraForm.id || '-' }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cameraDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddCamera">保存</el-button>
      </template>
    </el-dialog>

    <input ref="singleInputRef" type="file" accept="image/*" class="hidden-input" @change="handleSingleSelect" />
    <input ref="batchInputRef" type="file" accept="image/*" multiple class="hidden-input" @change="handleBatchSelect" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDeviceOptions } from '@/api/viid/common'
import {
  createWhitelistAreaId,
  createWhitelistImageId,
  getWhitelistArea,
  upsertWhitelistArea
} from './store'
import { fileToDataUrl, formatDate, getMockDeviceOptions, normalizeOptionList } from '../viid-utils'

const route = useRoute()
const router = useRouter()
const useMockDeviceOptions = true

const isNew = ref(true)
const areaId = ref('')
const createdAt = ref(0)
const syncAt = ref(0)
const form = reactive({ name: '' })
const cameras = ref([])
const images = ref([])
const saveLoading = ref(false)
const cameraDialogVisible = ref(false)
const cameraForm = reactive({ id: '' })
const deviceOptions = ref([])
const deviceOptionsLoading = ref(false)
const singleInputRef = ref()
const batchInputRef = ref()

const dialogDeviceOptions = computed(() => {
  const existingIds = new Set(cameras.value.map((camera) => camera.id))
  return deviceOptions.value.filter((option) => !existingIds.has(option.value))
})

watch(
  () => route.params.id,
  () => loadDetail(),
  { immediate: true }
)

function loadDetail() {
  const id = route.params.id
  if (!id || id === 'new') {
    isNew.value = true
    areaId.value = ''
    createdAt.value = 0
    syncAt.value = 0
    form.name = ''
    cameras.value = []
    images.value = []
    return
  }

  const area = getWhitelistArea(id)
  if (!area) {
    ElMessage.error('区域不存在')
    goBack()
    return
  }
  isNew.value = false
  areaId.value = area.id
  createdAt.value = area.createdAt || 0
  syncAt.value = area.syncAt || 0
  form.name = area.name || ''
  cameras.value = Array.isArray(area.cameras) ? [...area.cameras] : []
  images.value = Array.isArray(area.images) ? [...area.images] : []
}

function openCameraDialog() {
  cameraForm.id = ''
  cameraDialogVisible.value = true
  loadDeviceOption()
}

function loadDeviceOption(keyword = '') {
  deviceOptionsLoading.value = true
  const request = useMockDeviceOptions
    ? Promise.resolve({ data: getMockDeviceOptions(keyword) })
    : getDeviceOptions({ name: keyword, pageSize: 50 })

  request
    .then((response) => {
      deviceOptions.value = normalizeOptionList(response)
    })
    .finally(() => {
      deviceOptionsLoading.value = false
    })
}

function confirmAddCamera() {
  const id = String(cameraForm.id || '').trim()
  if (!id) {
    ElMessage.warning('请选择摄像头')
    return
  }
  if (cameras.value.some((item) => item.id === id)) {
    ElMessage.warning('摄像头已存在')
    return
  }
  const selected = deviceOptions.value.find((item) => item.value === id)
  cameras.value.push({
    id,
    name: selected?.label || id
  })
  cameraDialogVisible.value = false
}

function removeCamera(camera) {
  ElMessageBox.confirm(`确认删除摄像头“${camera.name || camera.id}”？`, '提示', { type: 'warning' })
    .then(() => {
      cameras.value = cameras.value.filter((item) => item.id !== camera.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function triggerSingleUpload() {
  singleInputRef.value?.click()
}

function triggerBatchUpload() {
  batchInputRef.value?.click()
}

async function handleSingleSelect(event) {
  const files = Array.from(event.target?.files || [])
  event.target.value = ''
  if (files.length) await appendFiles(files.slice(0, 1))
}

async function handleBatchSelect(event) {
  const files = Array.from(event.target?.files || [])
  event.target.value = ''
  if (files.length) await appendFiles(files)
}

async function appendFiles(files) {
  const added = []
  for (const file of files) {
    if (!file?.type?.startsWith('image/')) continue
    const url = await fileToDataUrl(file)
    added.push({
      id: createWhitelistImageId(),
      name: file.name || '未命名图片',
      url,
      createdAt: Date.now()
    })
  }
  if (!added.length) {
    ElMessage.warning('未读取到可用图片')
    return
  }
  images.value = [...added, ...images.value]
  ElMessage.success(`已添加 ${added.length} 张图片`)
}

function removeImage(image) {
  ElMessageBox.confirm('确认删除该白名单图片？', '提示', { type: 'warning' })
    .then(() => {
      images.value = images.value.filter((item) => item.id !== image.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function syncImages() {
  syncAt.value = Date.now()
  ElMessage.success('同步成功')
}

function saveArea() {
  const name = form.name.trim()
  if (!name) {
    ElMessage.warning('请输入区域名称')
    return
  }
  if (saveLoading.value) return
  saveLoading.value = true
  const now = Date.now()
  const id = isNew.value ? createWhitelistAreaId() : areaId.value
  upsertWhitelistArea({
    id,
    name,
    cameras: cameras.value,
    images: images.value,
    syncAt: syncAt.value || 0,
    createdAt: createdAt.value || now,
    updatedAt: now
  })
  isNew.value = false
  areaId.value = id
  createdAt.value = createdAt.value || now
  router.replace(`/ai/whitelist/${id}`)
  ElMessage.success('保存成功')
  saveLoading.value = false
}

function goBack() {
  router.push('/ai/whitelist')
}
</script>

<style scoped>
.whitelist-detail,
.detail-main,
.detail-side,
.detail-result,
.side-card,
.result-card {
  height: calc(100vh - 126px);
}

.side-card,
.result-card {
  display: flex;
  flex-direction: column;
}

.side-card :deep(.el-card__body),
.result-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
}

.side-subtitle {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
  font-weight: 400;
}

.camera-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin: 8px 0 12px;
}

.side-label {
  color: #606266;
  font-size: 13px;
  font-weight: 600;
}

.side-tip,
.camera-id,
.image-time {
  color: #909399;
  font-size: 12px;
}

.camera-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 320px);
  overflow: auto;
}

.camera-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

.camera-info {
  min-width: 0;
}

.camera-name,
.image-name {
  color: #303133;
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.image-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
}

.image-col {
  margin-bottom: 16px;
}

.image-card {
  border: 1px solid #ebeef5;
}

.image-item {
  width: 100%;
  height: 170px;
  background: #f8fafc;
}

.image-meta {
  padding: 10px;
}

.image-actions {
  margin-top: 6px;
  text-align: right;
}

.empty-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
}

.hidden-input {
  display: none;
}
</style>
