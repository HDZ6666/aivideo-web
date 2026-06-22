<template>
  <div class="app-container video-console-page">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="InfoFilled" @click="showInfo">平台信息</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Refresh" :loading="loading" @click="refreshAll">刷新</el-button>
      </el-col>
      <right-toolbar :show-search="false" @queryTable="refreshAll"></right-toolbar>
    </el-row>

    <el-row :gutter="16">
      <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
        <el-card shadow="never" class="console-card">
          <template #header>CPU</template>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item v-for="item in normalizeMetric(systemInfo.cpu)" :key="item.label" :label="item.label">
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
        <el-card shadow="never" class="console-card">
          <template #header>资源</template>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item v-for="item in normalizeMetric(resourceInfo)" :key="item.label" :label="item.label">
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
        <el-card shadow="never" class="console-card">
          <template #header>网络</template>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item v-for="item in normalizeMetric(systemInfo.net)" :key="`net-${item.label}`" :label="item.label">
              {{ item.value }}
            </el-descriptions-item>
            <el-descriptions-item v-for="item in normalizeMetric(systemInfo.netTotal)" :key="`total-${item.label}`" :label="`累计${item.label}`">
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
        <el-card shadow="never" class="console-card">
          <template #header>内存</template>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item v-for="item in normalizeMetric(systemInfo.mem)" :key="item.label" :label="item.label">
              {{ item.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
        <el-card shadow="never" class="console-card">
          <template #header>媒体节点负载</template>
          <el-table :data="mediaServerLoad" size="small" height="220">
            <el-table-column prop="id" label="节点" min-width="110" show-overflow-tooltip />
            <el-table-column prop="push" label="推流" width="70" align="center" />
            <el-table-column prop="proxy" label="代理" width="70" align="center" />
            <el-table-column prop="gbReceive" label="国标" width="70" align="center" />
            <el-table-column prop="count" label="总数" width="70" align="center" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
        <el-card shadow="never" class="console-card">
          <template #header>磁盘</template>
          <el-table :data="diskList" size="small" height="220">
            <el-table-column prop="label" label="磁盘" min-width="110" show-overflow-tooltip />
            <el-table-column prop="value" label="信息" min-width="160" show-overflow-tooltip />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="infoOpen" title="平台信息" width="680px" append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item v-for="item in normalizeMetric(platformInfo)" :key="item.label" :label="item.label">
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="infoOpen = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import request from '@/utils/video/request'

const loading = ref(false)
const infoOpen = ref(false)
const systemInfo = reactive({
  cpu: {},
  mem: {},
  net: {},
  netTotal: {},
  disk: {}
})
const resourceInfo = ref({})
const mediaServerLoad = ref([])
const platformInfo = ref({})

const diskList = computed(() => normalizeMetric(systemInfo.disk))

onMounted(() => {
  refreshAll()
})

function refreshAll(showLoading = true) {
  if (showLoading) {
    loading.value = true
  }
  Promise.allSettled([getSystemInfo(), getLoad(), getResourceInfo()]).finally(() => {
    if (showLoading) {
      loading.value = false
    }
  })
}

function getSystemInfo() {
  return request({ method: 'get', url: '/api/server/system/info' }).then((res) => {
    Object.assign(systemInfo, {
      cpu: res.data?.cpu || {},
      mem: res.data?.mem || {},
      net: res.data?.net || {},
      netTotal: res.data?.netTotal || {},
      disk: res.data?.disk || {}
    })
  })
}

function getLoad() {
  return request({ method: 'get', url: '/api/server/media_server/load' }).then((res) => {
    const data = res.data || []
    mediaServerLoad.value = Array.isArray(data) ? data : normalizeLoadObject(data)
  })
}

function getResourceInfo() {
  return request({ method: 'get', url: '/api/server/resource/info' }).then((res) => {
    resourceInfo.value = res.data || {}
  })
}

function showInfo() {
  request({ method: 'get', url: '/api/server/system/configInfo' }).then((res) => {
    platformInfo.value = res.data || {}
    infoOpen.value = true
  })
}

function normalizeMetric(data) {
  if (!data || typeof data !== 'object') return []
  return Object.keys(data).map((key) => ({
    label: key,
    value: formatMetricValue(data[key])
  }))
}

function normalizeLoadObject(data) {
  if (!data || typeof data !== 'object') return []
  return Object.keys(data).map((key) => ({
    id: key,
    ...(typeof data[key] === 'object' ? data[key] : { count: data[key] })
  }))
}

function formatMetricValue(value) {
  if (Array.isArray(value)) return value.join(', ')
  if (value && typeof value === 'object') return JSON.stringify(value)
  return value ?? '-'
}
</script>

<style scoped>
.console-card {
  height: 280px;
  margin-bottom: 16px;
}
</style>
