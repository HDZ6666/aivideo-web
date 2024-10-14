<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-11-07 14:23:22
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-14 09:50:24
-->
<template>
    <div class="enterprise-content">
        <div class="enterprise-left">
            <slot name="leftView"></slot>
        </div>
        <div class="enterprise-center">
            <slot name="centerView"></slot>
        </div>

        <div class="enterprise-right">
            <slot name="rightView"></slot>
        </div>
    </div>
</template>
<script setup>

</script>
<style lang="scss" scoped>
.enterprise-content {

    display: flex;
    box-sizing: border-box;

    .enterprise-center {
        // width: 480px;
    }

    .enterprise-left {
        // width: 672px;
    }

    .enterprise-right {
        // width: 672px;
    }

}
</style>