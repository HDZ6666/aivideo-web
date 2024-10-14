<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-05 14:05:28
 * @LastEditors: Hewei
 * @LastEditTime: 2023-12-22 09:42:26
-->
<template>
    <div class="header">
        <div class="header-time head-item">
            <img src="@/assets/images/largeSceen/layout/time.png" alt="">
            <span>{{newTime}}</span>
            
        </div>
        <div class="header-title">
            <span>智慧楼宇平台仪表盘</span>
            <img class="light-img" src="@/assets/images/largeSceen/layout/light.png" alt="">
        </div>
        <div class="header-weather head-item">
            <img src="@/assets/images/largeSceen/layout/weather.png" alt="">
            <span>
                {{weathcer}}
            </span>
            
        </div>
    </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { ref, watch ,onMounted} from 'vue';
const props = defineProps({
    isShowBack: {
        type: Boolean,
        default: () => false,
    },
});
const newTime = ref(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));
const weathcer = ref('多云 32℃')
</script>

<style scoped lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.header {
    background-size: 100% 100%;
    width: 100%;
    height: 74vh * $h;
    position: relative;
    padding: 0px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    margin-bottom: 22vh * $h;
    // background: red;
    font-size: 20px;
    background-image: url('@/assets/images/largeSceen/layout/header.png');
    background-repeat:no-repeat ;
    background-size: 100% 100%;
    position: relative;
    .head-item{
        display: flex;
        align-items: center;
        img{
            margin-right: 10px;
            width: 24px;
            height: 24px;
        }
    }
    .header-title{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 30px;
        font-weight: 700;
        span{
            position: relative;
            z-index: 1;
            top: -5vh * $h;
        }
        .light-img{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -22%);
        }
    }
}

</style>
