<template>
    <div class="box box2">
        <div class="box-header">
            <span class="box-title">摄像头告警</span>
            <span class="box-more" @click="openWarnGrid">详情</span>
        </div>
        <div class="box-content">
            <div class="camera-warn">
                <div class="camera-item" v-for="(item, index) in warnList" :key="index" @click="handleItemClick(item)">
                    <img :src="item.alarmImg" alt="" />
                    <div class="camera-addr">【{{ item.alarmTypeName }}】{{ item.deviceName }}</div>
                </div>
            </div>
        </div>
        <CameraWarnGridDialog ref="dialogRef" v-if="warnGridVisible" @close="warnGridVisible = false"
            @show-detail="(data) => $emit('show-detail', data)" />
    </div>
</template>

<script setup>
// Props
defineProps({
    warnList: {
        type: Array,
        default: () => []
    }
})

// Emits
const emit = defineEmits(['item-click', 'show-detail'])

import { ref } from 'vue'
import CameraWarnGridDialog from './CameraWarnGridDialog.vue'

const warnGridVisible = ref(false)
const dialogRef = ref(null)

// 暴露刷新内部列表的方法
defineExpose({
    refreshList: () => dialogRef.value?.refreshList()
})

// 点击详情
const openWarnGrid = () => {
    console.log("点击详情，打开弹窗");
    warnGridVisible.value = true
}

// 点击告警项
const handleItemClick = (item) => {
    emit('show-detail', item)
}
</script>

<style lang="scss" scoped>
.box {
    position: relative;
    background: url("@/assets/datav/v1/card_box_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
}

.box2 {
    flex: 1;
}

.box-header {
    position: relative;
    width: 100%;
    height: 45px;
    background: url("@/assets/datav/v1/card_title_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    box-sizing: border-box;

    &::before {
        content: '';
        position: absolute;
        width: 21px;
        height: 27px;
        top: 10px;
        left: 10px;
        background: url("@/assets/datav/v1/box_title_icon.png") no-repeat;
        background-size: 100% 100%;
    }
}

.box-title {
    color: #fff;
    text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
    font-family: ysbthFont;
    font-size: 21px;
    font-weight: 400;
}

.box-more {
    color: #7cbfff;
    font-family: "PingFang SC";
    font-size: 17px;
    font-weight: 400;
    padding-right: 10px;
    cursor: pointer;

    &:hover {
        color: #fff;
    }
}

.box-content {
    position: absolute;
    top: 50px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    overflow: hidden;
}

.camera-warn {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;

    .camera-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;

        img {
            width: 100%;
            height: 80%;
            object-fit: cover;
        }

        .camera-addr {
            width: 100%;
            height: 20%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 14px;
            padding: 0 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
