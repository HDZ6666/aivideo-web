<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-05 12:00:53
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-30 14:28:43
-->
<template>
    <div class="right-content">
        <Line class="line"></Line>
    </div>
</template>
<script setup>
import {} from 'vue';
import Line from "../echarts/line.vue"
const props = defineProps({});
</script>

<style scoped lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.right-content {
    //background: red;
    height: 962vh * $h;
    margin: 0px 24px;
    width: 672px;
    .line{
        width: 100%;
        height: 236vh * $h;
    }
}
</style>
