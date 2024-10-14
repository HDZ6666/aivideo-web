<template>
    <div class="text-element">
        <div class="title">文本元件</div>
        <div class="options">
            <div v-for="item in textElement">
                <img src="" alt="" />
                {{ item.title }}
            </div>
        </div>

        <div class="title">图表库</div>
    </div>
</template>
<script setup>
const props = defineProps({});
const textElement = [
    { title: '华北地区工单总数' },
    { title: '华北地区非订单类工单数' },
    { title: '华北地区非订单类工单数同比下降率' },
    { title: '华北地区非订单类工单数环比下降率' },
];
</script>

<style scoped lang="scss">
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
</style>
