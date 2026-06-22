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
          <AlarmStatistics :statistics="alarmStatistics" @show-detail="(info) => datavStore.showDetail(info, 'manual')"
            @more-click="handleOpenLargeDialog('stats')" />
          <CameraWarnList :warn-list="cameraWarnList" @show-detail="(info) => datavStore.showDetail(info, 'manual')"
            @more-click="handleOpenLargeDialog('grid')" />
          <AlarmTrendChart :trend-data="alarmTrendData" />
        </div>
      </div>

      <!-- 全局高层级告警详情弹窗（Pinia 自主管理显隐与数据） -->
      <AlarmDetailDialog v-show="detailVisible" />

      <!-- 告警统计大弹窗 (从子组件移至此处) -->
      <AlarmStatisticsDialog ref="alarmStatsDialogRef" v-if="statsDialogVisible"
        @close="datavStore.toggleLargeDialog('stats', false)"
        @show-detail="(info) => datavStore.showDetailManual(info)" />

      <!-- 摄像头告警九宫格大弹窗 (从子组件移至此处) -->
      <CameraWarnGridDialog ref="cameraGridDialogRef" v-if="gridDialogVisible"
        @close="datavStore.toggleLargeDialog('grid', false)"
        @show-detail="(info) => datavStore.showDetailManual(info)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDatavStore } from '@/store/modules/datav'
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
const title = ref('监控驾驶舱')
const isFullscreen = ref(false)
const videoMonitorRef = ref(null)
const alarmStatsDialogRef = ref(null)
const cameraGridDialogRef = ref(null)
const router = useRouter()

// 注入 Pinia Store
const datavStore = useDatavStore()
const {
  alarmActive,
  detailVisible,
  statsDialogVisible,
  gridDialogVisible,
  cameraWarnList,
  refreshCount
} = storeToRefs(datavStore)

// 统计导航数据
const statItems = ref([
  { icon: deviceTotal, name: '设备总数', value: 0, isWarn: false },
  { icon: deviceOnline, name: '在线设备数', value: 0, isWarn: false },
  { icon: warnTodo, name: '未处理告警数', value: 0, isWarn: true },
  { icon: warnTotal, name: '告警总数', value: 0, isWarn: false },
])

// 告警统计数据
const alarmStatistics = ref([])

// 监控全局刷新信号，同步子组件列表及首页统计
watch(refreshCount, () => {
  getAlarmStats()
  getCameraWarnList()
  alarmStatsDialogRef.value?.refreshList()
  cameraGridDialogRef.value?.refreshList()
})

// 告警趋势数据（由 getAlarmTrend 填充）
const alarmTrendData = ref([])

// 定时器
let statisticsTimer = null

const getDeviceInfo = () => {
  getDeviceCount().then(res => {
    if (res.data?.deviceCount !== undefined) {
      statItems.value[0].value = res.data.deviceCount
    }
  }).catch(err => { })

  getOnlineDeviceCount().then(res => {
    if (res.data?.onlineDeviceCount !== undefined) {
      statItems.value[1].value = res.data.onlineDeviceCount
    }
  }).catch(err => { })
}

const getAlarmStats = () => {
  getScreenAlarmStatistics().then(res => {
    const data = res.data || []
    data.sort((a, b) => (b.sevenDayAlarmCount || 0) - (a.sevenDayAlarmCount || 0))
    const allAlarm = data.reduce((sum, item) => sum + (item.sevenDayAlarmCount || 0), 0)
    statItems.value[3].value = allAlarm
    const activedAlarm = data.reduce((sum, item) => sum + (item.sevenDayAlarmNoHandleCount || 0), 0)
    statItems.value[2].value = activedAlarm
    alarmStatistics.value = data.slice(0, 2)
  }).catch(err => { })
}

const handleNodeClick = (data) => {
  if (videoMonitorRef.value) {
    let categoryId = data.id
    let options = {}

    if (data.type === 'all') {
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
  listAlarmInfo({
    page: 1,
    size: 2,
    status: 0,
    // startTime: `${getDateDaysAgo(0)} 00:00:00`,
    // endTime: `${getDateDaysAgo(0)} 23:59:59`
  }).then(res => {
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


// 开启大型弹窗
const handleOpenLargeDialog = (type) => {
  datavStore.openLargeDialog(type)
}



// 监听告警开关
watch(alarmActive, (newVal) => {
  datavStore.toggleAlarmActive(newVal)
}, { immediate: true })

const gotoDashboard = () => {
  // 原有逻辑：退回到后台管理界面
  const currentHref = window.top.location.href
  // const newUrl = currentHref.replace(/#.*$/, '#/index')
  // window.top.location.href = newUrl
  const newUrl = currentHref.replace(/#.*$/, '#/aiView');
  window.top.location.href = newUrl;
}

const handleMapScreen = () => {
  router.push({ name: 'DatavMapscreen' })
}

// 统一刷新告警相关数据（统计+列表+趋势）
const refreshAllAlarmData = () => {
  getAlarmStats()
  getCameraWarnList()
  getAlarmTrend()
}

// 生命周期
onMounted(() => {
  console.info('[DataV] 页面初始化开始...');
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
  // 停止轮巡
  datavStore.stopAlarmCycle()

  if (statisticsTimer) {
    clearInterval(statisticsTimer)
    statisticsTimer = null
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
