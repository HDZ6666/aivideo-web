<template>
    <div class="nav">
        <div class="item" v-for="item in items" :key="item.name">
            <div class="icon"><img :src="item.icon" /></div>
            <div class="text">
                <div class="value">
                    <span class="number" :class="{ 'warn-color': item.isWarn }">{{ item.value }}</span>
                    <span class="unit">个</span>
                </div>
                <div class="name">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
    items: {
        type: Array,
        default: () => []
    }
})
</script>

<style lang="scss" scoped>
.nav {
    width: 991px;
    margin: 31px auto;
    display: flex;

    .item {
        width: 269px;
        height: 81px;
        display: flex;

        .icon {
            width: 61px;
            line-height: 100px;
            text-align: center;

            img {
                width: 100%;
            }
        }

        .text {
            flex: 1;
            padding: 0 10px;
            font-size: 16px;

            .value {
                margin-top: -8px;

                .number {
                    font-size: 27px;
                    padding-right: 5px;
                    color: #f2f6fa;
                    font-family: DINPro, sans-serif;
                    font-weight: 700;
                }

                .number.warn-color {
                    color: #ff6b6b;
                }

                .unit {
                    color: #a0aec0;
                    font-size: 15px;
                }
            }

            .name {
                color: #a0aec0;
                font-size: 17px;
            }
        }
    }

    .item:not(:first-child) {
        margin-left: 19px;
    }
}
</style>
