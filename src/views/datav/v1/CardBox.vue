<template>
    <div class="box" :style="[{height:height+'px'},boxDynameicStyle]">
      <div class="title" :style="titleDynameicStyle">
        <div class="icon" :style="iconDynameicStyle"></div>
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
  import { defineComponent ,ref,} from "vue"
  import { mapGetters } from "vuex";
  import { getImageUrl } from '@/utils/imageUrl.js'
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
          },
      },
      computed:{
        ...mapGetters([ "mbData"]),
      },
      watch:{
        mbData(newVal){
          this.handleMbData(newVal)
        }
      },
      data() {
          return {
            show: false,
            boxDynameicStyle:{
              
            },
            titleDynameicStyle:{
              
            },
            iconDynameicStyle:{

            }
          }
      },
      setup(props) {
         
      },
      activated() {
        
      },
      methods: {
        clickMore() {
          this.$emit('more', true)
        },
        handleMbData(item){
          if(item.cardBoxBase64){
            const cardBoxBase64 = getImageUrl(item.cardBoxBase64)
            this.boxDynameicStyle = {
              background: `url(${cardBoxBase64}) no-repeat center`,
              backgroundSize:"100% 100%"
            }
          }
          if(item.cardTitleBase64){
            const cardTitleBase64 = getImageUrl(item.cardTitleBase64)
            this.titleDynameicStyle = {
              background: `url(${cardTitleBase64}) no-repeat center`,
              backgroundSize:"100% 100%"
            }
          }
          if(item.boxIcon){
            const boxIcon = getImageUrl(item.boxIcon)
            this.iconDynameicStyle = {
              background: `url(${boxIcon}) no-repeat center`,
              backgroundSize:"100% 100%"
            }
          }
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
        //color: #FFF;
        color: var(--text-title-color);
        text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
        font-family: YouSheBiaoTiHei;
        font-size: 0.11rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      .icon {
        //content: '';
        position: absolute;
        width: 0.11rem;
        height: 0.14rem;
        top: 0.05rem;
        left: 0.05rem;
        background: url(../assets/imgs/box_title_icon.png) no-repeat;
        background-size: 100% 100%;
      }
      .text-en {
        //color: #215A8E;
        color: var(--text-en-color);
        font-family: YouSheBiaoTiHei;
        font-size: 0.08rem;
        font-style: normal;
        font-weight: 400;
        text-transform: uppercase;
      }
      .text-more {
        //color: #7CBFFF;
        color: var(--text-more-color);
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
  
  