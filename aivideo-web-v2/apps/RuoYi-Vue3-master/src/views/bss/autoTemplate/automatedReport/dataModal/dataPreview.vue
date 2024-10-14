<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-13 17:17:00
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-14 09:14:54
-->
<template>
    <div class="dataPreview borderStyle">
        <div class="title">数据项</div>
        <div class="input">
            <el-input></el-input>
        </div>

        <div class="preview">
            <div class="title">数据项</div>
        </div>
    </div>
</template>
<script setup>
import {} from 'vue';
const props = defineProps({});
import listTable from '@/components/listTable';
</script>

<style scoped lang="scss">
.dataPreview {
    padding: 20px 10px 0 17px;
    min-height: 600px;
    .input {
        margin-top: 8px;
    }
    .preview {
        margin-top: 45px;
    }
    .title {
        color: #020e19;
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px; /* 85.714% */
    }
}
.borderStyle {
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}
</style>
