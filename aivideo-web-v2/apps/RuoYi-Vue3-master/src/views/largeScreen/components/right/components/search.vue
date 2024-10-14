<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-11-07 17:56:28
 * @LastEditors: lhl
 * @LastEditTime: 2023-11-10 15:13:52
-->
<template>
    <div class="search" id="select-dropDownId">
        <div class="text">企业搜索框</div>
        <div class="value">
            <input type="text" placeholder="请输入企业" v-model="eValue" @input="onInput" @click="onShowDown">
            <div class="search-icon" @click="onSearch"></div>
        </div>
        <transition name="slide">
            <div class="select" v-show="showDown" ref="dropDown">
                <div class="select-item" :class="item.key == selectKey && 'active'" v-for="item in options" :key="item.key"
                    @click="onChange(item)" v-html="getHightText(item.title)">
                </div>
            </div>
        </transition>
    </div>
</template>
<script setup >
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({})
const eValue = ref('')
const onSearch = () => {
    router.push({
        path: '/company',
        query: {
            name: eValue.value
        }
    })
}
const showDown = ref(false)
const dropDown = ref(null)
const selectKey = ref('')
const options = [
    { title: '招商银行股份有限公司', key: 1 },
    { title: '招商局集团有限公司', key: 2 },
    { title: '招商局蛇口工业区控股股份有限公司', key: 3 },
    { title: '深圳招商房地产有限公司', key: 4 },
    { title: '招商证券股份有限公司', key: 5 },
    { title: '招商局物业管理有限公司', key: 6 },
    { title: '招商基金管理有限公司', key: 7 },
    { title: '招商信诺人寿保险有限公司', key: 8 },
    { title: '招商华软信息有限公司', key: 9 },
    { title: '招商局仁和人寿保险股份有限公司', key: 10 },
]
const onInput = () => {
    if (!showDown.value) {
        showDown.value = true
    }
}

const onShowDown = () => {
    if (eValue.value) {
        showDown.value = true
    }
}

const hideDropDown = (event) => {
    const menu = document.querySelector('#select-dropDownId');
    if (!menu.contains(event.target)) {
        showDown.value = false
    }
}

const onChange = (item) => {
    eValue.value = item.title
    selectKey.value = item.key
    showDown.value = false;
    onSearch()
}

const getHightText = (text) => {
    let replaceString = '<span style="color:#FFF99B">' + eValue.value + '</span>'
    return text.replaceAll(eValue.value, replaceString) // 开始替换
}

onMounted(() => {
    document.addEventListener('click', hideDropDown);
})

</script>


<style scoped lang='scss'>
$w: 100 / 1920;
$h: 100 / 1080;
.search {
    width: 100%;
    height: 40vh * $h;
    background-image: url(@/assets/img/home/search.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    position: relative;

    .text {
        width: 136px;
        color: #FFF;
        font-family: PingFang SC;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 1px;
        padding-left: 11px;
    }

    .value {
        height: 100%;
        padding-left: 11px;
        flex: 1;
        position: relative;

        input {
            width: calc(100% - 80px);
            height: 100%;
            color: #fff;
        }

        .search-icon {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 50px;
            cursor: pointer;
        }
    }

    .select {
        position: absolute;
        top: 40vh * $h;
        left: 0;
        width: 100%;
        max-height: 387vh * $h;
        background: #062D6D;
        z-index: 99;
        padding-bottom: 10vh * $h;
        overflow-y: auto;
        overflow-x: hidden;
        transition: all .2s;

        &::-webkit-scrollbar {

            width: 2px;
            // height: 320px;
            background: #fff;

        }

        &::-webkit-scrollbar-thumb {
            width: 2px;
            height: 10vh * $h;

            background-color: #43E6FF;
        }

        .select-item {
            display: flex;
            width: 100%;
            align-items: center;
            padding-left: 21px;
            color: #fff;
            font-family: PingFang SC;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            height: 38vh * $h;
            cursor: pointer;
            white-space: nowrap;
            /* 不换行 */
            overflow: hidden;
            /* 隐藏超出的部分 */
            text-overflow: ellipsis;

            /* 当文本超出容器宽度时显示省略号 */
            &:hover {
                background-color: rgba(0, 0, 1, 0.3);
            }

            &.active {
                background-color: rgba(0, 0, 1, 0.3);

            }
        }
    }
}


.slide-enter-active,
.slide-leave-active {
    opacity: 0;
    transform: translateY(40vh * $h);
}

.slide-enter,
.slide-leave-to {
    opacity: 0;
}
</style>