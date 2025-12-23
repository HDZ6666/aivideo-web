<template>
  <div class="container">
    <div class="container-cover" id="container-cover">
      <!-- 顶部头部 -->
      <DatavHeader :title="title" v-model:alarmActive="alarmActive" @map-screen="handleMapScreen"
        @goto-dashboard="gotoDashboard" />

      <div class="main" :class="{ 'is-fullscreen': isFullscreen }">
        <!-- 左侧设备树 -->
        <div class="left">
          <DeviceTree @node-click="handleNodeClick" />
        </div>

        <!-- 中部内容 -->
        <div class="center">
          <StatNav v-show="!isFullscreen" :items="statItems" />
          <VideoMonitor ref="videoMonitorRef" :is-fullscreen="isFullscreen" @fullscreen="toggleFullscreen" />
        </div>

        <!-- 右侧面板 -->
        <div class="right">
          <AlarmStatistics ref="alarmStatsRef" :statistics="alarmStatistics"
            @show-detail="(info) => handleShowDetail(info, 'manual')" @more-click="handleOpenLargeDialog('stats')" />
          <CameraWarnList ref="cameraWarnRef" :warn-list="cameraWarnList"
            @show-detail="(info) => handleShowDetail(info, 'manual')" @more-click="handleOpenLargeDialog('grid')" />
          <AlarmTrendChart :trend-data="alarmTrendData" />
        </div>
      </div>

      <!-- 全局高层级告警详情弹窗（常驻模式，仅控制显隐） -->
      <AlarmDetailDialog v-show="detailVisible" :info="detailInfo" @close="handleDetailDialogClose"
        @handle="handleDetailHandle" @action-start="handleActionStart" />

      <!-- 告警统计大弹窗 (从子组件移至此处) -->
      <AlarmStatisticsDialog ref="alarmStatsDialogRef" v-if="statsDialogVisible"
        @close="handleLargeDialogClose('stats')" @show-detail="(info) => handleShowDetail(info, 'manual')" />

      <!-- 摄像头告警九宫格大弹窗 (从子组件移至此处) -->
      <CameraWarnGridDialog ref="cameraGridDialogRef" v-if="gridDialogVisible" @close="handleLargeDialogClose('grid')"
        @show-detail="(info) => handleShowDetail(info, 'manual')" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import autofit from "autofit.js"
import DatavHeader from './components/DatavHeader.vue'
import DeviceTree from './components/DeviceTree.vue'
import StatNav from './components/StatNav.vue'
import VideoMonitor from './components/VideoMonitor.vue'
import AlarmStatistics from './components/AlarmStatistics.vue'
import CameraWarnList from './components/CameraWarnList.vue'
import AlarmTrendChart from './components/AlarmTrendChart.vue'
import AlarmDetailDialog from './components/AlarmDetailDialog.vue'
import AlarmStatisticsDialog from './components/AlarmStatisticsDialog.vue'
import CameraWarnGridDialog from './components/CameraWarnGridDialog.vue'

// API 接口引入
import {
  getDeviceCount,
  getOnlineDeviceCount,
  getScreenAlarmStatistics,
  listAlarmInfo,
  getAlarmCountByTime
} from '@/api/datav/monitor.js'

// 静态资源引入
import deviceTotal from "@/assets/datav/v1/device_total.png"
import deviceOnline from "@/assets/datav/v1/device_online.png"
import warnTodo from "@/assets/datav/v1/warn_todo.png"
import warnTotal from "@/assets/datav/v1/warn_total.png"

// 状态定义
const title = ref('监控驾驶舱')
const alarmActive = ref(false)
const isFullscreen = ref(false)
const videoMonitorRef = ref(null)
const alarmStatsRef = ref(null)
const cameraWarnRef = ref(null)

// 详情弹窗状态
const detailVisible = ref(false)
const detailInfo = ref({})
const isManualMode = ref(false) // 标记详情是否为手动触发

// 大型列表弹窗状态
const statsDialogVisible = ref(false)
const gridDialogVisible = ref(false)
const alarmStatsDialogRef = ref(null)
const cameraGridDialogRef = ref(null)

// 轮巡调度状态
let alarmCycleTimer = null
let alarmCycleIndex = 0 // 轮巡索引
const ALARM_CYCLE_INTERVAL = 10 * 1000 // 告警轮巡间隔 10s

// 设备树数据
const defaultProps = {
  children: 'children',
  label: 'label',
  isLeaf: 'isLeaf'  // 在 lazy 模式下必须指定，用于判断是否为叶子节点
}
// 设备树数据（由 getDeviceGroupList 填充）
const deviceTreeData = ref([])

// 统计导航数据
const statItems = ref([
  { icon: deviceTotal, name: '设备总数', value: 4, isWarn: false },
  { icon: deviceOnline, name: '在线设备数', value: 4, isWarn: false },
  { icon: warnTodo, name: '未处理告警数', value: 0, isWarn: true },
  { icon: warnTotal, name: '告警总数', value: 0, isWarn: false },
])

// 告警统计数据（由 getAlarmStats 填充）
const alarmStatistics = ref([])

// 摄像头告警列表数据（由 getCameraWarnList 填充）
const cameraWarnList = ref([])

// 告警趋势数据（由 getAlarmTrend 填充）
const alarmTrendData = ref([])

// 定时器
let statisticsTimer = null

// 获取设备信息（只调用一次）
const getDeviceInfo = () => {
  // 1. 设备总数
  getDeviceCount().then(res => {
    if (res.data?.deviceCount !== undefined) {
      statItems.value[0].value = res.data.deviceCount
    }
  }).catch(err => {
    // 获取设备总数失败
  })

  // 2. 在线设备数
  getOnlineDeviceCount().then(res => {
    if (res.data?.onlineDeviceCount !== undefined) {
      statItems.value[1].value = res.data.onlineDeviceCount
    }
  }).catch(err => {
    // 获取在线设备数失败
  })
}

// 获取告警统计数据（定时刷新）
const getAlarmStats = () => {
  getScreenAlarmStatistics().then(res => {
    const data = res.data || []

    // 按 sevenDayAlarmCount 降序排列
    data.sort((a, b) => (b.sevenDayAlarmCount || 0) - (a.sevenDayAlarmCount || 0))

    // 告警总数: 累加 sevenDayAlarmCount
    const allAlarm = data.reduce((sum, item) => sum + (item.sevenDayAlarmCount || 0), 0)
    statItems.value[3].value = allAlarm
    // 未处理告警数: 累加 sevenDayAlarmNoHandleCount
    const activedAlarm = data.reduce((sum, item) => sum + (item.sevenDayAlarmNoHandleCount || 0), 0)
    statItems.value[2].value = activedAlarm

    // 更新告警统计列表（取前2条）
    alarmStatistics.value = data.slice(0, 2)
  }).catch(err => {
    // 获取告警统计失败
  })
}

// 事件处理
const handleNodeClick = (data) => {
  // 单击切换视频源监控
  if (videoMonitorRef.value) {
    let categoryId = data.id
    let options = {}

    if (data.type === 'all') {
      // 全部设备，清除筛选
      categoryId = null
    } else if (data.type === 'group') {
      options.type = 'group'
    } else if (data.type === 'DEVICE' || data.type === 'DEVICE_CHANNEL') {
      options.type = 'device'
      options.deviceType = data.type
    }

    videoMonitorRef.value.getCameraList(categoryId, options)
  }
}

// 日期辅助函数：获取N天前/后的日期字符串
const getDateDaysAgo = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}



// 获取摄像头告警列表
const getCameraWarnList = () => {
  listAlarmInfo({ page: 1, size: 2, status: 0, startTime: `${getDateDaysAgo(0)} 00:00:00`, endTime: `${getDateDaysAgo(0)} 23:59:59` }).then(res => {
    if (res.data?.records) {
      cameraWarnList.value = res.data.records
    }
  }).catch(err => {
    // 获取摄像头告警失败
  })
}

// 获取告警趋势数据
const getAlarmTrend = () => {
  const startTime = getDateDaysAgo(-7)
  const endTime = getDateDaysAgo(0)
  getAlarmCountByTime({ startTime, endTime }).then(res => {
    if (Array.isArray(res.data)) {
      alarmTrendData.value = res.data
    }
  }).catch(err => {
    // 获取告警趋势失败
  })
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 告警详情展示控制器
const handleShowDetail = (info, mode = 'auto') => {
  detailInfo.value = info
  detailVisible.value = true

  if (mode === 'manual') {
    isManualMode.value = true
    stopAlarmCycle() // 手动查看，物理停止轮巡
  } else {
    isManualMode.value = false
  }
}

// 详情成功处理后的数据刷新
const handleDetailHandle = () => {
  getAlarmStats()
  getCameraWarnList()
  // 刷新可能已经打开的大弹窗中的列表
  alarmStatsDialogRef.value?.refreshList()
  cameraGridDialogRef.value?.refreshList()
}

// 弹窗内发起处理动作（开始接口请求）
const handleActionStart = () => {
  stopAlarmCycle() // 锁定，防止请求期间弹窗由于定时器关闭
}

// 详情弹窗彻底关闭
const handleDetailDialogClose = () => {
  detailVisible.value = false
  isManualMode.value = false
  resumeAlarmCycle() // 恢复自动轮巡（带 3s 缓冲）
}

// 开启大型弹窗
const handleOpenLargeDialog = (type) => {
  stopAlarmCycle()
  detailVisible.value = false // 大弹窗开启时，详情小窗避让

  if (type === 'stats') statsDialogVisible.value = true
  if (type === 'grid') gridDialogVisible.value = true
}

// 关闭大型弹窗
const handleLargeDialogClose = (type) => {
  if (type === 'stats') statsDialogVisible.value = false
  if (type === 'grid') gridDialogVisible.value = false
  resumeAlarmCycle() // 大窗关闭，恢复轮巡
}

// --- 轮巡调度核心核心逻辑 ---

// 1. 停止轮巡
const stopAlarmCycle = () => {
  if (alarmCycleTimer) {
    clearTimeout(alarmCycleTimer)
    alarmCycleTimer = null
  }
}

// 2. 准备恢复（带冷却）
const resumeAlarmCycle = () => {
  stopAlarmCycle()
  // 只有当告警总开关开启，且没有大窗遮挡时，才允许 3s 后重启
  if (alarmActive.value && !statsDialogVisible.value && !gridDialogVisible.value) {
    alarmCycleTimer = setTimeout(() => {
      runAlarmCycle()
    }, 3000)
  }
}

// 3. 执行轮巡
const runAlarmCycle = () => {
  // 只要有大窗开启，严禁自动弹出
  if (statsDialogVisible.value || gridDialogVisible.value || !alarmActive.value) return

  if (cameraWarnList.value.length > 0) {
    // 自动展示第一条
    handleShowDetail(cameraWarnList.value[0], 'auto')

    // 10 秒后准备执行关闭逻辑
    stopAlarmCycle()
    alarmCycleTimer = setTimeout(() => {
      // 只有在非手动模式下，10s 到期才会自动关
      if (!isManualMode.value) {
        detailVisible.value = false
        resumeAlarmCycle() // 关了之后等 3s 开启下一轮
      }
    }, 10000)
  } else {
    // 无数据，3s 后重试
    alarmCycleTimer = setTimeout(runAlarmCycle, 3000)
  }
}

// 监听告警开关
watch(alarmActive, (newVal) => {
  if (newVal) {
    runAlarmCycle()
  } else {
    // 关闭时清除所有定时器
    if (alarmCycleTimer) {
      clearTimeout(alarmCycleTimer)
      alarmCycleTimer = null
    }
    detailVisible.value = false
  }
})
// --- 逻辑优化结束 ---

const gotoDashboard = () => {
  // 原有逻辑：退回到后台管理界面
  const currentHref = window.top.location.href
  const newUrl = currentHref.replace(/#.*$/, '#/index')
  window.top.location.href = newUrl
}

const handleMapScreen = () => {
  // 跳转地图大屏
}

// 统一刷新告警相关数据（统计+列表+趋势）
const refreshAllAlarmData = () => {
  getAlarmStats()
  getCameraWarnList()
  getAlarmTrend()
}

// 生命周期
onMounted(() => {
  autofit.init({
    dh: 919,
    dw: 1920,
    el: "#container-cover",
    resize: true,
  })

  // 获取初始设备状态
  getDeviceInfo()

  // 立即执行一次并开启10秒轮询
  refreshAllAlarmData()
  statisticsTimer = setInterval(refreshAllAlarmData, 10000)
})

onUnmounted(() => {
  autofit.off()
  // 清除定时刷新定时器
  if (statisticsTimer) {
    clearInterval(statisticsTimer)
    statisticsTimer = null
  }
  // 清除告警轮巡定时器，防止卸载后继续运行
  if (alarmCycleTimer) {
    clearTimeout(alarmCycleTimer)
    alarmCycleTimer = null
  }
})
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: no-repeat center url("@/assets/datav/v1/home-bg.png");
  user-select: none;
  transition: all 0.5s ease-in;
}

.container-cover {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  background: radial-gradient(48.84% 50.6% at 50% 48.19%,
      rgba(0, 144, 225, 0.35) 0%,
      rgba(5, 118, 223, 0.03) 100%), #000;
}

.main {
  position: absolute;
  left: 0;
  width: 1920px;
  bottom: 0;
  top: 119px;
  pointer-events: all;

  &.is-fullscreen {

    .left,
    .right {
      display: none;
    }

    .center {
      left: 19px;
      right: 19px;
      top: -38px; // 向上扩展，对齐原侧边栏位置
      z-index: 100;
    }
  }
}

.left {
  position: absolute;
  width: 305px;
  top: -38px;
  left: 19px;
  bottom: 19px;
  background: url("@/assets/datav/v1/left-bg.png") no-repeat;
  background-size: 100% 100%;
}

.right {
  position: absolute;
  width: 497px;
  top: -38px;
  right: 19px;
  bottom: 19px;
  z-index: 20;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.center {
  position: absolute;
  left: 324px;
  right: 535px;
  top: -19px;
  bottom: 19px;
  display: flex;
  flex-direction: column;
}
</style>
