<template>
    <div class="detail-dialog" @click="close">
        <div class="box" @click="clickBox">
            <div style="font-size: 0.1rem;padding: 0.1rem 0.1rem;">摄像头告警详情- 【{{info.alarmTypeName}}】</div>
            <div style="text-align: center;">
                <img :src="info.alarmImg" alt="" style="width: 2.3rem;height:1.3rem;">
            </div>
            <div style="width: 100%;text-align: center;font-size: 0.09rem;padding: 0.05rem;">
                {{ info.deviceName }}
            </div>
            <div class="info-bottom">
                <div style="display: flex;border-bottom: 1px dashed #274E86;">
                    <div class="info-item">告警时间：<span>{{ info.alarmTime }}</span></div>
                    <div class="info-item">状态：<span>{{ info.status==0?'未处理':'已处理' }}</span></div>
                </div>
                <div class="info-item">告警描述：</div>
                <div style="padding:0 0.05rem 0.1rem 0.05rem;font-size: 0.09rem;">
                    {{ info.alarmDescription??'好的硒鼓好的硒鼓好的硒鼓好的硒鼓硒鼓好的硒鼓好的硒鼓好的硒鼓' }}
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import { defineComponent } from "vue"
import { getApiClient } from '@aivideo/rest';
export default defineComponent({
    props: {
        info: {
            type: Object,
            default: () => ({})
        },
    },
    computed: {
    },
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        clickBox(e) {
            e.stopPropagation()
        },
        close(e) {
            this.$emit("close", false)
        }
    }
})
</script>
<style lang="less" scoped>
.detail-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99998;
    padding: 0.1rem 0.1rem 0.1rem 0.1rem;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
        background: url(../assets/imgs/warn_detail_bg.png);
        width: 5rem;
        height: 3.19rem;
        background-size: 100% 100%;
        color: #fff;
        padding: 0.3rem 0.2rem 0.2rem 0.2rem;

        .info-bottom {
            background: #042656;
            width: 100%;
            padding: 0 0.05rem;
            .info-item {
                padding: 0.05rem 0.05rem 0.05rem 0.13rem;
                font-size: 0.08rem;
                position: relative;
                margin-right: 0.1rem;
            }
            .info-item::before {
                content: '';
                background: url(../assets/imgs/dt-before.png) no-repeat;
                background-size: 100% 100%;
                position: absolute;
                width: 0.12rem;
                height: 0.1rem;
                left: 0;
                top: 0.055rem;
            }
        }
    }
}
</style>