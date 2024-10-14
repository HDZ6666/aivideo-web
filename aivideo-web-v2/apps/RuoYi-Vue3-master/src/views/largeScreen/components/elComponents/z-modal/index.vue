<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-11-02 09:52:20
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-30 13:54:54
-->
<template>
    <el-dialog
        class="z-modal"
        v-model="eValue"
        v-bind="$attrs"
        @close="onClose"
        :title="props.title"
    >
        <div class="title" :title="props.title">
            <span>{{ props.title }}</span>
        </div>
        <div class="close" @click="onClose">
            <img src="@/assets/images/largeSceen/common/close.png" alt="" />
        </div>
        <slot></slot>
    </el-dialog>
</template>
<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
    visible: {
        type: Boolean,
        default: () => false,
    },
    title: {
        type: String,
        default: () => '',
    },
});

const eValue = ref(props.visible);
const emit = defineEmits(['update:visible', 'onClose']);
const onClose = () => {
    eValue.value = false;
    emit('onClose');
};
watch(
    () => eValue.value,
    (val) => {
        emit('update:visible', eValue.value);
    },
    { deep: true, immediate: true },
);

watch(
    () => props.visible,
    (val) => {
        eValue.value = val;
    },
    { deep: true, immediate: true },
);
</script>

<style scoped lang="scss"></style>

<style lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.z-modal {
    background-color: transparent;
    background-image: url(@/assets/images/largeSceen/common/popup-bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    height: 910vh * $h;
    width: 1541px;

    .el-dialog__header {
        display: none;
    }

    .el-dialog__body {
        background-color: transparent;
        padding: 0;
        height: auto;
    }

    .title {
        position: absolute;
        left: 545px;
        top: 15vh * $h;
        background-image: url(@/assets/img/modalTitle.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 384px;
        height: 70vh * $h;
        display: flex;
        align-items: center;
        // color: #fff;
        
        text-shadow: 0px 0px 2px #fff;
        font-size: 36vh * $h;
        letter-spacing: 1.5px;
        justify-content: center;

        span {
            white-space: nowrap;
            overflow: hidden;
            background-image: linear-gradient(to right, #fff 0%, #08bff7 100%);
            -webkit-background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            text-overflow: ellipsis;
            margin-left: 10px;
        }
    }

    .close {
        position: absolute;
        right: 15px;
        top: 97vh * $h;
        background-image: url(@/assets/img/closebg.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 58px;
        height: 58vh * $h;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        img {
            display: block;
            width: 58px;
            height: 58vh * $h;
        }
    }

    &.read {
        background-image: url(@/assets/img/read.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 1096vh * $h;

        .el-dialog__header {
            display: block;
        }

        .title {
            display: none;
        }

        .close {
            display: none;
        }

        .el-dialog__close {
            opacity: 0;
        }

        .el-dialog__header {
            display: flex;
            align-items: center;
            height: 80vh * $h;
            padding: 0;
            padding-left: 36px;

            .el-dialog__title {
                color: #fff;
                font-family: PingFang SC;
                font-size: 30vh * $h;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: 1.5px;
            }
        }

        .el-dialog__body {
            height: calc(100% - 80vh * $h);
            overflow: hidden;
        }
    }
}
</style>
