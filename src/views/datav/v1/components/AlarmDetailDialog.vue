<template>
    <div class="detail-dialog" @click="close">
        <div class="box" @click.stop>
            <div class="detail-title">摄像头告警详情- 【{{ info.alarmTypeName }}】</div>
            <div class="detail-image">
                <el-image :src="info.alarmImg" :preview-src-list="[info.alarmImg]" fit="contain"
                    style="width: 384px; height: 211.2px;" alt="告警图片">
                    <template #error>
                        <div class="image-slot">
                            <span class="no-img">暂无图片</span>
                        </div>
                    </template>
                </el-image>
            </div>
            <div class="detail-device">
                {{ info.deviceName }}
            </div>
            <div class="info-bottom">
                <div class="info-row">
                    <div class="info-item">告警时间：<span>{{ info.alarmTime }}</span></div>
                    <div class="info-item">状态：<span>{{ info.status == 0 ? '未处理' : '已处理' }}</span></div>
                </div>
                <div class="info-item">告警描述：</div>
                <div class="info-desc">
                    {{ info.alarmDescription || '' }}
                </div>
            </div>
            <div v-if="info.status == 0" class="info-action">
                <div class="desc">
                    <span>处理说明：</span>
                    <el-input v-model="desc" type="textarea" placeholder="请输入处理说明" :rows="2" resize="none" />
                </div>
                <div class="button" @click="alarmHandle(1)">
                    处理
                </div>
                <div class="button" @click="alarmHandle(2)">
                    误报
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'

const props = defineProps({
    info: {
        type: Object,
        default: () => ({})
    }
})

const emit = defineEmits(['close', 'handle'])

const desc = ref('')

const close = () => {
    emit('close')
}

const alarmHandle = (status) => {
    // 模拟 API 调用
    // const apiClient = getApiClient();
    // const apiUrl = `/ai/api/alarm/handle?status=${status}&alarmId=${props.info.id}&alarmDescription=${desc.value}`
    // apiClient.GET(apiUrl).then(...)

    // 暂时直接成功
    // ElMessage.success("操作成功")
    emit("handle", true)
    close()
}
</script>

<style lang="scss" scoped>
.detail-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    padding: 19.2px; // 0.1rem
    background-color: rgba(0, 0, 0, 0.7); //var(--detail-dialog-bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
}

.box {
    background: url("@/assets/datav/v1/warn_detail_bg.png") no-repeat center, #061A40;
    width: 960px; // 5rem
    height: 631.7px; // 3.29rem
    background-size: 100% 100%;
    color: #fff; // var(--detail-dialog-box)
    padding: 57.6px 38.4px 38.4px 38.4px; // 0.3rem 0.2rem 0.2rem 0.2rem
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.detail-title {
    font-size: 19.2px; // 0.1rem
    padding: 19.2px; // 0.1rem
    width: 100%;
}

.detail-image {
    text-align: center;

    .no-img {
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
        line-height: 211.2px;
    }

    :deep(.el-image) {
        cursor: pointer;

        img {
            transition: transform 0.3s;

            &:hover {
                transform: scale(1.02);
            }
        }
    }
}

.detail-device {
    width: 100%;
    text-align: center;
    font-size: 17.3px; // 0.09rem
    padding: 9.6px; // 0.05rem
}

.info-bottom {
    background: #042656;
    width: 100%;
    padding: 0 9.6px; // 0 0.05rem

    .info-row {
        display: flex;
        border-bottom: 1px dashed rgba(0, 212, 255, 0.3); // var(--dashed-color)
    }

    .info-item {
        padding: 9.6px 9.6px 9.6px 25px; // 0.05rem ... 0.13rem
        font-size: 15.4px; // 0.08rem
        position: relative;
        margin-right: 19.2px; // 0.1rem

        &::before {
            content: '';
            background: url("@/assets/datav/v1/dt-before.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            width: 23px; // 0.12rem
            height: 19.2px; // 0.1rem (approx)
            left: 0;
            top: 10.6px; // 0.055rem
        }
    }

    .info-desc {
        padding: 0 9.6px 19.2px 9.6px; // 0 0.05rem 0.1rem
        font-size: 17.3px; // 0.09rem
    }
}

.info-action {
    display: flex;
    justify-content: flex-end; // right -> flex-end
    align-items: center;
    padding: 19.2px; // 0.1rem
    width: 100%;
    margin-top: auto; // push to bottom

    .desc {
        width: 576px; // 3rem
        font-size: 17.3px; // 0.09rem
        display: flex;
        align-items: center;

        span {
            width: 115.2px; // 0.6rem
            white-space: nowrap;
        }

        :deep(.el-textarea__inner) {
            border: 1px solid rgba(0, 113, 188, 0.5);
            color: #fff;
            padding: 5px 10px;
        }
    }

    .button {
        width: 96px; // 0.5rem
        height: 38.4px; // 0.2rem
        line-height: 38.4px;
        text-align: center;
        background: #0071bc;
        margin-left: 19.2px; // 0.1rem
        cursor: pointer;
        border-radius: 6px;
        font-size: 15px;

        &:hover {
            background: #0091ff;
        }
    }
}
</style>
