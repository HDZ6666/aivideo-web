<template>
    <div class="warn-dialog">
        <div class="close" @click="close"></div>
        <div class="box">
            <div class="content">
                <table class="warn-table">
                    <tbody>
                        <tr style="background: #062B5A;">
                            <th>告警类型</th>
                            <th>设备名称</th>
                            <th>告警时间</th>
                            <th>处理状态</th>
                            <th>告警缩略图</th>
                        </tr>
                        <tr v-for="(row, index) in warnList" :key="index" @click="clickDetail(row)">
                            <td>{{ row.alarmTypeName }}</td>
                            <td>{{ row.modelname }}</td>
                            <td>{{ row.alarmTime }}</td>
                            <td>{{ row.status==0?'未处理':'已处理' }}</td>
                            <td><img style="width:0.2rem;" :src="row.alarmImg" alt=""></td>
                        </tr>
                    </tbody>
                </table>
                <div class="pager">
                    <div class="rt">
                    <div class="button" @click="onPage(-1)">上一屏</div>
                    <div class="pageNum">{{ pager.pageIndex }} / {{ pager.totalPage }}</div>
                    <div class="button" @click="onPage(1)">下一屏</div>
                    </div>
                </div>
            </div>
        </div>
        <warn-detail v-if="detailShow" :info="detail" @close="detailShow=false"></warn-detail>
    </div>

</template>
<script>
import { defineComponent } from "vue"
import { getApiClient } from '@aivideo/rest';
import WarnDetail from '../components/WarnDetail.vue';
export default defineComponent({
  components: {
    WarnDetail
  },
    computed: {
    },
    data() {
        return {
            warnList: [],
            detailShow: false,
            detail: {},
            pager: {
                pageIndex: 1,
                pageSize: 6,
                totalPage: 1
            },
        }
    },
    setup() {
    },
    activated() {

    },
    mounted() {
        this.getAlarmList()
    },
    methods: {
        ///api/alarm/v2/stat/findAlarmInfoPage
        getAlarmList() {
            const apiClient = getApiClient();
            apiClient.GET(`/api/alarm/v2/stat/findAlarmInfoPage?page=${this.pager.pageIndex}&size=${this.pager.pageSize}`).then(r => {
                if (r.data.code == "0") {
                    this.warnList = r.data.data.records;
                    this.pager.totalPage = r.data.data.pages;
                }
            })
        },
        clickDetail(data) {
            this.detail = data
            this.detailShow = true
        },
        close() {
            this.$emit("close", false)
        },
        onPage(val) {
        if (val > 0) {
            if (this.pager.pageIndex + 1 > this.pager.totalPage) {
            this.$message.error("没有下一页了");
            }
            else {
            this.pager.pageIndex++;
            this.getAlarmList();
            }
        }
        else {
            if (this.pager.pageIndex - 1 < 1) {
            this.$message.error("没有上一页了");
            }
            else {
            this.pager.pageIndex--;
            this.getAlarmList();
            }
        }
        },
    }
})
</script>
<style lang="less" scoped>
.warn-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 89998;
    padding: 0.1rem 0.1rem 0.1rem 0.1rem;
    background-color: rgba(0, 0, 0, 0.7);

    .close {
        position: fixed;
        top: 0.1rem;
        right: 0.1rem;
        width: 0.6rem;
        height: 0.2rem;
        z-index: 89999;
    }

    .box {
        position: relative;
        width: 100%;
        height: 100%;
        background: #061A40 url("../assets/imgs/warn_bg.png") no-repeat center;
        background-size: 100% 100%;
        color: #fff;
        padding-top: 0.2rem;
        .content {
            // background: #061A40;
            padding: 0.08rem 0.08rem 0.08rem 0.08rem;
            width: 100%;
            height: 100%;
            .warn-table {
                width: 100%;
                height: 89%;
                font-size: 0.1rem;
                tr {
                    height: 14.3%;
                    border-top: 1px solid #062B5A;
                    text-align: center;
                }
            }
            .pager {
                width: 100%;
                padding: 0.05rem 0.1rem;
                display: flex;
                color: #fff;
                font-size: 0.08rem;
                margin-bottom: 0.1rem;

                .lf {
                    display: flex;
                    flex: 1;
                    text-align: left;
                    line-height: 0.2rem;
                }

                .rt {
                    flex: 1;
                    justify-content: right;
                    display: flex;
                }

                .button {
                    width: 0.5rem;
                    height: 0.2rem;
                    line-height: 0.2rem;
                    text-align: center;
                    background: url("../assets/imgs/pager_button_bg.png") no-repeat center;
                    background-size: 100% 100%;
                    margin-left: 0.04rem;
                    cursor: pointer;
                }

                .button.active {
                    background: url("../assets/imgs/pager_button_bg2.png") no-repeat center;
                    background-size: 100% 100%;
                }

                .select {
                    margin-left: 0.1rem;

                    .t-select__wrap {
                    width: 0.6rem;
                    }

                    :deep(.t-input) {
                    height: 0.2rem;
                    background: #0071bc;
                    border: #0071bc;
                    }

                    :deep(input) {
                    font-size: 0.08rem;
                    color: #fff;
                    text-align: center;
                    }

                    :deep(path) {
                    color: #fff;
                    }

                    :deep(.t-input--focused) {
                    box-shadow: none;
                    }
                }

                .pageNum {
                    line-height: 0.2rem;
                    font-size: 0.08rem;
                    padding: 0 0.03rem 0 0.06rem;
                }
            }
        }
    }
}
</style>