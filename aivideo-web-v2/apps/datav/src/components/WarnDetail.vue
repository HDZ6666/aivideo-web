<template>
    <div class="detail-dialog" @click="close">
        <div class="box" @click="clickBox">
            <div style="font-size: 0.1rem;padding: 0.1rem 0.1rem;">摄像头告警详情- 【{{info.alarmTypeName}}】</div>
            <div style="text-align: center;">
                <img :src="info.alarmImg" alt="" style="width: 2rem;height:1.1rem;">
            </div>
            <div style="width: 100%;text-align: center;font-size: 0.09rem;padding: 0.05rem;">
                {{ info.deviceName }}
            </div>
            <div class="info-bottom">
                <div style="display: flex;border-bottom: 1px dashed var(--dashed-color);">
                    <div class="info-item">告警时间：<span>{{ info.alarmTime }}</span></div>
                    <div class="info-item">状态：<span>{{ info.status==0?'未处理':'已处理' }}</span></div>
                </div>
                <div class="info-item">告警描述：</div>
                <div style="padding:0 0.05rem 0.1rem 0.05rem;font-size: 0.09rem;">
                    {{ info.alarmDescription?info.alarmDescription:'' }}
                </div>
            </div>
            <div v-if="info.status==0" class="info-action">
                <div class="desc">
                    <span>处理说明：</span><t-textarea v-model="desc" placeholder="请输入处理说明" />
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
            desc: ''
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
        },
        alarmHandle(status) {
            const apiClient = getApiClient();
            const apiUrl = `/ai/api/alarm/handle?status=${status}&alarmId=${this.info.id}&alarmDescription=${this.desc}`
            apiClient.GET(apiUrl).then(r => {
                console.log("alarmHandle func", r)
                if (r.data && r.data.code == "0") {
                    this.$message.success("操作成功");
                    this.close();
                    this.$emit("handle", true)
                }
                else if (r.error) {
                    this.$message.error(r.error.msg)
                }
            })
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
    background-color: var(--detail-dialog-bg-color);
    display: flex;
    justify-content: center; 
    align-items: center;
    .box {
        background: url(../assets/imgs/warn_detail_bg.png), #061A40;;
        width: 5rem;
        height: 3.29rem;
        background-size: 100% 100%;
        // color: #fff;
        color: var(--detail-dialog-box);
        padding: 0.3rem 0.2rem 0.2rem 0.2rem;

        .info-bottom {
            //background: #042656;
            background: var(--info-bottom-color);
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

        .info-action {
            display: flex;
            justify-content: right;
            padding: 0.1rem;
            .desc {
                width: 3rem;
                height: 0.2rem;
                line-height: 0.2rem;
                font-size: 0.09rem;
                display: flex;
                span {
                    width: 0.6rem;
                }
            }
            .button {
                margin-top: 0.15rem;
                width: 0.5rem;
                height: 0.2rem;
                line-height: 0.2rem;
                text-align: center;
                background: url("../assets/imgs/pager_button_bg.png") no-repeat center;
                background-size: 100% 100%;
                margin-left: 0.1rem;
                cursor: pointer;
            }
        }
        
    }
}
</style>