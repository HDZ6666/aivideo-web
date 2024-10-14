<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-11-21 11:32:25
 * @LastEditors: ZCR
 * @LastEditTime: 2024-01-08 09:22:29
-->
<template></template>
<script setup>
import {} from 'vue';
const props = defineProps({});
const emailList = ref([]);
const emailValue = ref('');
const errKey = ref();
</script>

<style scoped lang="scss">
.a1 {
    width: 600px;
    height: 600px;
    background-color: blue;
    .a2 {
        width: 400px;
        height: 400px;
        background-color: red;

        .a3 {
            width: 200px;
            height: 200px;
            background-color: blueviolet;
        }
    }
}
</style>
