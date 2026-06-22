<template>
  <div class="app-container visual-dashboard" v-loading="loading">
    <el-row :gutter="16">
      <el-col v-for="card in overviewCards" :key="card.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value">{{ card.value }}</div>
          <div class="stat-extra">{{ card.extra }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="section-row">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>资源在线情况</template>
          <div class="progress-pair">
            <div>
              <el-progress type="dashboard" :percentage="percentage(resourceStat.instance)" />
              <p>视图库在线率</p>
            </div>
            <div>
              <el-progress type="dashboard" :percentage="percentage(resourceStat.device)" />
              <p>设备在线率</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>数据采集概览</template>
          <el-table :data="collectRows" border>
            <el-table-column label="类型" prop="label" align="center" />
            <el-table-column label="数量" prop="value" align="center" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="section-row">
      <template #header>订阅统计</template>
      <el-table :data="subscribeRows" border>
        <el-table-column label="指标" prop="label" align="center" />
        <el-table-column label="数量" prop="value" align="center" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getCollectStat, getResourceOnlineStat, getSubscribeStat } from '@/api/visual-library'

const loading = ref(false)
const resourceStat = reactive({})
const collectStat = reactive({})
const subscribeStat = reactive({})

const overviewCards = computed(() => [
  { label: '视图库总数', value: getCount(resourceStat.instance, 'total'), extra: `在线 ${getCount(resourceStat.instance, 'online')}` },
  { label: '采集设备总数', value: getCount(resourceStat.device, 'total'), extra: `在线 ${getCount(resourceStat.device, 'online')}` },
  { label: '卡口总数', value: getCount(resourceStat.tollgate, 'total'), extra: `在线 ${getCount(resourceStat.tollgate, 'online')}` },
  { label: '车道总数', value: getCount(resourceStat.lane, 'total'), extra: `在线 ${getCount(resourceStat.lane, 'online')}` }
])

const collectRows = computed(() => [
  { label: '人脸', value: getCount(collectStat, 'face') },
  { label: '人员', value: getCount(collectStat, 'person') },
  { label: '车辆', value: getCount(collectStat, 'motorVehicle') },
  { label: '非机动车', value: getCount(collectStat, 'nonMotorVehicle') },
  { label: '图像', value: getCount(collectStat, 'image') },
  { label: '视频片段', value: getCount(collectStat, 'videoSlice') }
])

const subscribeRows = computed(() => [
  { label: '下级订阅', value: getCount(subscribeStat, 'down') },
  { label: '上级订阅', value: getCount(subscribeStat, 'up') },
  { label: '订阅通知', value: getCount(subscribeStat, 'notification') },
  { label: '推送成功', value: getCount(subscribeStat, 'success') },
  { label: '推送失败', value: getCount(subscribeStat, 'failed') }
])

onMounted(loadDashboard)

async function loadDashboard() {
  loading.value = true
  try {
    const [resource, collect, subscribe] = await Promise.allSettled([
      getResourceOnlineStat(),
      getCollectStat(),
      getSubscribeStat()
    ])
    Object.assign(resourceStat, normalize(resource))
    Object.assign(collectStat, normalize(collect))
    Object.assign(subscribeStat, normalize(subscribe))
  } finally {
    loading.value = false
  }
}

function normalize(result) {
  if (result.status !== 'fulfilled') return {}
  return result.value?.data || result.value || {}
}

function getCount(source, key) {
  if (!source) return 0
  return Number(source[key] ?? source[key?.toLowerCase?.()] ?? 0)
}

function percentage(source) {
  const total = getCount(source, 'total')
  const online = getCount(source, 'online')
  if (!total) return 0
  return Math.round((online / total) * 100)
}
</script>

<style scoped>
.visual-dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card {
  min-height: 116px;
}

.stat-label {
  color: #606266;
  font-size: 14px;
}

.stat-value {
  margin-top: 12px;
  color: #303133;
  font-size: 30px;
  font-weight: 600;
}

.stat-extra {
  margin-top: 8px;
  color: #909399;
}

.section-row {
  margin-top: 16px;
}

.progress-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
}
</style>
