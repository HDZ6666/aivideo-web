<template>
  <div class="box" :style="{height:height+'px'}">
    <div class="title">
      <div class="text">{{title}}</div>
    </div>
    <div class="bg">
      <div class="body"></div>
      <div class="footer"></div>
    </div>
    <div class="content">
      <slot name="content"></slot>
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
        }
    },
    computed:{
    },
    setup() {
        
    },
    activated(){
      
    }
})
</script>
<style lang="less" scoped>
.box{
  position: relative;
  width: 1.388rem;
  .title{
    color: #fff;
    width: 100%;
    height: 0.255rem;
    background: url("../assets/imgs/box_header_bg.png") no-repeat center;
    background-size: 100% 100%;
    text-align: center;
    font-weight: bold;
    line-height: 0.240rem;
    font-size: 0.1rem;
    text-align: left;
    padding-left: 0.3rem;
    .text{
      background-image: -webkit-linear-gradient(top,#fff,#e6fdfa,#a2d2fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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

