<template>
    <div class="pager">
        <div class="rt">
            <div class="button" @click="handlePage(-1)">上一屏</div>
            <div class="pageNum">{{ pageIndex }} / {{ totalPage }}</div>
            <div class="button" @click="handlePage(1)">下一屏</div>
        </div>
    </div>
</template>

<script setup>
// Props
const props = defineProps({
    pageIndex: {
        type: Number,
        default: 1
    },
    totalPage: {
        type: Number,
        default: 1
    }
})

// Emits
const emit = defineEmits(['page-change'])

// 分页切换
const handlePage = (direction) => {
    emit('page-change', direction)
}
</script>

<style lang="scss" scoped>
.pager {
    width: 100%;
    padding: 10px 19px;
    display: flex;
    color: #a0aec0;
    font-size: 15px;

    .rt {
        flex: 1;
        justify-content: right;
        display: flex;
        align-items: center;
    }

    .button {
        width: 96px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        background: rgba(0, 100, 200, 0.5);
        border: 1px solid rgba(0, 150, 255, 0.5);
        border-radius: 4px;
        margin-left: 8px;
        cursor: pointer;
        color: #fff;

        &:hover {
            background: rgba(0, 150, 255, 0.5);
        }
    }

    .pageNum {
        line-height: 38px;
        font-size: 15px;
        padding: 0 6px 0 12px;
    }
}
</style>
