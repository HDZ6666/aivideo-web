<template>
    <div class="configuration">
        <div class="title">报告配置</div>
        <div class="dataSource">
            <div class="data"> 数据库内容</div>
            <el-button type="primary" @click="open = true"
                >数据库绑定</el-button
            >
        </div>
    </div>
</template>
<script setup>
const props = defineProps({});
const open = ref(false);
</script>

<style scoped lang="scss">
.configuration {
    .title {
        color: #000;
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 26px; /* 162.5% */
        letter-spacing: 1px;
    }
    .dataSource {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        .data {
            color: #979797;
            font-family: PingFang SC;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 26px; /* 185.714% */
            letter-spacing: 1px;
        }
    }
}
</style>
