<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-12-28 09:47:22
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-28 10:28:03
-->
<template>
    <div class="content">
        <div class="title">客户服务指挥中心客服工作监督工作月报</div>
        <div class="time">(2022年4月1日至2022年4月30日)</div>
        <div class="text2">
            <div class="text2-item1">
                <div>华北地区生产管理单位</div>
                <div>客户服务指挥中心（客户服务部）</div>
            </div>
            <div class="text2-item2">2022年5月12日</div>
        </div>

        <div class="text">
            <div class="text1-title">一、客户服务概况</div>
            <div class="text1-title-item1">（一）客户服务工单量</div>
            <div class="text1-title-ctx">
                2021年4月份,华北地区承接客户服务工单共11164，其中非订单类工单5156件，同比下降12.60%，环比下降7.63%；订单工单6008件，同比下降1.57%，环比上升22.74%。各类工单情况如表
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({});
</script>

<style scoped lang="scss">
.content {
    padding: 15px 10px;
    .title {
        font-size: 24px;
        font-weight: bold;
        width: 240px;
        text-align: center;
        height: auto;
        margin: auto;
        margin-bottom: 20px;
    }
    .time {
        text-align: center;
        margin-bottom: 20px;
    }
    .text2 {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        // align-items: center;
        .text2-item1 {
            font-size: 18px;
        }
        .text2-item2 {
            // width: 150px;
            display: flex;

            align-self: flex-end;
        }
    }
    .text {
        .text1-title {
            text-indent: 10px;
        }
        .text1-title-item1 {
        }
        .text1-title-ctx {
            font-size: 18px;
        }
    }
}
</style>
