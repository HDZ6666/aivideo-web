<template>
  <el-form-item label="接入引擎" prop="engine">
    <el-radio-group v-model="form.engine">
      <el-radio v-for="item in ENGINE_OPTIONS" :key="item.value" :label="item.value">
        {{ item.label }}
      </el-radio>
    </el-radio-group>
  </el-form-item>

  <el-form-item label="选择设备" prop="device">
    <DeviceSelect v-model="form.device" :alarm-type-id="alarmTypeId" :disabled="!selectDeviceable" />
  </el-form-item>

  <el-form-item label="通知方式" prop="notificateType">
    <el-checkbox-group v-model="form.notificateType">
      <el-checkbox v-for="item in NOTIFICATE_TYPE_OPTIONS" :key="item.value" :label="item.value">
        {{ item.label }}
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>

  <el-form-item label="通知人员" prop="notificatePeople">
    <UserSelect v-model="form.notificatePeople" />
  </el-form-item>

  <el-form-item label="检查时间" prop="timelines">
    <RuleTimeline v-model="form.timelines" />
  </el-form-item>

  <el-form-item label="抽帧间隔" prop="splitTime">
    <el-input-number v-model="form.splitTime" :min="0" :precision="0" controls-position="right" />
    <span class="unit-text">毫秒</span>
  </el-form-item>

  <template v-if="frameSetAble">
    <el-form-item label="抽帧配置">
      <el-button type="danger" plain @click="showFrameSet = !showFrameSet">
        {{ showFrameSet ? '收起' : '展开' }}
      </el-button>
    </el-form-item>
    <template v-if="showFrameSet">
      <el-form-item label="抽帧对比" prop="isCompare">
        <el-radio-group v-model="form.isCompare">
          <el-radio :label="0">不对比</el-radio>
          <el-radio :label="1">前后帧对比</el-radio>
          <el-radio :label="2">固定帧对比</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.isCompare !== 0" label="最小/最大帧值">
        <el-input-number v-model="form.compareMinSize" :min="0" :max="100" :precision="0" />
        <span class="range-text">至</span>
        <el-input-number v-model="form.compareMaxSize" :min="0" :max="100" :precision="0" />
        <span class="unit-text">%</span>
      </el-form-item>
      <el-form-item v-if="form.isCompare === 2" label="固定帧对比" prop="comparePicture">
        <SnapshotSelect v-model="form.comparePicture" />
      </el-form-item>
    </template>
  </template>

  <el-form-item v-if="showTracking" label="目标追踪">
    <el-radio-group v-model="form.trackingEnabled">
      <el-radio :label="0">禁用</el-radio>
      <el-radio :label="1">启用</el-radio>
    </el-radio-group>
    <template v-if="form.trackingEnabled === 1">
      <el-input-number
        v-model="form.trackingDuration"
        :min="0"
        :precision="0"
        controls-position="right"
        class="tracking-input"
      />
      <span class="unit-text">分钟</span>
    </template>
  </el-form-item>

  <el-form-item v-if="!hideAlarmTime" label="同一告警间隔通知时间" prop="alarmTime">
    <el-input-number v-model="form.alarmTime" :min="0" :precision="0" controls-position="right" />
    <span class="unit-text">分钟</span>
  </el-form-item>

  <el-form-item label="置信度" prop="confidence">
    <el-slider v-model="form.confidence" :min="0" :max="100" show-input />
  </el-form-item>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ENGINE_OPTIONS, NOTIFICATE_TYPE_OPTIONS } from '../../utils'
import DeviceSelect from './DeviceSelect.vue'
import RuleTimeline from './RuleTimeline.vue'
import SnapshotSelect from './SnapshotSelect.vue'
import UserSelect from './UserSelect.vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  alarmTypeId: {
    type: [String, Number],
    default: undefined
  },
  selectDeviceable: {
    type: Boolean,
    default: true
  },
  frameSetAble: {
    type: Boolean,
    default: true
  }
})

const showFrameSet = ref(false)
const showTracking = computed(() => [11, 82].includes(Number(props.alarmTypeId)))
const hideAlarmTime = computed(() => showTracking.value && props.form.trackingEnabled === 1)
</script>

<style scoped>
.unit-text,
.range-text {
  margin-left: 8px;
  color: var(--el-text-color-secondary);
}

.range-text {
  margin-right: 8px;
}

.tracking-input {
  margin-left: 16px;
}
</style>

