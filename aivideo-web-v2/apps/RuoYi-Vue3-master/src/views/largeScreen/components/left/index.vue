<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-05 11:59:05
 * @LastEditors: lhl
 * @LastEditTime: 2023-12-04 14:25:56
-->
<template>
    <div class="left-content">
        <!-- <div class="item a-view"><aView /></div> -->
         <container></container>
    </div>
</template>
<script setup>
import {} from 'vue';
import container from '../container.vue';
const props = defineProps({});
</script>

<style scoped lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.left-content {
    //background: red;
    height: 962vh * $h;
    margin: 0px 24px;
    width: 672px;
}
</style>
