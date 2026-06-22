<template>
  <div
    ref="wrapRef"
    class="plan-canvas"
    :class="{ 'is-pan': isPanMode && hasImage }"
    @wheel.prevent="handleWheel"
    @mousedown="handlePointerDown"
    @mousemove="handlePointerMove"
    @mouseup="handlePointerUp"
    @mouseleave="handlePointerUp"
  >
    <div v-if="!hasImage" class="plan-canvas-empty">{{ emptyText }}</div>
    <svg v-else class="plan-canvas-svg" :width="stageSize.width" :height="stageSize.height">
      <defs>
        <filter id="plan-marker-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,.2)" />
        </filter>
      </defs>

      <g :transform="imageTransform">
        <image :href="imageUrl" :width="imageWidth" :height="imageHeight" preserveAspectRatio="none" />
        <rect
          v-if="showImageBounds"
          :width="imageWidth"
          :height="imageHeight"
          fill="none"
          stroke="rgba(107,114,128,.45)"
          stroke-dasharray="8 5"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
        />

        <polyline
          v-if="showTrackLine && trackLinePoints"
          :points="trackLinePoints"
          fill="none"
          stroke="#f97316"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />

        <g
          v-for="marker in normalizedMarkers"
          :key="marker.id"
          class="plan-marker"
          :transform="`translate(${marker.x}, ${marker.y})`"
          @click.stop="emitMarkerClick(marker, $event)"
          @mouseenter="emit('marker-enter', marker.raw)"
          @mouseleave="emit('marker-leave', marker.raw)"
        >
          <circle
            v-if="marker.active"
            :r="markerRadius * 1.42"
            fill="rgba(245,158,11,.18)"
            stroke="#f59e0b"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
          />
          <circle
            :r="markerRadius"
            fill="#fff"
            stroke="#f59e0b"
            stroke-width="2"
            filter="url(#plan-marker-shadow)"
            vector-effect="non-scaling-stroke"
          />
          <path
            :d="cameraPath"
            :transform="`scale(${cameraIconSize.width / 24}) translate(-12 -12)`"
            fill="#1d4ed8"
          />
          <g v-if="showMarkerLabels">
            <rect
              :x="marker.labelBox.x"
              :y="marker.labelBox.y"
              :width="marker.labelBox.width"
              :height="marker.labelBox.height"
              rx="4"
              fill="rgba(255,255,255,.96)"
              stroke="rgba(245,158,11,.75)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
            />
            <text
              :x="marker.labelBox.x + 6"
              :y="marker.labelBox.y + 15"
              font-size="12"
              fill="#1f2937"
            >
              {{ marker.label }}
            </text>
          </g>
        </g>

        <g
          v-for="(point, index) in normalizedTrackPoints"
          :key="point.id"
          class="track-point"
          :transform="`translate(${point.x}, ${point.y})`"
          @click.stop="emit('track-point-click', point.raw, index, $event)"
        >
          <circle r="10" fill="#ef4444" stroke="#fff" stroke-width="2" vector-effect="non-scaling-stroke" />
          <text x="0" y="4" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">
            {{ point.order }}
          </text>
        </g>

        <g v-if="playback.visible" :transform="`translate(${playback.x}, ${playback.y}) rotate(${playback.angle})`">
          <circle r="11" fill="rgba(37,99,235,.2)" />
          <circle r="5" fill="#2563eb" stroke="#fff" stroke-width="1.5" />
          <path d="M -2 -4 L 6 0 L -2 4 Z" fill="#fff" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'view'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  imageWidth: {
    type: Number,
    default: 0
  },
  imageHeight: {
    type: Number,
    default: 0
  },
  markers: {
    type: Array,
    default: () => []
  },
  activeMarkerId: {
    type: String,
    default: ''
  },
  hoverMarkerId: {
    type: String,
    default: ''
  },
  markerNameMap: {
    type: Object,
    default: () => ({})
  },
  showMarkerLabels: {
    type: Boolean,
    default: false
  },
  trackPoints: {
    type: Array,
    default: () => []
  },
  showTrackLine: {
    type: Boolean,
    default: false
  },
  showImageBounds: {
    type: Boolean,
    default: false
  },
  isPanMode: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无图片'
  },
  cameraIconSize: {
    type: Object,
    default: () => ({ width: 24, height: 24 })
  },
  trackPlaybackDuration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits([
  'canvas-click',
  'marker-click',
  'marker-enter',
  'marker-leave',
  'track-point-click',
  'track-playback-change',
  'view-change'
])

const wrapRef = ref()
const stageSize = reactive({ width: 200, height: 200 })
const view = reactive({
  scale: 1,
  minScale: 1,
  maxScale: 4,
  x: 0,
  y: 0
})
const dragging = reactive({
  active: false,
  x: 0,
  y: 0
})
const playback = reactive({
  visible: false,
  running: false,
  progress: 0,
  x: 0,
  y: 0,
  angle: 0,
  segments: [],
  totalLength: 0,
  startTs: 0,
  baseProgress: 0,
  raf: null
})

let resizeObserver

const hasImage = computed(() => !!props.imageUrl && props.imageWidth > 0 && props.imageHeight > 0)
const imageTransform = computed(() => `translate(${view.x}, ${view.y}) scale(${view.scale})`)
const markerRadius = computed(() => Math.max(props.cameraIconSize.width, props.cameraIconSize.height) * 0.58)
const cameraPath = 'M7 7h7.5l1.8-2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.2L7 7Zm5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-2.2a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Z'

const normalizedMarkers = computed(() => {
  return props.markers
    .map((marker) => {
      const id = marker.cameraId || marker.id || ''
      const xRatio = Number(marker.xRatio)
      const yRatio = Number(marker.yRatio)
      if (!Number.isFinite(xRatio) || !Number.isFinite(yRatio)) return null
      const rawLabel = marker.name || props.markerNameMap[id] || id || '-'
      const label = truncateText(rawLabel, 18)
      return {
        id,
        raw: marker,
        x: xRatio * props.imageWidth,
        y: yRatio * props.imageHeight,
        label,
        active: id === props.activeMarkerId || id === props.hoverMarkerId,
        labelBox: getLabelBox(label)
      }
    })
    .filter(Boolean)
})

const normalizedTrackPoints = computed(() => {
  return props.trackPoints
    .map((point, index) => {
      const normalized = normalizePoint(point)
      if (!normalized) return null
      return {
        id: point.id || point.seq || point.cameraId || index,
        raw: point,
        x: normalized.x,
        y: normalized.y,
        order: point.displayOrder || point.order || point.seq || index + 1
      }
    })
    .filter(Boolean)
})

const trackLinePoints = computed(() => normalizedTrackPoints.value.map((point) => `${point.x},${point.y}`).join(' '))

watch(
  () => [props.imageUrl, props.imageWidth, props.imageHeight],
  () => nextTick(resetView),
  { immediate: true }
)

watch(
  () => props.trackPoints,
  () => stopTrackAnimation(true),
  { deep: true }
)

onMounted(() => {
  updateStageSize()
  resizeObserver = new ResizeObserver(() => {
    updateStageSize()
    resetView()
  })
  if (wrapRef.value) resizeObserver.observe(wrapRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  stopTrackAnimation(true)
})

function updateStageSize() {
  if (!wrapRef.value) return
  const rect = wrapRef.value.getBoundingClientRect()
  stageSize.width = Math.max(200, Math.floor(rect.width || 0))
  stageSize.height = Math.max(200, Math.floor(rect.height || 0))
}

function resetView() {
  if (!hasImage.value || !stageSize.width || !stageSize.height) return
  const scale = Math.min(stageSize.width / props.imageWidth, stageSize.height / props.imageHeight) || 1
  view.scale = scale
  view.minScale = scale
  view.maxScale = Math.max(scale * 4, scale + 1)
  view.x = (stageSize.width - props.imageWidth * scale) / 2
  view.y = (stageSize.height - props.imageHeight * scale) / 2
  emitViewChange()
}

function zoomIn() {
  zoomBy(1.2)
}

function zoomOut() {
  zoomBy(1 / 1.2)
}

function zoomBy(ratio) {
  if (!hasImage.value) return
  const center = { x: stageSize.width / 2, y: stageSize.height / 2 }
  applyZoom(center, view.scale, clampScale(view.scale * ratio))
}

function handleWheel(event) {
  if (!hasImage.value) return
  const point = getLocalPoint(event)
  const nextScale = event.deltaY < 0 ? view.scale * 1.08 : view.scale / 1.08
  applyZoom(point, view.scale, clampScale(nextScale))
}

function applyZoom(point, oldScale, newScale) {
  if (!point || oldScale === newScale) return
  const imagePoint = {
    x: (point.x - view.x) / oldScale,
    y: (point.y - view.y) / oldScale
  }
  view.scale = newScale
  view.x = point.x - imagePoint.x * newScale
  view.y = point.y - imagePoint.y * newScale
  emitViewChange()
}

function clampScale(value) {
  return Math.min(view.maxScale, Math.max(view.minScale, value))
}

function handlePointerDown(event) {
  if (!hasImage.value) return
  const point = getLocalPoint(event)
  if (!point) return

  if (props.isPanMode) {
    dragging.active = true
    dragging.x = point.x
    dragging.y = point.y
    return
  }

  if (props.mode !== 'edit') return
  const imagePoint = screenToImage(point)
  if (!isInsideImage(imagePoint)) return
  emit('canvas-click', {
    x: imagePoint.x,
    y: imagePoint.y,
    xRatio: imagePoint.x / props.imageWidth,
    yRatio: imagePoint.y / props.imageHeight
  })
}

function handlePointerMove(event) {
  if (!dragging.active) return
  const point = getLocalPoint(event)
  if (!point) return
  view.x += point.x - dragging.x
  view.y += point.y - dragging.y
  dragging.x = point.x
  dragging.y = point.y
  emitViewChange()
}

function handlePointerUp() {
  dragging.active = false
}

function getLocalPoint(event) {
  if (!wrapRef.value) return null
  const rect = wrapRef.value.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

function screenToImage(point) {
  return {
    x: (point.x - view.x) / view.scale,
    y: (point.y - view.y) / view.scale
  }
}

function isInsideImage(point) {
  return point.x >= 0 && point.y >= 0 && point.x <= props.imageWidth && point.y <= props.imageHeight
}

function normalizePoint(point) {
  if (!point) return null
  if (Number.isFinite(Number(point.x)) && Number.isFinite(Number(point.y))) {
    return { x: Number(point.x), y: Number(point.y) }
  }
  const xRatio = Number(point.xRatio)
  const yRatio = Number(point.yRatio)
  if (!Number.isFinite(xRatio) || !Number.isFinite(yRatio)) return null
  return {
    x: xRatio * props.imageWidth,
    y: yRatio * props.imageHeight
  }
}

function emitMarkerClick(marker, event) {
  emit('marker-click', marker.raw, event)
}

function estimateTextWidth(text) {
  return String(text || '').split('').reduce((sum, ch) => sum + (/[^\x00-\xff]/.test(ch) ? 12 : 7), 0)
}

function truncateText(text, maxLength) {
  const value = String(text || '')
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
}

function getLabelBox(text) {
  const width = Math.min(200, Math.max(44, estimateTextWidth(text) + 12))
  return {
    x: -width / 2,
    y: -(props.cameraIconSize.height / 2 + 28),
    width,
    height: 22
  }
}

function playTrackAnimation() {
  const points = normalizedTrackPoints.value
  if (points.length < 2) {
    stopTrackAnimation(true)
    return false
  }

  stopTrackAnimation(false)
  playback.segments = buildPlaybackSegments(points)
  if (!playback.segments.length || playback.totalLength <= 0) {
    stopTrackAnimation(true)
    return false
  }

  if (!playback.visible || playback.progress >= 1) playback.progress = 0
  playback.visible = true
  playback.running = true
  playback.startTs = 0
  playback.baseProgress = playback.progress
  updatePlaybackByProgress(playback.progress)
  emitTrackPlaybackChange()
  playback.raf = window.requestAnimationFrame(stepTrackAnimation)
  return true
}

function stopTrackAnimation(hideMarker = false) {
  if (playback.raf) {
    window.cancelAnimationFrame(playback.raf)
    playback.raf = null
  }
  playback.running = false
  playback.startTs = 0
  playback.baseProgress = playback.progress
  if (hideMarker) {
    playback.visible = false
    playback.progress = 0
    playback.baseProgress = 0
  }
  emitTrackPlaybackChange()
}

function stepTrackAnimation(timestamp) {
  if (!playback.running) return
  if (!playback.startTs) playback.startTs = timestamp
  const duration = Math.max(800, Number(props.trackPlaybackDuration) || 0)
  const nextProgress = Math.min(1, playback.baseProgress + (timestamp - playback.startTs) / duration)
  playback.progress = nextProgress
  updatePlaybackByProgress(nextProgress)
  emitTrackPlaybackChange()
  if (nextProgress >= 1) {
    playback.running = false
    playback.baseProgress = playback.progress
    emitTrackPlaybackChange()
    return
  }
  playback.raf = window.requestAnimationFrame(stepTrackAnimation)
}

function buildPlaybackSegments(points) {
  const segments = []
  let total = 0
  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index]
    const to = points[index + 1]
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.hypot(dx, dy)
    if (!length) continue
    segments.push({
      from,
      to,
      length,
      start: total,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI
    })
    total += length
  }
  playback.totalLength = total
  return segments
}

function updatePlaybackByProgress(progress) {
  if (!playback.segments.length || playback.totalLength <= 0) return
  const targetLength = Math.max(0, Math.min(1, progress)) * playback.totalLength
  let current = playback.segments[playback.segments.length - 1]
  for (const segment of playback.segments) {
    if (targetLength <= segment.start + segment.length) {
      current = segment
      break
    }
  }
  const ratio = current.length ? (targetLength - current.start) / current.length : 0
  const clamped = Math.max(0, Math.min(1, ratio))
  playback.x = current.from.x + (current.to.x - current.from.x) * clamped
  playback.y = current.from.y + (current.to.y - current.from.y) * clamped
  playback.angle = current.angle
}

function emitTrackPlaybackChange() {
  emit('track-playback-change', {
    playing: playback.running,
    visible: playback.visible,
    progress: playback.progress
  })
}

function emitViewChange() {
  emit('view-change', {
    scale: view.scale,
    x: view.x,
    y: view.y
  })
}

defineExpose({
  zoomIn,
  zoomOut,
  resetView,
  playTrackAnimation,
  stopTrackAnimation
})
</script>

<style scoped>
.plan-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 260px;
  overflow: hidden;
  background: #fff;
  user-select: none;
}

.plan-canvas.is-pan {
  cursor: grab;
}

.plan-canvas.is-pan:active {
  cursor: grabbing;
}

.plan-canvas-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.plan-canvas-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
  background: repeating-linear-gradient(
    45deg,
    rgba(248, 248, 248, 0.8),
    rgba(248, 248, 248, 0.8) 10px,
    rgba(255, 255, 255, 0.95) 10px,
    rgba(255, 255, 255, 0.95) 20px
  );
}

.plan-marker,
.track-point {
  cursor: pointer;
}
</style>
