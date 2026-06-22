<template>
  <el-dialog v-model="visible" title="告警详情" width="920px" destroy-on-close @open="getDetail" @closed="resetState">
    <el-row v-loading="loading" :gutter="16">
      <template v-if="detail">
        <el-col :span="14">
          <el-radio-group v-model="viewType" class="mb12" @change="changeViewType">
            <el-radio-button label="image">查看图片</el-radio-button>
            <el-radio-button label="video">查看回放</el-radio-button>
            <el-radio-button label="live">实时视频</el-radio-button>
          </el-radio-group>

          <div v-if="viewType === 'image'" class="media-box">
            <el-image
              :src="toImageUrl(detail.alarm_img)"
              :preview-src-list="[toImageUrl(detail.alarm_img)]"
              :z-index="4000"
              fit="contain"
              preview-teleported
              class="media-image"
            />
          </div>
          <div v-else-if="viewType === 'video'" class="media-box">
            <StreamPlayer v-if="detail.videoUrl" :url="detail.videoUrl" />
            <el-empty v-else description="暂无回放视频" />
          </div>
          <div v-else class="media-box">
            <StreamPlayer v-if="liveVideoUrl" :url="liveVideoUrl" />
            <el-empty v-else description="暂无实时视频地址" />
          </div>
        </el-col>
        <el-col :span="10">
          <el-descriptions title="告警信息" :column="1" border>
            <el-descriptions-item label="检测类型">{{ detail.modelname || '-' }}</el-descriptions-item>
            <el-descriptions-item label="置信度">90%</el-descriptions-item>
            <el-descriptions-item label="设备名称">{{ detail.device_name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="通知方式">{{ detail.notice_type || '微信' }}</el-descriptions-item>
            <el-descriptions-item label="通知人员">
              <el-space wrap>
                <el-tag v-for="name in detail.notice_unames || []" :key="name">{{ name }}</el-tag>
                <span v-if="!detail.notice_unames || detail.notice_unames.length === 0">-</span>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label="告警时间">{{ detail.alarm_time || '-' }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
      </template>
      <el-col v-else :span="24">
        <el-empty description="暂无告警详情" />
      </el-col>
    </el-row>

    <template #footer>
      <template v-if="detail?.status === 0">
        <el-button :loading="handleLoading" @click="handleStatus(2)">误报</el-button>
        <el-button type="primary" :loading="handleLoading" @click="handleStatus(1)">快速处理</el-button>
      </template>
      <el-button v-else-if="detail?.status === 1" disabled>已处理</el-button>
      <el-button v-else-if="detail?.status === 2" disabled>误报</el-button>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import StreamPlayer from '@/components/video/StreamPlayer/index.vue'
import { getAlarmDetail, handleAlarm, startLiveVideo } from '@/api/ai/alarm'
import { pickLiveUrl, toImageUrl } from '../../utils'

const props = defineProps({
  modelValue: Boolean,
  alarmItem: {
    type: Object,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'handled'])

const visible = ref(props.modelValue)
const loading = ref(false)
const handleLoading = ref(false)
const detail = ref()
const viewType = ref('image')
const liveVideoUrl = ref('')

watch(() => props.modelValue, (value) => {
  visible.value = value
})

watch(visible, (value) => {
  emit('update:modelValue', value)
})

function getDetail() {
  if (!props.alarmItem?.id) return
  loading.value = true
  getAlarmDetail({ alarm_id: props.alarmItem.id }).then((res) => {
    detail.value = res
  }).finally(() => {
    loading.value = false
  })
}

function resetState() {
  viewType.value = 'image'
  liveVideoUrl.value = ''
  detail.value = undefined
}

function handleStatus(status) {
  handleLoading.value = true
  handleAlarm({
    alarmId: props.alarmItem.id,
    status
  }).then(() => {
    ElMessage.success('操作成功')
    if (detail.value) detail.value.status = status
    emit('handled')
  }).finally(() => {
    handleLoading.value = false
  })
}

function changeViewType(type) {
  if (type === 'live') getLiveVideoUrl()
}

function getLiveVideoUrl() {
  const nationalNum = detail.value?.detail?.national_num
  const channel = detail.value?.detail?.channel
  if (!nationalNum || !channel) {
    ElMessage.warning('缺少设备参数，无法获取实时视频')
    return
  }
  startLiveVideo({
    national_num: nationalNum,
    channel
  }).then((res) => {
    liveVideoUrl.value = pickLiveUrl(res)
    if (!liveVideoUrl.value) ElMessage.warning('获取实时视频流失败')
  })
}
</script>

<style scoped>
.media-box {
  width: 100%;
  height: 300px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-image {
  width: 100%;
  height: 100%;
}
</style>
