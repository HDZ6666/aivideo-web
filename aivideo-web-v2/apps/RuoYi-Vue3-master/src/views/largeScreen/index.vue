<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-05 12:00:54
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-01 14:25:22
-->
<template>
    <div class="page-box">
        <Header></Header>
        <layout>
            <template #leftView>
                <leftView />
            </template>
            <template #centerView>
                <centerView />
            </template>
            <template #rightView>
                <rightView />
            </template>
        </layout>
    </div>
</template>
<script setup >
import leftView from './components/left/index'
import centerView from './components/center/index.vue'
import rightView from './components/right/index.vue'
import layout from "./components/layout/index.vue"
import Header from "./components/header/index.vue"
const props = defineProps({})
</script>


<style scoped lang='scss'>
.page-box{
    background-image: linear-gradient(to bottom, #060c21 0%, #001a40 100%);
    height: 100vh;
}
</style>