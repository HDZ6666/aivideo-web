<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-11-22 15:45:50
 * @LastEditors: ZCR
 * @LastEditTime: 2023-11-22 17:17:19
-->
<template>
    <div class="Search-Module">
        <slot />
    </div>
</template>
<script setup>
import {} from 'vue';
const props = defineProps({});
</script>

<style scoped lang="scss">
.Search-Module {
    background-color: #ffffff;
    padding: 16px 0 18px 24px;
    margin-bottom: 16px;
    padding-bottom: 0;
}
</style>
