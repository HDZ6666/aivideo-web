<template>
  <div class="app-container">
    <el-row :gutter="20" class="search-layout">
      <!-- 左侧搜索区域 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="6" class="search-left">
        <el-card class="search-panel">
          <template #header>
            <div class="card-header">
              <span>人脸轨迹追踪</span>
            </div>
          </template>

          <el-form :model="searchParams" ref="searchRef" label-width="80px" label-position="top">
            <!-- 人脸图片上传 -->
            <el-form-item label="上传人脸图片" prop="faceImage">
              <el-upload class="upload-demo" drag :auto-upload="false" :show-file-list="false" accept="image/*"
                :on-change="handleImageChange">
                <el-image v-if="searchParams.faceImage" :src="searchParams.faceImage" fit="cover"
                  style="width: 100%; height: 160px;" />
                <div v-else class="upload-placeholder">
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">将人脸图片拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip">支持 jpg/png 格式</div>
                </div>
              </el-upload>
            </el-form-item>

            <!-- 开始时间 -->
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="searchParams.startTime"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 结束时间 -->
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="searchParams.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>

            <!-- 操作按钮 -->
            <el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button type="primary" icon="Search" @click="handleSearch" :loading="searching"
                    :disabled="!searchParams.faceImage" style="width: 100%;">
                    追踪
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-button icon="Refresh" @click="resetSearch" style="width: 100%;">重置</el-button>
                </el-col>
              </el-row>
            </el-form-item>

          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧地图展示区域 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="18" class="search-right">
        <el-card class="results-panel" v-loading="searching">
          <!-- 地图容器 -->
          <div class="map-container" v-if="hasSearched">
            <AMapComponent 
              ref="mapRef"
              :center="mapCenter"
              :zoom="mapZoom"
              @mapInit="onMapInit"
              @mapClick="onMapClick"
            />
          </div>

          <!-- 未搜索状态 -->
          <div class="empty-search" v-if="!hasSearched">
            <el-empty description="请在左侧上传人脸图片并选择时间范围开始追踪">
              <template #image>
                <el-icon size="100" color="#909399">
                  <Search />
                </el-icon>
              </template>
            </el-empty>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 设备详情对话框 -->
    <el-dialog title="设备捕捉详情" v-model="detailOpen" width="800px" append-to-body>
      <el-table :data="detailData" border stripe>
        <el-table-column prop="captureTime" label="捕捉时间" width="180" />
        <el-table-column prop="deviceCode" label="设备编号" width="120" />
        <el-table-column label="捕捉照片" width="120">
          <template #default="scope">
            <el-image 
              :src="scope.row.captureImage" 
              :preview-src-list="[scope.row.captureImage]"
              fit="cover"
              style="width: 80px; height: 60px;"
              :preview-teleported="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="相似度" width="100">
          <template #default="scope">
            <el-tag :type="getSimilarityType(scope.row.similarity)" size="small">
              {{ scope.row.similarity }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="location" label="设备位置" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailOpen = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="FaceTrace">
import { UploadFilled, Search } from '@element-plus/icons-vue'
import AMapComponent from '@/components/AMapComponent/index.vue'

const { proxy } = getCurrentInstance()

// 响应式数据
const searchParams = ref({
  faceImage: null,
  startTime: null,
  endTime: null
})
const searching = ref(false)
const hasSearched = ref(false)
const detailOpen = ref(false)
const detailData = ref([])

// 地图相关
const mapRef = ref(null)
const mapCenter = ref([113.045883, 23.053416]) // 佛山新城中心点
const mapZoom = ref(12)
const mapInstance = ref(null)
const markers = ref([])

/** 图片上传处理 */
function handleImageChange(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    searchParams.value.faceImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

/** 开始追踪 */
function handleSearch() {
  if (!searchParams.value.faceImage) {
    proxy.$modal.msgWarning("请上传人脸图片")
    return
  }

  // 验证时间范围
  if (searchParams.value.startTime && searchParams.value.endTime) {
    if (new Date(searchParams.value.startTime) >= new Date(searchParams.value.endTime)) {
      proxy.$modal.msgWarning("开始时间必须早于结束时间")
      return
    }
  }

  searching.value = true
  hasSearched.value = true

  // 模拟追踪延迟
  setTimeout(() => {
    const backendDataList = generateMockTraceData()
    console.log('backendDataList', backendDataList)
    const processedTraceData = processTraceData(backendDataList)
    console.log('processedTraceData', processedTraceData)
    addMarkersToMap(processedTraceData)
    addTraceLineToMap(processedTraceData)
    searching.value = false
    proxy.$modal.msgSuccess(`追踪完成，找到 ${backendDataList.length} 条捕捉记录，涉及 ${processedTraceData.devices.length} 个设备`)
  }, 2000)
}

/** 重置搜索 */
function resetSearch() {
  searchParams.value = {
    faceImage: null,
    startTime: null,
    endTime: null
  }
  hasSearched.value = false
  clearMapMarkers()
}

/** 地图初始化完成 */
function onMapInit(map) {
  mapInstance.value = map
}

/** 地图点击事件 */
function onMapClick(e) {
  console.log('地图点击:', e.lnglat)
}

/** 清除地图标记 */
function clearMapMarkers() {
  if (mapRef.value) {
    mapRef.value.clearAll() // 清除所有标记和轨迹线
  }
  markers.value = []
}

/** 添加标记到地图 */
function addMarkersToMap(processedData) {
  clearMapMarkers()

  if (!processedData || !processedData.devices) return

  processedData.devices.forEach((device, index) => {
    const color = getMarkerColor(device.totalVisits, device.isReturnLocation)
    const iconUrl = createMarkerIcon(color, device.totalVisits, index + 1, device.isReturnLocation)

    const marker = mapRef.value.addMarker(
      [device.longitude, device.latitude],
      {
        title: `${device.deviceName} (${device.totalVisits}次${device.isReturnLocation ? ' - 往返地点' : ''})`,
        icon: iconUrl,
        extData: device
      }
    )

    // 添加点击事件
    marker.on('click', () => {
      showDeviceDetail(device)
    })

    markers.value.push(marker)
  })
}

/** 添加轨迹线到地图 */
function addTraceLineToMap(processedData) {
  if (!mapRef.value || !processedData || !processedData.tracePath || processedData.tracePath.length < 2) return

  // 创建轨迹路径（按时间顺序）
  const path = processedData.tracePath.map(point => [point.longitude, point.latitude])

  // 添加主轨迹线
  mapRef.value.addPolyline(path, {
    strokeColor: '#409eff',
    strokeWeight: 4,
    strokeOpacity: 0.8,
    strokeStyle: 'solid',
    strokeDasharray: [10, 5] // 虚线样式
  })

  // 为往返路径添加特殊标识（可选：添加箭头或不同颜色的线段）
  addReturnPathIndicators(processedData.tracePath)

  // 自动调整地图视野以显示所有覆盖物
  setTimeout(() => {
    mapRef.value.setFitView()
  }, 100)
}

/** 添加往返路径指示器 */
function addReturnPathIndicators(tracePath) {
  // 找出往返的路径段
  const returnSegments = []

  for (let i = 1; i < tracePath.length; i++) {
    const currentPoint = tracePath[i]
    const prevPoint = tracePath[i - 1]

    // 如果当前点是往返点，添加特殊样式的线段
    if (currentPoint.isReturn) {
      returnSegments.push([
        [prevPoint.longitude, prevPoint.latitude],
        [currentPoint.longitude, currentPoint.latitude]
      ])
    }
  }

  // 为往返路径段添加不同颜色的线条
  returnSegments.forEach(segment => {
    mapRef.value.addPolyline(segment, {
      strokeColor: '#f56c6c', // 红色表示往返
      strokeWeight: 3,
      strokeOpacity: 0.9,
      strokeStyle: 'solid',
      strokeDasharray: [5, 10] // 不同的虚线样式
    })
  })
}

/** 创建标记图标 */
function createMarkerIcon(color, count, order, isReturn = false) {
  // 为往返地点添加特殊标识
  const borderColor = isReturn ? '#f56c6c' : '#fff'
  const borderWidth = isReturn ? 3 : 2

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="18" fill="${color}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
    <text x="20" y="16" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold">${order}</text>
    <text x="20" y="28" text-anchor="middle" fill="#fff" font-size="8">${count}</text>
    ${isReturn ? '<text x="20" y="35" text-anchor="middle" fill="#f56c6c" font-size="6">R</text>' : ''}
  </svg>`

  // 返回高德地图兼容的图标URL
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`
}

/** 获取标记颜色 */
function getMarkerColor(count, isReturn = false) {
  // 往返地点使用特殊颜色逻辑
  if (isReturn) {
    if (count >= 5) return '#722ed1' // 紫色 - 高频往返
    if (count >= 3) return '#1890ff' // 蓝色 - 中频往返
    return '#52c41a' // 绿色 - 低频往返
  }

  // 普通地点颜色
  if (count >= 7) return '#f56c6c' // 红色
  if (count >= 4) return '#e6a23c' // 橙色
  return '#67c23a' // 绿色
}

/** 轨迹数据处理函数 */
function processTraceData(backendDataList) {
  if (!backendDataList || backendDataList.length === 0) {
    return { devices: [], tracePath: [] }
  }

  // 按设备分组，保持时间顺序
  const deviceGroups = new Map()
  const tracePath = [] // 按时间顺序的轨迹路径

  backendDataList.forEach((record, index) => {
    const deviceKey = record.code

    // 添加到轨迹路径（按时间顺序）
    tracePath.push({
      longitude: record.lng,
      latitude: record.lat,
      deviceCode: record.code,
      deviceName: record.name,
      captureTime: record.captureTime,
      order: index,
      isReturn: false // 后续会标记往返点
    })

    // 按设备分组
    if (!deviceGroups.has(deviceKey)) {
      deviceGroups.set(deviceKey, {
        deviceName: record.name,
        deviceCode: record.code,
        longitude: record.lng,
        latitude: record.lat,
        location: record.location,
        captureRecords: [],
        visitTimes: [], // 记录访问时间段
        totalVisits: 0
      })
    }

    const deviceGroup = deviceGroups.get(deviceKey)
    deviceGroup.captureRecords.push({
      captureTime: record.captureTime,
      deviceCode: record.code,
      deviceName: record.name,
      location: record.location,
      captureImage: record.captureImage,
      similarity: record.similarity
    })
    deviceGroup.totalVisits++
  })

  // 标记往返点和访问时间段
  const devices = Array.from(deviceGroups.values()).map(device => {
    // 按时间排序捕捉记录
    device.captureRecords.sort((a, b) => new Date(a.captureTime) - new Date(b.captureTime))

    // 计算访问时间段
    device.visitTimes = calculateVisitPeriods(device.captureRecords)

    // 判断是否为往返地点（访问时间段超过1个）
    device.isReturnLocation = device.visitTimes.length > 1

    return device
  })

  // 标记轨迹路径中的往返点
  markReturnPoints(tracePath, devices)

  return {
    devices,
    tracePath,
    totalRecords: backendDataList.length
  }
}

/** 计算访问时间段 */
function calculateVisitPeriods(captureRecords) {
  if (captureRecords.length === 0) return []

  const periods = []
  let currentPeriod = {
    startTime: captureRecords[0].captureTime,
    endTime: captureRecords[0].captureTime,
    count: 1
  }

  for (let i = 1; i < captureRecords.length; i++) {
    const currentTime = new Date(captureRecords[i].captureTime)
    const lastTime = new Date(currentPeriod.endTime)

    // 如果时间间隔超过2小时，认为是新的访问时间段
    if (currentTime - lastTime > 2 * 60 * 60 * 1000) {
      periods.push({ ...currentPeriod })
      currentPeriod = {
        startTime: captureRecords[i].captureTime,
        endTime: captureRecords[i].captureTime,
        count: 1
      }
    } else {
      currentPeriod.endTime = captureRecords[i].captureTime
      currentPeriod.count++
    }
  }

  periods.push(currentPeriod)
  return periods
}

/** 标记往返点 */
function markReturnPoints(tracePath, devices) {
  const returnDevices = devices.filter(d => d.isReturnLocation).map(d => d.deviceCode)

  tracePath.forEach(point => {
    if (returnDevices.includes(point.deviceCode)) {
      point.isReturn = true
    }
  })
}

/** 显示设备详情 */
function showDeviceDetail(device) {
  detailData.value = device.captureRecords
  detailOpen.value = true
}

/** 获取相似度标签类型 */
function getSimilarityType(similarity) {
  if (similarity >= 90) return 'success'
  if (similarity >= 70) return 'warning'
  return 'danger'
}

/** 生成模拟轨迹数据 - 返回按时间排序的捕捉记录列表 */
function generateMockTraceData() {
  // 定义设备位置
  const devices = [
    { name: '地铁站A出口', code: 'CAM001', lng: 113.035883, lat: 23.043416, location: '佛山新城地铁站A出口' },
    { name: '商业街监控', code: 'CAM002', lng: 113.041883, lat: 23.048416, location: '佛山新城商业街' },
    { name: '政务大厅', code: 'CAM003', lng: 113.045883, lat: 23.053416, location: '佛山新城政务大厅' },
    { name: '中央公园', code: 'CAM004', lng: 113.052883, lat: 23.059416, location: '佛山新城中央公园' },
    { name: '购物中心', code: 'CAM005', lng: 113.058883, lat: 23.065416, location: '佛山新城购物中心' },
    { name: '咖啡厅', code: 'CAM006', lng: 113.048883, lat: 23.056416, location: '佛山新城咖啡厅' },
    { name: '银行网点', code: 'CAM007', lng: 113.055883, lat: 23.062416, location: '佛山新城银行网点' }
  ]

  const faceImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ]

  // 生成基准时间
  const baseTime = searchParams.value.startTime ?
    new Date(searchParams.value.startTime) :
    new Date('2025-09-25 08:00:00')

  const endTime = searchParams.value.endTime ?
    new Date(searchParams.value.endTime) :
    new Date(baseTime.getTime() + 12 * 60 * 60 * 1000) // 默认12小时后

  // 模拟真实的用户行为轨迹（包括往返）
  const traceRecords = []

  // 模拟轨迹：地铁站 → 商业街 → 政务大厅 → 中央公园 → 购物中心 → 咖啡厅 → 银行 → 购物中心(返回) → 地铁站(返回)
  const tracePattern = [
    { deviceIndex: 0, duration: 5 },   // 地铁站A出口 - 停留5分钟
    { deviceIndex: 1, duration: 20 },  // 商业街 - 停留20分钟
    { deviceIndex: 2, duration: 45 },  // 政务大厅 - 办事45分钟
    { deviceIndex: 3, duration: 30 },  // 中央公园 - 休息30分钟
    { deviceIndex: 4, duration: 60 },  // 购物中心 - 购物60分钟
    { deviceIndex: 5, duration: 25 },  // 咖啡厅 - 喝咖啡25分钟
    { deviceIndex: 6, duration: 15 },  // 银行网点 - 办理业务15分钟
    { deviceIndex: 4, duration: 20 },  // 购物中心(返回) - 再次购物20分钟
    { deviceIndex: 0, duration: 5 }    // 地铁站A出口(返回) - 离开5分钟
  ]

  let currentTime = new Date(baseTime)

  tracePattern.forEach((step, stepIndex) => {
    const device = devices[step.deviceIndex]
    const capturesInThisLocation = Math.floor(Math.random() * 3) + 1 // 每个地点1-3次捕捉

    for (let i = 0; i < capturesInThisLocation; i++) {
      // 在停留期间的随机时间点捕捉
      const captureOffset = Math.floor(Math.random() * step.duration * 60 * 1000) // 转换为毫秒
      const captureTime = new Date(currentTime.getTime() + captureOffset)

      // 确保不超过结束时间
      if (captureTime <= endTime) {
        traceRecords.push({
          name: device.name,
          code: device.code,
          lng: device.lng,
          lat: device.lat,
          location: device.location,
          captureTime: captureTime.toISOString().slice(0, 19).replace('T', ' '),
          captureImage: faceImages[stepIndex % faceImages.length],
          similarity: Math.floor(Math.random() * 30) + 70 // 70-99的随机相似度
        })
      }
    }

    // 移动到下一个地点（加上停留时间和移动时间）
    const moveTime = Math.floor(Math.random() * 20 + 10) * 60 * 1000 // 10-30分钟移动时间
    currentTime = new Date(currentTime.getTime() + step.duration * 60 * 1000 + moveTime)
  })

  // 按时间排序返回
  return traceRecords.sort((a, b) => new Date(a.captureTime) - new Date(b.captureTime))
}

onMounted(() => {
  // 页面加载完成
})
</script>

<style scoped>
/* 左右布局样式 */
.search-left {
  margin-bottom: 20px;
}

.search-right {
  height: calc(100vh - 160px);
}

.search-panel {
  border-radius: 8px;
}

.results-panel {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.map-container {
  height: calc(100vh - 220px);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-placeholder {
  text-align: center;
  padding: 30px 20px;
}

.upload-placeholder .el-icon--upload {
  font-size: 36px;
  color: #c0c4cc;
  margin-bottom: 12px;
}

.upload-placeholder .el-upload__text {
  color: #606266;
  font-size: 13px;
  line-height: 1.4;
}

.upload-placeholder .el-upload__tip {
  color: #909399;
  font-size: 11px;
  margin-top: 6px;
}

.empty-search {
  margin-top: 60px;
  text-align: center;
}

/* 上传组件样式 */
.upload-demo {
  width: 100%;
}

.upload-demo .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
  min-height: 160px;
}

.upload-demo .el-upload:hover {
  border-color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-layout {
    flex-direction: column;
  }
  
  .search-left,
  .search-right {
    width: 100% !important;
    margin-bottom: 20px;
  }
  
  .map-container {
    height: 400px;
  }
  
  .upload-placeholder {
    padding: 15px;
  }
  
  .upload-placeholder .el-icon--upload {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .map-container {
    height: 300px;
  }
}
</style>
