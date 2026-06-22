<template>
  <div class="amap-container" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

const props = defineProps({
  // 地图中心点
  center: {
    type: Array,
    default: () => [113.045883, 23.053416] // 佛山新城中心点
  },
  // 地图缩放级别
  zoom: {
    type: Number,
    default: 12
  },
  // 地图类型
  mapType: {
    type: String,
    default: 'normal' // 普通地图
  },
  // 高德地图key
  mapKey: {
    type: String,
    default: ''
  },
  // 地图插件
  plugins: {
    type: Array,
    default: () => ['AMap.Scale', 'AMap.ToolBar', 'AMap.MapType', 'AMap.HawkEye']
  },
  // 地图样式
  mapStyle: {
    type: String,
    default: 'amap://styles/normal'
  },
  // 是否显示室内地图
  showIndoorMap: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['mapInit', 'mapClick', 'mapError'])

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])

// 初始化地图
const initMap = async () => {
  if (!mapContainer.value) return

  try {
    // 加载高德地图
    window.AMap = await AMapLoader.load({
      key: props.mapKey || '7ea103afdbc3ddfbe1469d5ba692c5d9', // 需要设置您申请的key
      version: '2.0',
      plugins: props.plugins
    })

    if (!window.AMap) {
      throw new Error('AMap API加载失败，请检查网络连接和API Key是否有效')
    }

    // 创建地图实例
    map.value = new AMap.Map(mapContainer.value, {
      zoom: props.zoom,
      center: props.center,
      mapStyle: props.mapStyle,
      viewMode: '3D',
      showIndoorMap: props.showIndoorMap
    })

    // 添加地图控件
    // map.value.addControl(new AMap.Scale())
    // map.value.addControl(new AMap.ToolBar())
    // map.value.addControl(new AMap.MapType())

    // 地图点击事件
    map.value.on('click', (e) => {
      emit('mapClick', e)
    })

    // 地图初始化完成
    emit('mapInit', map.value)
  } catch (error) {
    console.error('地图初始化失败:', error)
    emit('mapError', error)
    // 如果地图加载失败，可以显示一个友好的错误提示
    if (mapContainer.value) {
      mapContainer.value.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 14px;">地图加载失败，请检查网络连接或联系管理员</div>'
    }
  }
}

// 添加标记点
const addMarker = (position, options = {}) => {
  if (!map.value) return

  const marker = new AMap.Marker({
    position,
    title: options.title || '',
    icon: options.icon,
    label: options.label,
    ...options
  })

  map.value.add(marker)
  markers.value.push(marker)

  return marker
}

// 清除所有标记点
const clearMarkers = () => {
  if (!map.value) return

  map.value.remove(markers.value)
  markers.value = []
}

// 设置地图中心点
const setCenter = (position, immediately = true) => {
  if (!map.value) return
  map.value.setCenter(position, immediately)
}

// 设置地图缩放级别
const setZoom = (zoom) => {
  if (!map.value) return
  map.value.setZoom(zoom)
}

const setMapStyle = (style) => {
  if (!map.value) return
  map.value.setMapStyle(style)
}

// 暴露方法给父组件
defineExpose({
  map,
  addMarker,
  clearMarkers,
  setCenter,
  setZoom,
  setMapStyle
})

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<style scoped>
.amap-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
  flex: 1;
}
</style>
