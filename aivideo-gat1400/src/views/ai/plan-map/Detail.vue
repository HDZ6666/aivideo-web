<template>
  <div class="app-container plan-map-detail">
    <el-row :gutter="16" class="detail-main">
      <el-col :lg="6" :md="8" :sm="24" class="detail-side">
        <el-card shadow="never" class="side-card">
          <template #header>
            <div class="card-header">
              <div>
                <div>平面图标注</div>
                <div class="side-subtitle">{{ regionName || '-' }}</div>
              </div>
              <el-button type="primary" link @click="goBack">返回</el-button>
            </div>
          </template>

          <div class="side-section">
            <div class="side-section-head">
              <div>
                <div class="side-label">摄像头列表</div>
                <div class="side-tip">先选摄像头，再在平面图上点击标注位置</div>
              </div>
              <el-button type="primary" size="small" icon="Plus" @click="openCameraDialog">新增</el-button>
            </div>

            <div v-if="cameras.length" class="camera-list">
              <div
                v-for="camera in cameras"
                :key="camera.id"
                class="camera-item"
                :class="{ active: camera.id === activeCameraId }"
                @click="selectCamera(camera)"
              >
                <div class="camera-info">
                  <div class="camera-name" :title="camera.name">{{ camera.name }}</div>
                  <el-tag size="small" :type="getMarker(camera.id) ? 'success' : 'info'">
                    {{ getMarker(camera.id) ? '已标注' : '未标注' }}
                  </el-tag>
                </div>
                <div class="camera-actions">
                  <el-button type="primary" link @click.stop="editCamera(camera)">编辑</el-button>
                  <el-button type="danger" link @click.stop="removeCamera(camera)">删除</el-button>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂无摄像头" :image-size="90" />
          </div>
        </el-card>
      </el-col>

      <el-col :lg="18" :md="16" :sm="24" class="detail-result">
        <el-card shadow="never" class="canvas-card">
          <div class="canvas-toolbar">
            <el-button-group>
              <el-button
                icon="Rank"
                :type="isPanMode ? 'primary' : 'default'"
                :disabled="!imageUrl"
                @click="togglePanMode"
              />
              <el-button icon="ZoomIn" :disabled="!imageUrl" @click="canvasRef?.zoomIn()" />
              <el-button icon="ZoomOut" :disabled="!imageUrl" @click="canvasRef?.zoomOut()" />
              <el-button icon="Refresh" :disabled="!imageUrl" @click="canvasRef?.resetView()" />
            </el-button-group>
          </div>

          <PlanCanvas
            ref="canvasRef"
            mode="edit"
            :image-url="imageUrl"
            :image-width="imageSize.width"
            :image-height="imageSize.height"
            :markers="markers"
            :active-marker-id="activeCameraId"
            :hover-marker-id="hoverCameraId"
            :marker-name-map="cameraNameMap"
            :show-marker-labels="true"
            :is-pan-mode="isPanMode"
            :show-image-bounds="true"
            empty-text="暂无平面图"
            @canvas-click="handleCanvasClick"
            @marker-click="handleMarkerClick"
            @marker-enter="handleMarkerEnter"
            @marker-leave="handleMarkerLeave"
          />

          <div class="canvas-footer">
            <el-button @click="goBack">返回</el-button>
            <el-button type="primary" :loading="saveLoading" @click="savePlan">保存</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" append-to-body>
      <el-form label-width="110px">
        <el-form-item label="摄像头名称">
          <el-select
            v-if="dialogEditable"
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
          <span v-else>{{ detailInfo.cameraName }}</span>
        </el-form-item>
        <el-form-item label="摄像头ID">
          <span>{{ cameraForm.id || detailInfo.cameraId || '-' }}</span>
        </el-form-item>
        <el-form-item label="区域名称">
          <span>{{ regionName || '-' }}</span>
        </el-form-item>
        <el-form-item label="图片尺寸">
          <span>{{ imageSize.width && imageSize.height ? `${imageSize.width} x ${imageSize.height}` : '-' }}</span>
        </el-form-item>
        <el-form-item label="比例坐标">
          <span>{{ detailInfo.ratioText }}</span>
        </el-form-item>
        <el-form-item label="像素坐标">
          <span>{{ detailInfo.pixelText }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ dialogEditable ? '取消' : '关闭' }}</el-button>
        <el-button v-if="dialogEditable" type="primary" @click="saveCamera">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import PlanCanvas from '@/components/PlanCanvas/index.vue'
import { getDeviceOptions } from '@/api/viid/common'
import { getPlanMap, upsertPlanMap } from './store'
import { getMockDeviceOptions, normalizeOptionList } from '../viid-utils'

const route = useRoute()
const router = useRouter()
const useMockDeviceOptions = true

const canvasRef = ref()
const regionId = ref('')
const regionName = ref('')
const createdAt = ref(0)
const imageUrl = ref('')
const imageSize = reactive({ width: 0, height: 0 })
const cameras = ref([])
const markers = ref([])
const activeCameraId = ref('')
const hoverCameraId = ref('')
const isPanMode = ref(true)
const saveLoading = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref('view')
const detailCameraId = ref('')
const cameraForm = reactive({ id: '' })
const deviceOptions = ref([])
const deviceOptionsLoading = ref(false)

const cameraNameMap = computed(() => {
  const map = {}
  cameras.value.forEach((camera) => {
    map[camera.id] = camera.name
  })
  return map
})

const dialogTitle = computed(() => {
  if (dialogMode.value === 'create') return '新增摄像头'
  if (dialogMode.value === 'edit') return '编辑摄像头'
  return '摄像头详情'
})
const dialogEditable = computed(() => ['create', 'edit'].includes(dialogMode.value))
const dialogDeviceOptions = computed(() => {
  const existingIds = new Set(cameras.value.map((camera) => camera.id))
  if (dialogMode.value === 'edit' && detailCameraId.value) existingIds.delete(detailCameraId.value)
  const filtered = deviceOptions.value.filter((option) => !existingIds.has(option.value))
  const currentId = String(cameraForm.id || '').trim()
  if (currentId && !filtered.some((option) => option.value === currentId)) {
    const currentCamera = getCamera(detailCameraId.value) || getCamera(currentId)
    filtered.unshift({ value: currentId, label: currentCamera?.name || currentId })
  }
  return filtered
})
const detailInfo = computed(() => {
  const camera = getCamera(detailCameraId.value) || {}
  const marker = getMarker(detailCameraId.value)
  const ratioX = marker ? Number(marker.xRatio) : null
  const ratioY = marker ? Number(marker.yRatio) : null
  const pixelX = ratioX !== null ? Math.round(ratioX * imageSize.width) : null
  const pixelY = ratioY !== null ? Math.round(ratioY * imageSize.height) : null
  return {
    cameraName: camera.name || '-',
    cameraId: camera.id || '-',
    ratioText: ratioX !== null ? `${ratioX.toFixed(4)}, ${ratioY.toFixed(4)}` : '-',
    pixelText: pixelX !== null ? `${pixelX}, ${pixelY}` : '-'
  }
})

watch(
  () => route.params.id,
  () => loadPlan(),
  { immediate: true }
)

function loadPlan() {
  const id = route.params.id
  if (!id) return
  const plan = getPlanMap(id)
  if (!plan) {
    ElMessage.error('平面图区域不存在')
    router.replace('/ai/plan-map')
    return
  }
  regionId.value = plan.id
  regionName.value = plan.name
  createdAt.value = plan.createdAt || 0
  imageUrl.value = plan.imageUrl || ''
  imageSize.width = plan.imageWidth || 0
  imageSize.height = plan.imageHeight || 0
  cameras.value = Array.isArray(plan.cameras) ? [...plan.cameras] : []
  markers.value = Array.isArray(plan.markers) ? [...plan.markers] : []
  activeCameraId.value = ''
  detailCameraId.value = ''
  isPanMode.value = true
}

function togglePanMode() {
  isPanMode.value = !isPanMode.value
  if (isPanMode.value) activeCameraId.value = ''
}

function openCameraDialog() {
  dialogMode.value = 'create'
  detailCameraId.value = ''
  cameraForm.id = ''
  dialogVisible.value = true
  loadDeviceOption()
}

function editCamera(camera) {
  dialogMode.value = 'edit'
  detailCameraId.value = camera.id
  cameraForm.id = camera.id
  dialogVisible.value = true
  loadDeviceOption(camera.name || camera.id)
}

function saveCamera() {
  const id = String(cameraForm.id || '').trim()
  if (!id) {
    ElMessage.warning('请选择摄像头')
    return
  }
  const selected = dialogDeviceOptions.value.find((item) => item.value === id)
  const name = selected?.label || id

  if (dialogMode.value === 'create') {
    if (getCamera(id)) {
      ElMessage.warning('摄像头已存在')
      return
    }
    cameras.value.push({ id, name })
    activeCameraId.value = id
    detailCameraId.value = id
    isPanMode.value = false
  } else {
    const oldId = detailCameraId.value
    if (id !== oldId && getCamera(id)) {
      ElMessage.warning('摄像头已存在')
      return
    }
    const camera = getCamera(oldId)
    if (camera) {
      camera.id = id
      camera.name = name
    }
    const marker = getMarker(oldId)
    if (marker && id !== oldId) marker.cameraId = id
    if (activeCameraId.value === oldId) activeCameraId.value = id
    detailCameraId.value = id
  }
  dialogVisible.value = false
}

function removeCamera(camera) {
  ElMessageBox.confirm(`确认删除摄像头“${camera.name || camera.id}”？`, '提示', { type: 'warning' })
    .then(() => {
      cameras.value = cameras.value.filter((item) => item.id !== camera.id)
      markers.value = markers.value.filter((item) => item.cameraId !== camera.id)
      if (activeCameraId.value === camera.id) {
        activeCameraId.value = ''
        detailCameraId.value = ''
        isPanMode.value = true
      }
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function selectCamera(camera) {
  if (activeCameraId.value === camera.id) {
    activeCameraId.value = ''
    detailCameraId.value = ''
    isPanMode.value = true
    return
  }
  activeCameraId.value = camera.id
  detailCameraId.value = camera.id
  isPanMode.value = false
}

function handleCanvasClick(payload) {
  if (!activeCameraId.value) {
    ElMessage.warning('请先选择摄像头')
    return
  }
  const marker = getMarker(activeCameraId.value)
  if (marker) {
    marker.xRatio = payload.xRatio
    marker.yRatio = payload.yRatio
  } else {
    markers.value.push({
      cameraId: activeCameraId.value,
      xRatio: payload.xRatio,
      yRatio: payload.yRatio
    })
  }
}

function handleMarkerClick(marker, event) {
  if (event) event.cancelBubble = true
  activeCameraId.value = marker.cameraId
  detailCameraId.value = marker.cameraId
  isPanMode.value = false
  dialogMode.value = 'view'
  cameraForm.id = marker.cameraId
  dialogVisible.value = true
}

function handleMarkerEnter(marker) {
  hoverCameraId.value = marker.cameraId
}

function handleMarkerLeave(marker) {
  if (hoverCameraId.value === marker.cameraId) hoverCameraId.value = ''
}

function getCamera(id) {
  return cameras.value.find((item) => item.id === id)
}

function getMarker(id) {
  return markers.value.find((item) => item.cameraId === id)
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

function savePlan() {
  if (!regionId.value || saveLoading.value) return
  if (!imageUrl.value) {
    ElMessage.warning('暂无平面图，无法保存')
    return
  }
  const now = Date.now()
  saveLoading.value = true
  upsertPlanMap({
    id: regionId.value,
    name: regionName.value,
    imageUrl: imageUrl.value,
    imageWidth: imageSize.width,
    imageHeight: imageSize.height,
    cameras: cameras.value,
    markers: markers.value,
    createdAt: createdAt.value || now,
    updatedAt: now
  })
  ElMessage.success('保存成功')
  saveLoading.value = false
}

function goBack() {
  router.push('/ai/plan-map')
}
</script>

<style scoped>
.plan-map-detail,
.detail-main,
.detail-side,
.detail-result,
.side-card,
.canvas-card {
  height: calc(100vh - 126px);
}

.side-card,
.canvas-card {
  display: flex;
  flex-direction: column;
}

.side-card :deep(.el-card__body),
.canvas-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
}

.side-subtitle {
  margin-top: 4px;
  color: #909399;
  font-size: 12px;
  font-weight: 400;
}

.side-section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.side-label {
  color: #606266;
  font-size: 13px;
  font-weight: 600;
}

.side-tip {
  margin-top: 6px;
  color: #909399;
  font-size: 12px;
}

.camera-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 260px);
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
  cursor: pointer;
  transition: 0.2s;
}

.camera-item:hover,
.camera-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.camera-info {
  min-width: 0;
}

.camera-name {
  margin-bottom: 6px;
  color: #303133;
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.camera-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.canvas-card {
  position: relative;
}

.canvas-card :deep(.el-card__body) {
  position: relative;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.canvas-toolbar {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 5;
  padding: 6px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.canvas-card :deep(.plan-canvas) {
  flex: 1;
}

.canvas-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
}
</style>
