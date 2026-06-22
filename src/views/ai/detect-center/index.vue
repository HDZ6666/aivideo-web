<template>
  <div class="app-container ai-detect-center">
    <el-row :gutter="16" class="detect-layout">
      <el-col :lg="6" :md="8" :sm="24" class="detect-side">
        <el-card shadow="never" class="side-card">
          <template #header>
            <div class="card-header">
              <span>AI 检测中台</span>
              <el-button type="primary" link icon="Refresh" @click="loadModels">刷新</el-button>
            </div>
          </template>

          <el-input
            v-model="modelKeyword"
            clearable
            prefix-icon="Search"
            placeholder="搜索模型"
            class="model-search"
          />

          <div class="model-list">
            <div
              v-for="model in filteredModels"
              :key="model.id"
              class="model-card"
              :class="{ active: model.id === selectedModelId }"
              @click="selectModel(model)"
            >
              <div class="model-card-head">
                <div class="model-name" :title="model.name">{{ model.name }}</div>
                <el-tag size="small" :type="model.enabled ? 'success' : 'info'">
                  {{ model.enabled ? '可用' : '演示' }}
                </el-tag>
              </div>
              <div class="model-desc">{{ model.description }}</div>
              <div class="model-tags">
                <el-tag v-for="type in model.mediaTypes" :key="type" size="small" effect="plain">
                  {{ mediaTypeText(type) }}
                </el-tag>
                <el-tag size="small" type="warning" effect="plain">{{ model.engine }}</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="18" :md="16" :sm="24" class="detect-main">
        <el-card shadow="never" class="workspace-card">
          <template #header>
            <div class="workspace-head">
              <div>
                <div class="workspace-title">{{ selectedModel?.name || '请选择模型' }}</div>
                <div class="workspace-subtitle">
                  {{ selectedModel?.description || '选择模型并上传图片或视频后即可发起检测' }}
                </div>
              </div>
              <el-space>
                <el-switch
                  v-model="form.useMock"
                  active-text="演示模式"
                  inactive-text="接口模式"
                />
                <el-button type="primary" icon="Cpu" :loading="detecting" @click="runDetect">开始检测</el-button>
              </el-space>
            </div>
          </template>

          <div class="workspace-body">
            <div class="config-panel">
              <el-form :model="form" label-width="88px">
                <el-row :gutter="12">
                  <el-col :lg="8" :md="12" :sm="24">
                    <el-form-item label="媒体类型">
                      <el-segmented v-model="form.mediaType" :options="mediaTypeOptions" />
                    </el-form-item>
                  </el-col>
                  <el-col :lg="8" :md="12" :sm="24">
                    <el-form-item label="置信度">
                      <el-slider v-model="form.threshold" :min="0.1" :max="0.95" :step="0.05" show-input />
                    </el-form-item>
                  </el-col>
                  <el-col :lg="8" :md="12" :sm="24">
                    <el-form-item label="最大结果">
                      <el-input-number v-model="form.maxResults" :min="1" :max="200" controls-position="right" />
                    </el-form-item>
                  </el-col>
                  <el-col :lg="8" :md="12" :sm="24">
                    <el-form-item label="NMS">
                      <el-slider v-model="form.nms" :min="0.1" :max="0.9" :step="0.05" show-input />
                    </el-form-item>
                  </el-col>
                  <el-col :lg="8" :md="12" :sm="24">
                    <el-form-item label="绘制框">
                      <el-switch v-model="form.drawBoxes" />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="!form.useMock" :lg="16" :md="24" :sm="24">
                    <el-form-item label="接口地址">
                      <el-input v-model="form.endpoint" placeholder="/ai/api/model/detect" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <el-row :gutter="16" class="detect-content">
              <el-col :lg="10" :md="24" class="upload-col">
                <el-card shadow="never" class="upload-card">
                  <template #header>
                    <span>检测素材</span>
                  </template>

                  <el-upload
                    drag
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    :accept="uploadAccept"
                    :on-change="handleFileChange"
                    class="media-uploader"
                  >
                    <div v-if="!previewUrl" class="upload-placeholder">
                      <el-icon><UploadFilled /></el-icon>
                      <div>拖拽图片或视频到此处，或点击上传</div>
                      <span>支持 jpg/png/webp/mp4/webm/mov</span>
                    </div>
                    <div v-else class="preview-wrap">
                      <img v-if="isImage" :src="previewUrl" alt="" />
                      <video v-else :src="previewUrl" controls />
                      <div class="preview-mask">
                        <el-icon><Refresh /></el-icon>
                        <span>替换素材</span>
                      </div>
                    </div>
                  </el-upload>

                  <div v-if="selectedFile" class="file-meta">
                    <div class="file-name" :title="selectedFile.name">{{ selectedFile.name }}</div>
                    <div>{{ formatFileSize(selectedFile.size) }} / {{ selectedFile.type || '-' }}</div>
                  </div>
                </el-card>
              </el-col>

              <el-col :lg="14" :md="24" class="result-col">
                <el-card shadow="never" class="result-card">
                  <template #header>
                    <div class="card-header">
                      <span>检测结果</span>
                      <el-space>
                        <el-tag v-if="resultSummary.costTime">{{ resultSummary.costTime }} ms</el-tag>
                        <el-tag type="success">{{ detections.length }} 个目标</el-tag>
                      </el-space>
                    </div>
                  </template>

                  <div v-if="!resultReady" class="empty-result">
                    <el-empty description="暂无检测结果" />
                  </div>

                  <template v-else>
                    <div v-if="isImage && previewUrl" class="image-result">
                      <div ref="imageBoxRef" class="image-result-inner">
                        <img :src="previewUrl" alt="" @load="handleImageLoad" />
                        <template v-if="form.drawBoxes">
                          <div
                            v-for="item in detectionsWithBox"
                            :key="item.id"
                            class="detect-box"
                            :style="boxStyle(item.box)"
                          >
                            <span>{{ item.label }} {{ Math.round(item.score * 100) }}%</span>
                          </div>
                        </template>
                      </div>
                    </div>

                    <el-table :data="detections" border size="small" class="result-table">
                      <el-table-column label="类别" min-width="120" show-overflow-tooltip>
                        <template #default="{ row }">
                          <el-tag>{{ row.label }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column label="置信度" width="110" align="center">
                        <template #default="{ row }">{{ Math.round(row.score * 100) }}%</template>
                      </el-table-column>
                      <el-table-column label="位置/时间" min-width="170" show-overflow-tooltip>
                        <template #default="{ row }">
                          {{ row.timeText || formatBox(row.box) || '-' }}
                        </template>
                      </el-table-column>
                      <el-table-column label="说明" min-width="180" show-overflow-tooltip>
                        <template #default="{ row }">{{ row.remark || '-' }}</template>
                      </el-table-column>
                    </el-table>

                    <el-collapse class="raw-result">
                      <el-collapse-item title="原始响应 JSON" name="raw">
                        <pre>{{ JSON.stringify(rawResult, null, 2) }}</pre>
                      </el-collapse-item>
                    </el-collapse>
                  </template>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, UploadFilled } from '@element-plus/icons-vue'
import { detectMedia } from '@/api/ai/detect-center'
import { listCategory } from '@/api/ai/category'
import { formatFileSize, normalizeList } from '../utils'

const builtinModels = [
  {
    id: 'person-intrusion',
    name: '人员入侵检测',
    code: 'person-intrusion',
    description: '识别人员进入指定区域，适合图片与视频抽帧检测',
    mediaTypes: ['image', 'video'],
    engine: '产品自带AI',
    enabled: false,
    labels: ['person', 'helmet', 'vest']
  },
  {
    id: 'fire-smoke',
    name: '烟火检测',
    code: 'fire-smoke',
    description: '识别火焰、烟雾和疑似高温区域',
    mediaTypes: ['image', 'video'],
    engine: '云化AI',
    enabled: false,
    labels: ['fire', 'smoke']
  },
  {
    id: 'vehicle-event',
    name: '车辆事件检测',
    code: 'vehicle-event',
    description: '识别车辆、车牌和异常停车事件',
    mediaTypes: ['image', 'video'],
    engine: '产品自带AI',
    enabled: false,
    labels: ['car', 'truck', 'plate']
  }
]

const mediaTypeOptions = [
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' }
]

const models = ref([])
const selectedModelId = ref('')
const modelKeyword = ref('')
const selectedFile = ref(null)
const previewUrl = ref('')
const detecting = ref(false)
const rawResult = ref(null)
const imageSize = reactive({ width: 0, height: 0 })
const form = reactive({
  mediaType: 'image',
  threshold: 0.5,
  nms: 0.45,
  maxResults: 50,
  drawBoxes: true,
  useMock: true,
  endpoint: '/ai/api/model/detect'
})

const filteredModels = computed(() => {
  const key = modelKeyword.value.trim().toLowerCase()
  if (!key) return models.value
  return models.value.filter((item) => {
    return [item.name, item.code, item.description].some((value) => String(value || '').toLowerCase().includes(key))
  })
})
const selectedModel = computed(() => models.value.find((item) => item.id === selectedModelId.value))
const isImage = computed(() => form.mediaType === 'image')
const uploadAccept = computed(() => (isImage.value ? 'image/*' : 'video/*'))
const resultReady = computed(() => !!rawResult.value)
const detections = computed(() => normalizeDetections(rawResult.value))
const detectionsWithBox = computed(() => detections.value.filter((item) => item.box))
const resultSummary = computed(() => rawResult.value?.summary || rawResult.value?.data?.summary || {})

loadModels()

function loadModels() {
  listCategory({ page: 1, pageSize: 100 })
    .then((res) => {
      const data = normalizeList(res)
      const categoryModels = data.list.map((item) => ({
        id: String(item.alarmTypeId || item.id || item.alarmCode || item.alarmTypeName),
        name: item.alarmTypeName || item.name || item.alarmCode || '未命名模型',
        code: item.alarmCode || item.code || item.id || '',
        description: item.remark || item.description || '来自算法库的检测模型',
        mediaTypes: ['image', 'video'],
        engine: item.engineType === '1' ? '云化AI' : '产品自带AI',
        enabled: item.isUse === undefined ? true : item.isUse === 1,
        source: item,
        labels: [item.alarmTypeName || item.alarmCode || 'target']
      }))
      models.value = categoryModels.length ? categoryModels : builtinModels
    })
    .catch(() => {
      models.value = builtinModels
    })
    .finally(() => {
      if (!selectedModelId.value && models.value.length) {
        selectedModelId.value = models.value[0].id
      }
    })
}

function selectModel(model) {
  selectedModelId.value = model.id
}

function mediaTypeText(type) {
  return type === 'video' ? '视频' : '图片'
}

function handleFileChange(uploadFile) {
  const raw = uploadFile?.raw
  if (!raw) return
  const isVideoFile = raw.type?.startsWith('video/')
  const isImageFile = raw.type?.startsWith('image/')
  if (!isVideoFile && !isImageFile) {
    ElMessage.warning('请上传图片或视频文件')
    return
  }
  form.mediaType = isVideoFile ? 'video' : 'image'
  selectedFile.value = raw
  rawResult.value = null
  imageSize.width = 0
  imageSize.height = 0
  if (previewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(raw)
}

function handleImageLoad(event) {
  imageSize.width = event.target.naturalWidth || 0
  imageSize.height = event.target.naturalHeight || 0
}

function runDetect() {
  if (!selectedModel.value) {
    ElMessage.warning('请先选择检测模型')
    return
  }
  if (!selectedFile.value) {
    ElMessage.warning('请先上传检测素材')
    return
  }
  detecting.value = true
  rawResult.value = null

  if (form.useMock) {
    window.setTimeout(() => {
      rawResult.value = createMockResult()
      detecting.value = false
      ElMessage.success('检测完成')
    }, 700)
    return
  }

  const data = new FormData()
  data.append('file', selectedFile.value)
  data.append('modelId', selectedModel.value.id)
  data.append('modelCode', selectedModel.value.code || selectedModel.value.id)
  data.append('mediaType', form.mediaType)
  data.append('threshold', form.threshold)
  data.append('nms', form.nms)
  data.append('maxResults', form.maxResults)

  detectMedia(data, { url: form.endpoint })
    .then((res) => {
      rawResult.value = res || {}
      ElMessage.success('检测完成')
    })
    .finally(() => {
      detecting.value = false
    })
}

function createMockResult() {
  const now = Date.now()
  const labels = selectedModel.value?.labels?.length ? selectedModel.value.labels : ['target']
  const imageDetections = labels.slice(0, 4).map((label, index) => ({
    id: `${now}-${index}`,
    label,
    score: Math.max(form.threshold, 0.92 - index * 0.09),
    box: {
      x: [0.12, 0.45, 0.24, 0.62][index] || 0.2,
      y: [0.18, 0.24, 0.52, 0.36][index] || 0.2,
      width: [0.22, 0.28, 0.18, 0.2][index] || 0.2,
      height: [0.32, 0.22, 0.24, 0.18][index] || 0.2
    },
    remark: '演示检测结果'
  }))
  const videoDetections = labels.slice(0, 5).map((label, index) => ({
    id: `${now}-${index}`,
    label,
    score: Math.max(form.threshold, 0.9 - index * 0.07),
    timestamp: index * 3.5 + 1.2,
    frameIndex: index * 88 + 12,
    remark: '视频抽帧命中'
  }))
  return {
    modelId: selectedModel.value.id,
    modelName: selectedModel.value.name,
    mediaType: form.mediaType,
    summary: {
      costTime: Math.round(420 + Math.random() * 260),
      threshold: form.threshold,
      total: form.mediaType === 'image' ? imageDetections.length : videoDetections.length
    },
    detections: form.mediaType === 'image' ? imageDetections : videoDetections
  }
}

function normalizeDetections(result) {
  if (!result) return []
  const data = result.data || result
  const list = data.detections || data.objects || data.results || data.list || []
  if (!Array.isArray(list)) return []
  return list.slice(0, form.maxResults).map((item, index) => {
    const box = normalizeBox(item.box || item.bbox || item.rect || item)
    const timestamp = item.timestamp ?? item.time ?? item.second
    return {
      id: item.id || `${index}-${item.label || item.name || item.className || 'target'}`,
      label: item.label || item.name || item.className || item.category || 'target',
      score: normalizeScore(item.score ?? item.confidence ?? item.probability),
      box,
      timestamp,
      timeText: Number.isFinite(Number(timestamp)) ? `${Number(timestamp).toFixed(2)}s / 帧 ${item.frameIndex ?? '-'}` : '',
      remark: item.remark || item.message || item.eventName || ''
    }
  })
}

function normalizeScore(value) {
  const score = Number(value)
  if (!Number.isFinite(score)) return 0
  return score > 1 ? score / 100 : score
}

function normalizeBox(value) {
  if (!value) return null
  if (Array.isArray(value) && value.length >= 4) {
    const [x1, y1, x2, y2] = value.map(Number)
    if ([x1, y1, x2, y2].every(Number.isFinite)) {
      if (x2 > x1 && y2 > y1) return scaleBox({ x: x1, y: y1, width: x2 - x1, height: y2 - y1 })
      return scaleBox({ x: x1, y: y1, width: x2, height: y2 })
    }
  }
  const x = Number(value.x ?? value.left ?? value.x1)
  const y = Number(value.y ?? value.top ?? value.y1)
  const width = Number(value.width ?? value.w ?? ((value.x2 ?? value.right) - x))
  const height = Number(value.height ?? value.h ?? ((value.y2 ?? value.bottom) - y))
  if (![x, y, width, height].every(Number.isFinite)) return null
  return scaleBox({ x, y, width, height })
}

function scaleBox(box) {
  const shouldScale = [box.x, box.y, box.width, box.height].some((value) => value > 1)
  if (!shouldScale) return box
  const width = imageSize.width || 1
  const height = imageSize.height || 1
  return {
    x: box.x / width,
    y: box.y / height,
    width: box.width / width,
    height: box.height / height
  }
}

function boxStyle(box) {
  if (!box) return {}
  const x = clamp01(box.x)
  const y = clamp01(box.y)
  const width = clamp01(box.width)
  const height = clamp01(box.height)
  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`
  }
}

function formatBox(box) {
  if (!box) return ''
  return `x:${box.x.toFixed(3)}, y:${box.y.toFixed(3)}, w:${box.width.toFixed(3)}, h:${box.height.toFixed(3)}`
}

function clamp01(value) {
  return Math.min(1, Math.max(0, Number(value) || 0))
}

onBeforeUnmount(() => {
  if (previewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(previewUrl.value)
})
</script>

<style scoped>
.ai-detect-center,
.detect-layout,
.detect-side,
.detect-main,
.side-card,
.workspace-card {
  height: calc(100vh - 126px);
}

.side-card,
.workspace-card {
  display: flex;
  flex-direction: column;
}

.side-card :deep(.el-card__body),
.workspace-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
}

.model-search {
  margin-bottom: 12px;
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: calc(100% - 44px);
  overflow: auto;
  padding-right: 4px;
}

.model-card {
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.model-card:hover,
.model-card.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.model-card-head,
.workspace-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.model-name {
  min-width: 0;
  color: #303133;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-desc,
.workspace-subtitle,
.file-meta,
.upload-placeholder span {
  margin-top: 6px;
  color: #909399;
  font-size: 12px;
}

.model-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.workspace-title {
  color: #303133;
  font-size: 15px;
  font-weight: 600;
}

.workspace-card :deep(.el-card__body) {
  padding: 0;
}

.workspace-body {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.config-panel {
  padding: 14px 16px 0;
  border-bottom: 1px solid #ebeef5;
}

.detect-content {
  flex: 1;
  min-height: 0;
  padding: 16px;
}

.upload-col,
.result-col,
.upload-card,
.result-card {
  height: 100%;
}

.upload-card,
.result-card {
  display: flex;
  flex-direction: column;
}

.upload-card :deep(.el-card__body),
.result-card :deep(.el-card__body) {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.media-uploader,
.media-uploader :deep(.el-upload),
.media-uploader :deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
}

.upload-placeholder {
  height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #606266;
}

.upload-placeholder .el-icon {
  color: #909399;
  font-size: 42px;
}

.preview-wrap {
  position: relative;
  height: 360px;
}

.preview-wrap img,
.preview-wrap video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #111827;
}

.preview-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: rgba(0, 0, 0, 0.42);
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-wrap:hover .preview-mask {
  opacity: 1;
}

.file-name {
  color: #303133;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-result {
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-result {
  margin-bottom: 12px;
  text-align: center;
  background: #111827;
  border-radius: 6px;
  padding: 10px;
}

.image-result-inner {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.image-result-inner img {
  display: block;
  max-width: 100%;
  max-height: 360px;
}

.detect-box {
  position: absolute;
  border: 2px solid #22c55e;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
}

.detect-box span {
  position: absolute;
  left: -2px;
  top: -24px;
  padding: 2px 6px;
  border-radius: 4px 4px 4px 0;
  color: #fff;
  background: #16a34a;
  font-size: 12px;
  white-space: nowrap;
}

.result-table {
  margin-top: 8px;
}

.raw-result {
  margin-top: 12px;
}

.raw-result pre {
  max-height: 320px;
  margin: 0;
  padding: 12px;
  overflow: auto;
  border-radius: 4px;
  background: #f8fafc;
}
</style>
