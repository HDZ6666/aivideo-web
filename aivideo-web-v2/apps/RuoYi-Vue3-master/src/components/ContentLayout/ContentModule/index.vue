<!--
 * @Description: 
 * @Autor: ZCR
 * @Date: 2023-11-22 15:47:45
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-22 09:20:31
-->
<template>
    <div class="content-module">
        <div class="content-tool">
            <div class="content-title">
                <slot name="title">
                    {{ route?.meta?.title }}
                </slot>
            </div>
            <div class="content-operation">
                <slot name="operation"></slot>
            </div>
        </div>
        <div class="content-table">
            <slot />
        </div>
    </div>
</template>
<script setup>
import {} from 'vue';

const props = defineProps({});

const route = useRoute();
</script>

<style scoped lang="scss">
.content-module {
    padding: 21px 24px 40px 24px;
    background-color: #fff;
    .content-tool {
        display: flex;
        justify-content: space-between;
        margin-bottom: 21px;
        .content-title {
            color: #020e19;
            font-family: Source Han Sans CN;
            font-size: 20px;
            font-weight: 500;
        }
        .content-operation {
            display: flex;
            align-items: center;
        }
    }
}
</style>
