<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-11 11:04:49
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-14 09:27:46
-->
<template>
    <div class="work">
        <div class="content">
            <el-row :gutter="20">
                <el-col :span="8">
                    <dataPreview />
                </el-col>
                <el-col :span="16">
                    <dataSelection />
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { addAutoTemplate, updateAutoTemplate } from '@/api/bss/autoTemplate';
import { ElMessage } from 'element-plus';
import dataPreview from './dataPreview.vue';
import dataSelection from './dataSelection.vue';
const props = defineProps({
    currentFrom: {
        type: Object,
        default: () => {},
    },
});
const form = ref({ ...props.currentFrom });

const emit = defineEmits(['reset']);

watch(
    () => props.currentFrom,
    (val) => {
        form.value = val;
    },
    { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.work {
    .tool {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
            color: #1f2126;
            font-family: PingFang SC;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 26px; /* 162.5% */
            letter-spacing: 1px;
        }
    }
    .content {
        min-height: 500px;
        .content-text {
        }
        .text-element {
            border-radius: 4px;
            background: #fff;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
            .title {
                color: #000;
                font-family: PingFang SC;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: 26px; /* 162.5% */
                letter-spacing: 1px;
            }
            .options {
                color: #494949;
                font-family: PingFang SC;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 30px; /* 214.286% */
                height: 250px;
                div {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    color: #494949;
                    font-size: 14px;
                    img {
                        width: 40px;
                        height: 40px;
                        flex-shrink: 0;
                        margin-right: 13px;
                    }
                }
            }
        }
        .report-configuration {
            .title {
                color: #000;
                font-family: PingFang SC;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: 26px; /* 162.5% */
                letter-spacing: 1px;
            }
        }

        .borderStyle {
            border-radius: 4px;
            background: #fff;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        }
    }

    .pad {
        padding: 11px 30px 0 16px;
    }
}
.dialog-footer {
    display: flex;
    justify-content: right;
}
</style>
