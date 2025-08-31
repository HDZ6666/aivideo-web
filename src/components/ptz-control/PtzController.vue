<!-- 云台控制容器组件 -->
<script lang="ts" setup>
import type { DeviceChannelInfo } from '../device-selector'
// 导入统一的类型定义
import type { ControlParams } from './types'
import type { PtzCommand } from '@/api/device'
import { computed, reactive } from 'vue'
import { ControlCommand, deviceControl, ptzControl } from '@/api/device'
import { DeviceType } from '@/store/device'
import PtzCruiseControl from './components/PtzCruiseControl.vue'
import PtzDirectionControl from './components/PtzDirectionControl.vue'
import PtzPresetControl from './components/PtzPresetControl.vue'
import PtzScanControl from './components/PtzScanControl.vue'
import PtzSpeedControl from './components/PtzSpeedControl.vue'
import PtzZoomControl from './components/PtzZoomControl.vue'

// Props
interface Props {
  deviceChannelInfo: DeviceChannelInfo | null
  // 控制子组件显示
  showSpeedControl?: boolean
  showDirectionControl?: boolean
  showZoomControl?: boolean
  showPresetControl?: boolean
  showCruiseControl?: boolean
  showScanControl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSpeedControl: true,
  showDirectionControl: true,
  showZoomControl: true,
  showPresetControl: true,
  showCruiseControl: true,
  showScanControl: true,
})

const emit = defineEmits<Emits>()

// Events
interface Emits {
  'control-success': [result: { type: 'ptz' | 'device', action: string, data?: any }]
  'control-error': [error: { type: 'ptz' | 'device', action: string, message: string }]
}

// 控制参数
const controlParams = reactive<ControlParams>({
  ptz: {
    speed: 30,
  },
  preset: {
    id: 1,
  },
  cruise: {
    groupId: 0,
    speed: 100,
    time: 5,
  },
  scan: {
    groupId: 0,
    speed: 100,
  },
})

// 控制状态
const controlState = reactive({
  loading: false,
  lastOperation: null as any,
})

// 计算属性：是否显示功能控制区域
const showFunctionControls = computed(() => {
  return props.showPresetControl || props.showCruiseControl || props.showScanControl
})

// 计算属性：是否显示方向和变焦控制区域
const showDirectionZoomSection = computed(() => {
  return props.showDirectionControl || props.showZoomControl || showFunctionControls.value
})

// 速度控制事件处理
function onSpeedChange(speed: number) {
  controlParams.ptz.speed = speed
}

// 云台控制处理
async function handlePtzControl(direction: PtzCommand) {
  try {
    if (props.deviceChannelInfo
      && props.deviceChannelInfo.deviceType === DeviceType.NATIONAL
      && props.deviceChannelInfo.deviceId
      && props.deviceChannelInfo.channelId) {
      await ptzControl(
        props.deviceChannelInfo.deviceId,
        props.deviceChannelInfo.channelId,
        direction,
        controlParams.ptz.speed,
      )
      emit('control-success', {
        type: 'ptz',
        action: direction.toString(),
        data: { direction, speed: controlParams.ptz.speed },
      })
    }
  }
  catch (error: any) {
    emit('control-error', {
      type: 'ptz',
      action: direction.toString(),
      message: error?.message || '云台控制失败',
    })
  }
}

// 方向控制事件处理
function onDirectionControl(direction: PtzCommand) {
  handlePtzControl(direction)
}

// 变焦控制事件处理
function onZoomControl(direction: PtzCommand) {
  handlePtzControl(direction)
}

// 设备控制处理
async function handleDeviceControl(command: ControlCommand, parameter1: number, parameter2: number) {
  try {
    if (props.deviceChannelInfo
      && props.deviceChannelInfo.deviceType === DeviceType.NATIONAL
      && props.deviceChannelInfo.deviceId
      && props.deviceChannelInfo.channelId) {
      let finalParameter1 = parameter1
      let finalParameter2 = parameter2
      let combindCode2 = 0

      if (command === 129 || command === 130 || command === 131) {
        finalParameter1 = 0
        finalParameter2 = parameter2
        combindCode2 = 0
      }
      else if (command === 134 || command === 135 || command === 138) {
        finalParameter2 = parameter2 % 256
        combindCode2 = Math.floor(parameter2 / 256) * 16
      }

      await deviceControl(
        props.deviceChannelInfo.deviceId,
        props.deviceChannelInfo.channelId,
        command,
        finalParameter1,
        finalParameter2,
        combindCode2,
      )

      emit('control-success', {
        type: 'device',
        action: command.toString(),
        data: { command, parameter1, parameter2 },
      })
    }
  }
  catch (error: any) {
    emit('control-error', {
      type: 'device',
      action: command.toString(),
      message: error?.message || '设备控制失败',
    })
  }
}

// 预设控制事件处理
function onPresetSet(id: number) {
  controlParams.preset.id = id
  handleDeviceControl(ControlCommand.PRESET_SET, 0, id)
}

function onPresetCall(id: number) {
  handleDeviceControl(ControlCommand.PRESET_CALL, 0, id)
}

function onPresetDelete(id: number) {
  handleDeviceControl(ControlCommand.PRESET_DELETE, 0, id)
}

// 巡航控制事件处理
function onCruiseSetSpeed(speed: number) {
  controlParams.cruise.speed = speed
  handleDeviceControl(ControlCommand.CRUISE_SET_SPEED, controlParams.cruise.groupId, speed)
}

function onCruiseSetTime(time: number) {
  controlParams.cruise.time = time
  handleDeviceControl(ControlCommand.CRUISE_SET_TIME, controlParams.cruise.groupId, time)
}

function onCruiseAddPoint(groupId: number) {
  controlParams.cruise.groupId = groupId
  handleDeviceControl(ControlCommand.CRUISE_ADD_POINT, groupId, 0)
}

function onCruiseDeletePoint(groupId: number) {
  handleDeviceControl(ControlCommand.CRUISE_DELETE_POINT, groupId, 0)
}

function onCruiseStart(groupId: number) {
  handleDeviceControl(ControlCommand.CRUISE_START, groupId, 0)
}

// 扫描控制事件处理
function onScanSetSpeed(speed: number) {
  controlParams.scan.speed = speed
  handleDeviceControl(ControlCommand.SCAN_SET_SPEED, controlParams.scan.groupId, speed)
}

function onScanSetBoundary(groupId: number, boundary: number) {
  controlParams.scan.groupId = groupId
  handleDeviceControl(ControlCommand.SCAN_START, groupId, boundary)
}

function onScanStart(groupId: number) {
  handleDeviceControl(ControlCommand.SCAN_START, groupId, 0)
}
</script>

<template>
  <view class="ptz-controller">
    <!-- 国标设备 - 云台控制卡片 -->
    <view
      v-if="deviceChannelInfo?.deviceType === DeviceType.NATIONAL && deviceChannelInfo?.deviceId && deviceChannelInfo?.channelId"
      class="ptz-control-card mb-32rpx rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg"
    >
      <!-- 装饰性渐变背景 -->
      <view
        class="card-gradient absolute h-128rpx w-128rpx rounded-full from-blue-400 to-blue-600 bg-gradient-to-br opacity-10 -right-32rpx -top-32rpx"
      />

      <view class="ptz-control-content relative z-10">
        <!-- 控制标题 -->
        <view class="control-header mb-24rpx">
          <text class="control-title text-32rpx text-gray-800 font-semibold">
            云台控制
          </text>
        </view>

        <!-- 控制区域 -->
        <view class="control-area">
          <!-- 速度控制 -->
          <PtzSpeedControl
            v-if="props.showSpeedControl"
            :speed="controlParams.ptz.speed"
            @speed-change="onSpeedChange"
          />

          <!-- 方向和变焦控制 -->
          <view v-if="showDirectionZoomSection" class="direction-zoom-section">
            <view class="control-grid flex items-center justify-between">
              <!-- 方向控制 -->
              <PtzDirectionControl
                v-if="props.showDirectionControl"
                :disabled="controlState.loading"
                @direction-control="onDirectionControl"
              />

              <!-- 变焦控制 -->
              <PtzZoomControl
                v-if="props.showZoomControl"
                :disabled="controlState.loading"
                @zoom-control="onZoomControl"
              />

              <!-- 功能控制按钮 -->
              <view v-if="showFunctionControls" class="function-controls">
                <text class="section-label mb-16rpx block text-center text-24rpx text-gray-600">
                  功能控制
                </text>
                <view class="function-buttons flex flex-col gap-12rpx">
                  <!-- 预设按钮 -->
                  <PtzPresetControl
                    v-if="props.showPresetControl"
                    :preset-id="controlParams.preset.id"
                    :disabled="controlState.loading"
                    @preset-set="onPresetSet"
                    @preset-call="onPresetCall"
                    @preset-delete="onPresetDelete"
                  />

                  <!-- 巡航按钮 -->
                  <PtzCruiseControl
                    v-if="props.showCruiseControl"
                    :cruise-params="controlParams.cruise"
                    :disabled="controlState.loading"
                    @cruise-set-speed="onCruiseSetSpeed"
                    @cruise-set-time="onCruiseSetTime"
                    @cruise-add-point="onCruiseAddPoint"
                    @cruise-delete-point="onCruiseDeletePoint"
                    @cruise-start="onCruiseStart"
                  />

                  <!-- 扫描按钮 -->
                  <PtzScanControl
                    v-if="props.showScanControl"
                    :scan-params="controlParams.scan"
                    :disabled="controlState.loading"
                    @scan-set-speed="onScanSetSpeed"
                    @scan-set-boundary="onScanSetBoundary"
                    @scan-start="onScanStart"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 无云台提示卡片 - 拉流设备或未选择设备 -->
    <view v-else class="no-ptz-card mb-32rpx rounded-24rpx bg-white p-32rpx shadow-gray-200/60 shadow-lg">
      <!-- 装饰性渐变背景 -->
      <view
        class="card-gradient absolute h-128rpx w-128rpx rounded-full from-gray-400 to-gray-600 bg-gradient-to-br opacity-10 -right-32rpx -top-32rpx"
      />

      <view class="no-ptz-content relative z-10 text-center">
        <!-- 图标 -->
        <view class="no-ptz-icon mb-24rpx flex justify-center">
          <view class="icon-wrapper h-120rpx w-120rpx flex items-center justify-center rounded-full bg-gray-100">
            <view
              :class="deviceChannelInfo?.deviceType === DeviceType.NATIONAL ? 'i-carbon-warning' : 'i-carbon-video'"
              class="h-60rpx w-60rpx text-gray-400"
            />
          </view>
        </view>

        <!-- 标题 -->
        <view class="no-ptz-title mb-16rpx">
          <text class="text-28rpx text-gray-800 font-semibold">
            {{ deviceChannelInfo?.deviceType === DeviceType.NATIONAL ? '请选择设备' : '拉流设备' }}
          </text>
        </view>

        <!-- 描述 -->
        <view class="no-ptz-description">
          <text class="text-24rpx text-gray-500 leading-relaxed">
            {{ deviceChannelInfo?.deviceType === DeviceType.NATIONAL ? '请先选择设备和通道，然后才能使用云台控制功能' : '当前设备为拉流设备，不支持云台控制功能' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ptz-controller {
  .ptz-control-card,
  .no-ptz-card {
    position: relative;
    overflow: hidden;
  }

  .ptz-control-content,
  .no-ptz-content {
    position: relative;
    z-index: 10;
  }

  .function-controls {
    .function-buttons {
      gap: 12rpx;
    }
  }

  // 无云台提示卡片样式
  .no-ptz-card {
    .no-ptz-content {
      .no-ptz-icon {
        .icon-wrapper {
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.05);
            background: #f3f4f6;
          }
        }
      }

      .no-ptz-title {
        text {
          font-weight: 600;
        }
      }

      .no-ptz-description {
        text {
          line-height: 1.6;
        }
      }
    }
  }
}
</style>
