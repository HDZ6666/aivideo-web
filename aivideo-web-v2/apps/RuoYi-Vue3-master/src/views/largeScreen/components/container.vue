<!--
 * @Description: 
 * @Autor: CIRAO
 * @Date: 2023-10-11 14:16:45
 * @LastEditors: lhl
 * @LastEditTime: 2023-12-04 14:22:13
-->
<template>
    <div class="container">
        <div class="container-title" v-if="isShowTitle">
            <img :src="imgUrl" class="title-img" alt="">
            <span class="container-title-text">{{title}}</span>
        </div>
        <div class="containeringlot">
            <div class="containeringlot-left">
                <img src="" alt="">
                <span class="">
                    
                </span>
            </div>
            <div class="containeringlot-right">
                
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import Frame from '@/assets/images/largeSceen/home/Frame.png'
const { isShowTitle ,imgUrl,title} = defineProps(
    {
        isShowTitle: {
            type: Boolean,
            default: true
        },
        imgUrl:{
            type: String,
            default: ()=>Frame
        },
        title:{
            type: String,
            default: '智慧停车系统'
        }
    })
</script>

<style scoped lang="scss">
$w: 100 / 1920;
$h: 100 / 1080;
.container{
    width: 100%;
    height: 100%;
    .container-title{
        width: 450px;
        height: 33vh * $h;
        background-image: url('@/assets/images/largeSceen/home/container-title.png');
        background-size: 100%;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        padding-left: 25px;
        margin-bottom: 16vh * $h;
        .title-img{
            width: 24px;
            height: 24vh * $h;
        }
        .container-title-text{
            color: #fff;
            font-size: 24px;
            font-weight: 700;
        }
    }
    .containeringlot{
        background-image: url('@/assets/images/largeSceen/home/bg_car.png');
        width: 672px;
        height: 290vh;
        background-repeat: no-repeat;
        background-size: 100%;
    }
}
</style>
