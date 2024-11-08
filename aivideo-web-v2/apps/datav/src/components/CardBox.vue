<template>
    <div class="box" :style="{height:height+'px'}">
      <div class="title">
        <div class="text">{{title}}</div>
        <div class="text-en"></div>
        <a class="text-more" @click="clickMore">
            <div>{{more}}</div>
        </a>
      </div>
      <div class="bg">
        <div class="body"></div>
        <div class="footer"></div>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  
  </template>
  <script>
  import { defineComponent } from "vue"
  export default defineComponent({
      props: {
          title: {
            type: String,
            default: ""
          },
          height:{
            type:Number,
            default:0
          },
          more: {
            type: String,
            default: '详情'
          },
          moreLink: {
            type: String,
            default: "javascript:;"
          }
      },
    data() {
        return {
          show: false
        }
    },
      computed:{
      },
      setup() {
          
      },
      activated() {
        
      },
      methods: {
        clickMore() {
          this.$emit('more', true)
        }
      }
  })
  </script>
  <style lang="less" scoped>
  .box{
    position: relative;
    width: 2.588rem;
    background: url("../assets/imgs/card_box_bg.png") no-repeat center;
    background-size: 100% 100%;
    .title{
      color: #fff;
      width: 100%;
      height: 0.235rem;
      background: url("../assets/imgs/card_title_bg.png") no-repeat center;
      background-size: 100% 100%;
      text-align: center;
      font-weight: bold;
      line-height: 0.220rem;
      font-size: 0.1rem;
      text-align: left;
      padding-left: 0.21rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .text {
        color: #FFF;
        text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
        font-family: YouSheBiaoTiHei;
        font-size: 0.11rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      .text::before {
        content: '';
        position: absolute;
        width: 0.11rem;
        height: 0.14rem;
        top: 0.05rem;
        left: 0.05rem;
        background: url(../assets/imgs/box_title_icon.png) no-repeat;
        background-size: 100% 100%;
      }
      .text-en {
        color: #215A8E;
        font-family: YouSheBiaoTiHei;
        font-size: 0.08rem;
        font-style: normal;
        font-weight: 400;
        text-transform: uppercase;
      }
      .text-more {
        color: #7CBFFF;
        font-family: "PingFang SC";
        font-size: 0.09rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-decoration: none;
        padding-right: 0.05rem;
      }
    }
    .content{
      position: absolute;
      top: 0.260rem;
      bottom: 0.05rem;
      left:0.05rem;
      right: 0.05rem;
      overflow: hidden;
    }
  }
  </style>
  
  