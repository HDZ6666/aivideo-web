import { defineStore } from 'pinia'
import { listAlarmInfo } from '@/api/datav/monitor.js'

// 模块级私有变量，避免放置在 actions 中导致 Pinia 响应式系统报错
let alarmTimer = null

export const useDatavStore = defineStore('datav_v2', {
    state: () => ({
        // 从本地存储初始化，如果不存在则默认为 false
        alarmActive: localStorage.getItem('datav_alarm_active') === 'true', 
        detailVisible: false,            // 详情弹窗显隐
        detailInfo: {},                  // 详情数据
        isManualMode: false,             // 是否为手动点开详情
        statsDialogVisible: false,       // 统计大窗显隐
        gridDialogVisible: false,        // 九宫格大窗显隐
        cameraWarnList: [],              // 摄像头告警列表（轮巡数据源）
        refreshCount: 0,                 // 全局刷新信号
        
        // 视频监控设置持久化
        videoAutoPlay: localStorage.getItem('datav_video_autoplay') === 'true',
        videoPageSize: localStorage.getItem('datav_video_pagesize') || '4'
    }),
    
    getters: {
        // 只要有任一大窗开启，即视为“忙碌”状态
        isSystemBusy: (state) => state.statsDialogVisible || state.gridDialogVisible
    },

    actions: {
        // 1. 物理停止轮巡
        stopAlarmCycle() {
            if (alarmTimer) {
                clearTimeout(alarmTimer)
                alarmTimer = null
            }
        },

        // 2. 准备恢复轮巡（带 3s 缓冲）
        resumeAlarmCycle() {
            this.stopAlarmCycle()
            // 只有开启了开关，且没有大窗遮挡，才允许恢复
            if (this.alarmActive && !this.isSystemBusy) {
                alarmTimer = setTimeout(() => {
                    this.runAlarmCycle()
                }, 5000)
            }
        },

        // 3. 执行轮巡逻辑
        runAlarmCycle() {
            // 环境检查
            if (this.isSystemBusy || !this.alarmActive) return

            if (this.cameraWarnList.length > 0) {
                // 自动模式展示第一条
                this.detailInfo = this.cameraWarnList[0]
                this.detailVisible = true
                this.isManualMode = false

                this.stopAlarmCycle()
                alarmTimer = setTimeout(() => {
                    // 只有在非手动模式下，到期才会自动关闭
                    if (!this.isManualMode) {
                        this.detailVisible = false
                        this.resumeAlarmCycle()
                    }
                }, 10000)
            } else {
                // 无数据时，5s 后重试
                alarmTimer = setTimeout(() => this.runAlarmCycle(), 5000)
            }
        },

        // 4. 展示详情记录
        showDetail(info, mode = 'auto') {
            this.detailInfo = info
            this.detailVisible = true
            
            if (mode === 'manual') {
                this.isManualMode = true
                this.stopAlarmCycle() // 手动查看，物理停止轮巡
            } else {
                this.isManualMode = false
            }
        },

        // 手动查看详情（快捷方式）
        showDetailManual(info) {
            this.showDetail(info, 'manual')
        },

        // 5. 关闭详情弹窗
        closeDetail() {
            this.detailVisible = false
            this.isManualMode = false
            this.resumeAlarmCycle() // 尝试恢复轮巡
        },

        // 6. 开启/关闭大型弹窗
        toggleLargeDialog(type, visible) {
            if (visible) {
                this.stopAlarmCycle()
                this.detailVisible = false // 避让逻辑
            }
            
            if (type === 'stats') this.statsDialogVisible = visible
            if (type === 'grid') this.gridDialogVisible = visible

            if (!visible) {
                this.resumeAlarmCycle() // 关闭大窗后恢复
            }
        },

        // 开启大型弹窗（快捷方式）
        openLargeDialog(type) {
            this.toggleLargeDialog(type, true)
        },

        // 7. 发起全局刷新信号
        triggerRefresh() {
            this.refreshCount++
        },

        // 8. 响应处理动作（开始请求处理）
        onActionStart() {
            this.stopAlarmCycle() // 锁定，防止处理期间由于定时器关闭
        },

        // 9. 处理开关切换
        toggleAlarmActive(val) {
            this.alarmActive = val
            localStorage.setItem('datav_alarm_active', val)
            
            if (val) {
                this.runAlarmCycle()
            } else {
                this.stopAlarmCycle()
                this.detailVisible = false
            }
        },

        // 10. 视频监控设置
        toggleVideoAutoPlay(val) {
            this.videoAutoPlay = val
            localStorage.setItem('datav_video_autoplay', val)
        },

        updateVideoPageSize(val) {
            this.videoPageSize = val
            localStorage.setItem('datav_video_pagesize', val)
        }
    }
})

export default useDatavStore
