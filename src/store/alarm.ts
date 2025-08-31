/**
 * 告警管理状态存储
 * 基于 Pinia 的告警状态管理，包含告警列表、筛选条件、统计信息等
 */

import type { IAlarmListItem } from '@/api/alarm'
import type { IAlarmStats } from '@/mock/alarm'
import { defineStore } from 'pinia'
import { AlarmStatus } from '@/api/alarm'
import { getAlarmStats } from '@/mock/alarm'

export const useAlarmStore = defineStore(
  'alarm',
  () => {
    // ==================== 状态定义 ====================

    // 告警列表数据
    const alarmList = ref<IAlarmListItem[]>([])

    // 加载状态
    const loading = ref(false)

    // 筛选条件
    const searchKeyword = ref('')
    const selectedStatus = ref<AlarmStatus | undefined>(undefined)
    const selectedAlarmType = ref('')

    // 统计信息
    const stats = ref<IAlarmStats>({
      totalAlarms: 0,
      unprocessedAlarms: 0,
      processedAlarms: 0,
      falseAlarms: 0,
      todayAlarms: 0,
    })

    // 分页信息
    const pagination = ref({
      current: 1,
      pageSize: 20,
      total: 0,
    })

    // ==================== 计算属性 ====================

    // 过滤后的告警列表
    const filteredAlarmList = computed(() => {
      let filtered = [...alarmList.value]

      // 按关键词过滤
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        filtered = filtered.filter(alarm =>
          alarm.deviceName?.toLowerCase().includes(keyword)
          || alarm.modelname?.toLowerCase().includes(keyword),
        )
      }

      // 按状态过滤
      if (selectedStatus.value !== undefined) {
        filtered = filtered.filter(alarm => alarm.status === selectedStatus.value)
      }

      // 按告警类型过滤
      if (selectedAlarmType.value) {
        filtered = filtered.filter(alarm =>
          alarm.modelname?.includes(selectedAlarmType.value),
        )
      }

      return filtered
    })

    // 未处理告警列表
    const unprocessedAlarms = computed(() => {
      return alarmList.value.filter(alarm => alarm.status === AlarmStatus.UNPROCESSED)
    })

    // 今日告警列表
    const todayAlarms = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return alarmList.value.filter(alarm =>
        alarm.alarmTime.startsWith(today),
      )
    })

    // 是否有筛选条件
    const hasFilters = computed(() => {
      return searchKeyword.value
        || selectedStatus.value !== undefined
        || selectedAlarmType.value
    })

    // ==================== 操作方法 ====================

    // 设置告警列表
    const setAlarmList = (newAlarmList: IAlarmListItem[]) => {
      alarmList.value = newAlarmList
    }

    // 刷新统计信息
    const refreshStats = () => {
      try {
        stats.value = getAlarmStats()
      }
      catch (error) {
        console.error('刷新告警统计失败:', error)
      }
    }

    // 添加告警
    const addAlarm = (alarm: IAlarmListItem) => {
      alarmList.value.unshift(alarm)
      refreshStats()
    }

    // 更新告警
    const updateAlarm = (alarmId: number, updates: Partial<IAlarmListItem>) => {
      const index = alarmList.value.findIndex(alarm => alarm.id === alarmId)
      if (index !== -1) {
        alarmList.value[index] = { ...alarmList.value[index], ...updates }
        refreshStats()
      }
    }

    // 删除告警
    const removeAlarm = (alarmId: number) => {
      const index = alarmList.value.findIndex(alarm => alarm.id === alarmId)
      if (index !== -1) {
        alarmList.value.splice(index, 1)
        refreshStats()
      }
    }

    // 批量更新告警状态
    const batchUpdateStatus = (alarmIds: number[], status: AlarmStatus) => {
      alarmIds.forEach((id) => {
        updateAlarm(id, { status })
      })
    }

    // 设置搜索关键词
    const setSearchKeyword = (keyword: string) => {
      searchKeyword.value = keyword
    }

    // 设置状态筛选
    const setSelectedStatus = (status: AlarmStatus | undefined) => {
      selectedStatus.value = status
    }

    // 设置告警类型筛选
    const setSelectedAlarmType = (alarmType: string) => {
      selectedAlarmType.value = alarmType
    }

    // 清除所有筛选条件
    const clearFilters = () => {
      searchKeyword.value = ''
      selectedStatus.value = undefined
      selectedAlarmType.value = ''
    }

    // 设置加载状态
    const setLoading = (isLoading: boolean) => {
      loading.value = isLoading
    }

    // 设置分页信息
    const setPagination = (page: number, pageSize: number, total: number) => {
      pagination.value = {
        current: page,
        pageSize,
        total,
      }
    }

    // 重置分页
    const resetPagination = () => {
      pagination.value = {
        current: 1,
        pageSize: 20,
        total: 0,
      }
    }

    // 获取告警详情
    const getAlarmById = (alarmId: number) => {
      return alarmList.value.find(alarm => alarm.id === alarmId)
    }

    // 获取状态统计
    const getStatusStats = () => {
      const total = alarmList.value.length
      const unprocessed = alarmList.value.filter(alarm => alarm.status === AlarmStatus.UNPROCESSED).length
      const processed = alarmList.value.filter(alarm => alarm.status === AlarmStatus.PROCESSED).length
      const falseAlarm = alarmList.value.filter(alarm => alarm.status === AlarmStatus.FALSE_ALARM).length

      return {
        total,
        unprocessed,
        processed,
        falseAlarm,
        processedRate: total > 0 ? Math.round(((processed + falseAlarm) / total) * 100) : 0,
      }
    }

    // ==================== 初始化 ====================

    // 初始化统计信息
    refreshStats()

    return {
      // 状态
      alarmList,
      loading,
      searchKeyword,
      selectedStatus,
      selectedAlarmType,
      stats,
      pagination,

      // 计算属性
      filteredAlarmList,
      unprocessedAlarms,
      todayAlarms,
      hasFilters,

      // 操作方法
      setAlarmList,
      addAlarm,
      updateAlarm,
      removeAlarm,
      batchUpdateStatus,
      setSearchKeyword,
      setSelectedStatus,
      setSelectedAlarmType,
      clearFilters,
      setLoading,
      refreshStats,
      setPagination,
      resetPagination,
      getAlarmById,
      getStatusStats,
    }
  },
  {
    // 关闭持久化存储
    persist: false,
  },
)
