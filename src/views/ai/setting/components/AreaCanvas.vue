<template>
  <div class="area-canvas">
    <el-row :gutter="12" class="mb12">
      <el-col :span="6">
        <el-select v-model="area.canvasType" style="width: 100%" @change="changeType">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="18">
        <el-space wrap>
          <el-button type="danger" @click="clear">重绘</el-button>
          <el-button v-if="isPolygon && draftPoints.length" @click="undoPoint">撤销</el-button>
          <el-button v-if="isPolygon" type="primary" :disabled="draftPoints.length < 3" @click="completePolygon">
            完成区域
          </el-button>
          <slot />
        </el-space>
      </el-col>
    </el-row>

    <div class="canvas-wrap" :style="{ width: `${area.width}px`, height: `${area.height}px` }">
      <img
        v-if="imageUrl"
        class="canvas-image"
        :src="imageUrl"
        :alt="imageUrl"
        @load="imageLoaded = true"
        @error="imageLoaded = true"
      />
      <div v-else class="canvas-empty">暂无抓图</div>
      <svg
        class="canvas-svg"
        :width="area.width"
        :height="area.height"
        :viewBox="`0 0 ${area.width} ${area.height}`"
        @mousedown="handleDown"
        @mousemove="handleMove"
        @mouseup="handleUp"
        @mouseleave="handleUp"
        @contextmenu.prevent
      >
        <defs>
          <marker id="area-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="rgba(255, 0, 0, .75)" />
          </marker>
        </defs>

        <template v-for="(points, index) in area.list" :key="`saved-${index}`">
          <polygon
            v-if="isAreaShape"
            :points="pointsToString(points)"
            class="area-polygon"
            :class="{ except: area.canvasType === 'except' }"
          />
          <polyline
            v-if="isPolygon && points.length > 1"
            :points="pointsToString(points.concat([points[0]]))"
            class="area-line"
          />
          <line
            v-if="isLineShape && points.length >= 2"
            :x1="points[0].x"
            :y1="points[0].y"
            :x2="points[1].x"
            :y2="points[1].y"
            class="area-line"
            :marker-end="lineMarkerEnd"
          />
        </template>

        <polyline v-if="isPolygon && draftPoints.length" :points="pointsToString(previewPolygon)" class="area-line draft" />
        <circle v-for="(point, index) in allPoints" :key="`point-${index}`" :cx="point.x" :cy="point.y" r="3" class="area-point" />

        <polygon v-if="isRectShape && previewRect.length" :points="pointsToString(previewRect)" class="area-polygon draft" />
        <line
          v-if="isLineShape && linePreview.length >= 2"
          :x1="linePreview[0].x"
          :y1="linePreview[0].y"
          :x2="linePreview[1].x"
          :y2="linePreview[1].y"
          class="area-line draft"
          :marker-end="lineMarkerEnd"
        />
        <text v-if="isLineShape && linePreview.length >= 2" :x="lineTextPosition.x" :y="lineTextPosition.y" class="area-text">
          {{ lineText }}
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { normalizeAreaSet, toImageUrl, cloneJson } from '../../utils'

const props = defineProps({
  modelValue: {
    type: [Object, String],
    default: undefined
  },
  bgImage: {
    type: Object,
    default: () => ({})
  },
  mtype: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue'])

const area = ref(normalizeAreaSet(props.modelValue))
const draftPoints = ref([])
const previewPoint = ref(null)
const rectStart = ref(null)
const rectCurrent = ref(null)
const lineStart = ref(null)
const lineCurrent = ref(null)
const drawing = ref(false)
const imageLoaded = ref(false)

const areaOptions = [
  { value: 'all', label: '全屏监控' },
  { value: 'polygon', label: '自定义监控区域' },
  { value: 'big', label: '最大区域' },
  { value: 'except', label: '排除区域' }
]

const lineOptions = [
  { value: 'linesegment', label: '线段(进/出)' },
  { value: 'linesegmentAB', label: '线段(进 -> 出)' },
  { value: 'linesegmentBA', label: '线段(出 -> 进)' }
]

watch(
  () => props.modelValue,
  (value) => {
    area.value = normalizeAreaSet(value)
    resetDraft()
  },
  { deep: true }
)

const selectOptions = computed(() => {
  if (props.mtype === 'area') return areaOptions
  if (props.mtype === 'line') return lineOptions
  return areaOptions.concat(lineOptions)
})

const imageUrl = computed(() => toImageUrl(props.bgImage?.realUrl || props.bgImage?.url || ''))
const isPolygon = computed(() => area.value.canvasType === 'polygon')
const isRectShape = computed(() => ['big', 'except'].includes(area.value.canvasType))
const isLineShape = computed(() => ['linesegment', 'linesegmentAB', 'linesegmentBA'].includes(area.value.canvasType))
const isAreaShape = computed(() => ['polygon', 'big', 'except'].includes(area.value.canvasType))
const lineMarkerEnd = computed(() => (area.value.canvasType === 'linesegmentBA' ? '' : 'url(#area-arrow)'))
const lineText = computed(() => {
  if (area.value.canvasType === 'linesegmentBA') return '出 -> 进'
  if (area.value.canvasType === 'linesegmentAB') return '进 -> 出'
  return '进 / 出'
})

const previewPolygon = computed(() => {
  const points = draftPoints.value.slice()
  if (previewPoint.value) points.push(previewPoint.value)
  return points
})

const previewRect = computed(() => {
  if (!rectStart.value || !rectCurrent.value) return []
  return rectToPoints(rectStart.value, rectCurrent.value)
})

const linePreview = computed(() => {
  if (lineStart.value && lineCurrent.value) return [lineStart.value, lineCurrent.value]
  if (lineStart.value) return [lineStart.value]
  return []
})

const lineTextPosition = computed(() => {
  if (linePreview.value.length < 2) return { x: 0, y: 0 }
  const [a, b] = linePreview.value
  return {
    x: (a.x + b.x) / 2 + 8,
    y: (a.y + b.y) / 2 - 8
  }
})

const allPoints = computed(() => {
  const saved = area.value.list.flat()
  return saved.concat(draftPoints.value)
})

function sync() {
  emit('update:modelValue', cloneJson(area.value))
}

function resetDraft() {
  draftPoints.value = []
  previewPoint.value = null
  rectStart.value = null
  rectCurrent.value = null
  lineStart.value = null
  lineCurrent.value = null
  drawing.value = false
}

function changeType(type) {
  area.value = {
    ...area.value,
    canvasType: type,
    list: []
  }
  resetDraft()
  sync()
}

function clear() {
  area.value.list = []
  resetDraft()
  sync()
}

function undoPoint() {
  draftPoints.value.pop()
}

function completePolygon() {
  if (draftPoints.value.length < 3) {
    ElMessage.warning('请至少绘制三个点')
    return
  }
  area.value.list.push(cloneJson(draftPoints.value))
  draftPoints.value = []
  previewPoint.value = null
  sync()
}

function handleDown(event) {
  const point = getPoint(event)
  if (area.value.canvasType === 'all') return
  if (isPolygon.value) {
    draftPoints.value.push(point)
    return
  }
  if (isRectShape.value) {
    drawing.value = true
    rectStart.value = point
    rectCurrent.value = point
    return
  }
  if (isLineShape.value) {
    if (!lineStart.value) {
      lineStart.value = point
      lineCurrent.value = point
      return
    }
    const distance = Math.hypot(point.x - lineStart.value.x, point.y - lineStart.value.y)
    if (distance < 50) {
      ElMessage.warning('距离不能少于50')
      return
    }
    area.value.list = [[cloneJson(lineStart.value), point]]
    lineStart.value = null
    lineCurrent.value = null
    sync()
  }
}

function handleMove(event) {
  const point = getPoint(event)
  if (isPolygon.value) {
    previewPoint.value = point
    return
  }
  if (isRectShape.value && drawing.value) {
    rectCurrent.value = point
    return
  }
  if (isLineShape.value && lineStart.value) {
    lineCurrent.value = point
  }
}

function handleUp() {
  if (isRectShape.value && drawing.value && rectStart.value && rectCurrent.value) {
    const points = rectToPoints(rectStart.value, rectCurrent.value)
    if (Math.abs(points[1].x - points[0].x) > 5 && Math.abs(points[2].y - points[1].y) > 5) {
      area.value.list = [points]
      sync()
    }
  }
  drawing.value = false
}

function getPoint(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top)
  }
}

function rectToPoints(start, end) {
  const x1 = Math.min(start.x, end.x)
  const y1 = Math.min(start.y, end.y)
  const x2 = Math.max(start.x, end.x)
  const y2 = Math.max(start.y, end.y)
  return [
    { x: x1, y: y1 },
    { x: x2, y: y1 },
    { x: x2, y: y2 },
    { x: x1, y: y2 }
  ]
}

function pointsToString(points) {
  return (points || []).map((point) => `${point.x},${point.y}`).join(' ')
}
</script>

<style scoped>
.area-canvas {
  width: 100%;
}

.canvas-wrap {
  position: relative;
  background: #a0a0a0;
  overflow: hidden;
}

.canvas-image,
.canvas-empty,
.canvas-svg {
  position: absolute;
  inset: 0;
}

.canvas-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.canvas-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #606266;
}

.canvas-svg {
  cursor: crosshair;
}

.area-polygon {
  fill: rgba(255, 0, 0, .18);
  stroke: rgba(255, 0, 0, .75);
  stroke-width: 2;
}

.area-polygon.except {
  fill: rgba(255, 153, 0, .24);
}

.area-polygon.draft {
  stroke-dasharray: 5 5;
}

.area-line {
  fill: none;
  stroke: rgba(255, 0, 0, .75);
  stroke-width: 2;
}

.area-line.draft {
  stroke-dasharray: 5 5;
}

.area-point {
  fill: rgba(255, 0, 0, .85);
}

.area-text {
  fill: rgba(255, 0, 0, .9);
  font-size: 16px;
  font-weight: 700;
}
</style>

