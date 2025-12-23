<template>
    <div class="header">
        <div class="icon-time"></div>
        <div class="datetime">
            <div class="date">{{ dateStr }}</div>
            <div class="time">{{ timeStr }}</div>
            <div class="week">{{ weekStr }}</div>
        </div>

        <div class="header-center">
            <span class="title">{{ title }}</span>
        </div>

        <div class="header-right">
            <div class="action-item">
                <span>{{ alarmActive ? '开启' : '关闭' }}告警</span>
                <el-switch v-model="alarmActiveModel" class="alarm-switch" />
            </div>
            <div class="action-item map-btn" @click="$emit('map-screen')">
                <span>地图大屏</span>
            </div>
            <div class="action-item back-btn" @click="$emit('goto-dashboard')">
                <img src="@/assets/datav/v1/back.png" alt="" />
                <span>后台管理</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getDateTimeInfo } from '@/utils'

// Props
const props = defineProps({
    title: {
        type: String,
        default: '监控驾驶舱'
    },
    alarmActive: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['update:alarmActive', 'map-screen', 'goto-dashboard'])

// 双向绑定告警开关
const alarmActiveModel = computed({
    get: () => props.alarmActive,
    set: (val) => emit('update:alarmActive', val)
})

// 日期时间状态
const dateStr = ref('')
const timeStr = ref('')
const weekStr = ref('')
let timer = null

// 更新日期时间
const updateDateTime = () => {
    const info = getDateTimeInfo()
    dateStr.value = info.dateStr
    timeStr.value = info.timeStr
    weekStr.value = info.weekStr
}

onMounted(() => {
    updateDateTime()
    timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
    }
})
</script>

<style lang="scss" scoped>
.header {
    position: absolute;
    width: 1920px;
    z-index: 10;
    height: 119px;
    background: url("@/assets/datav/v1/head_bg.png") no-repeat center top;
    background-size: 1920px 119px;
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    box-sizing: border-box;
}

.icon-time {
    position: absolute;
    top: 14px;
    left: 19px;
    width: 29px;
    height: 29px;
    background: url("@/assets/datav/v1/time.png") no-repeat;
    background-size: 100% 100%;
}

.datetime {
    position: absolute;
    top: 0;
    left: 10px;
    font-size: 15px;
    line-height: 59px;
    color: #fff;
    display: flex;

    .time {
        font-size: 17px;
        width: 111px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
    }

    .date {
        font-size: 17px;
        width: 170px;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
    }

    .week {
        width: 111px;
        overflow: hidden;
        white-space: nowrap;
    }
}

.header-center {
    height: 37px;
    margin: 15px auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    background: #fff;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: ysbthFont;
    font-size: 38px;
    box-sizing: border-box;

    .title {
        font-size: inherit;
        font-weight: 400;
    }
}

.header-right {
    position: absolute;
    top: 11px;
    right: 0;
    display: flex;
    width: 504px;

    .action-item {
        display: flex;
        font-size: 17px;
        margin-right: 19px;
        color: #fff;
        align-items: center;
        cursor: pointer;
        padding: 3.8px 9.6px;

        &:hover {
            background-color: #ffffff1a;
            transform: translateY(-1px);
        }

        img {
            margin-right: 6px;
            width: 19px;
            height: 19px;
        }

        &.btn:hover {
            color: #7dd3fc;
        }
    }

    .alarm-switch {
        margin-left: 10px;
        --el-switch-on-color: #00d4ff;
        --el-switch-off-color: #4a5568;
    }

    .back-btn {
        margin-left: auto;
    }
}
</style>
