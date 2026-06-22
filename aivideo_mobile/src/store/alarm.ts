import type { IAlarmListItem } from '@/api/alarm'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 告警选择状态管理
 */
export const useAlarmStore = defineStore(
  'alarm',
  () => {
    const selectedAlarm = ref<IAlarmListItem | null>(null)

    /**
     * 设置选中的告警
     */
    const setSelectedAlarm = (alarm: IAlarmListItem | null) => {
      selectedAlarm.value = alarm
    }

    /**
     * 清除选中状态
     */
    const clearSelection = () => {
      selectedAlarm.value = null
    }

    return {
      // 状态
      selectedAlarm,

      // 操作方法
      setSelectedAlarm,
      clearSelection,
    }
  },
  {
    // 启用持久化存储
    persist: true,
  },
)
