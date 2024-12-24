<template>
  <div :class="{ 'box': true, 'fullscreen-box': fullscreen }" :style="boxDynameicStyle">
    <div class="title" :style="titleDynameicStyle">
      <div class="title-box">
        <div class="icon" :style="iconDynameicStyle"></div>
        <div class="text">{{ title }}</div>
        <div class="text-en"></div>
      </div>
      <div class="more">
        <slot name="more"></slot>
        <div class="more-item">
          自动轮播<t-switch v-model="checked" @change="onChange" style="margin-left: 0.05rem;" />
        </div>
        <div class="more-item">
          画布展示
          <div class="select">
            <t-select size="small" v-model="pageSize" @change="changePageSize">
              <t-option key="4" label="四宫格" value="4" />
              <t-option key="9" label="九宫格" value="9"></t-option>
              <t-option key="12" label="十二宫格" value="12" />
              <!-- <t-option key="16" label="十六宫格" value="16" /> -->
            </t-select>
          </div>
        </div>
        <div class="more-item fullscreen" @click="changeFullscreen">全屏<span :style="fullScreenDynameicStyle" class="fullscreen-icon"></span></div>
      </div>
    </div>
    <div class="bg">
      <div class="body"></div>
      <div class="footer">
      </div>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>

</template>
<script>
import { defineComponent } from "vue"
import { mapGetters } from "vuex";
import { getImageUrl } from '@/utils/imageUrl.js'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: 0
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
      checked: true,
      pageSize: '4',
      fullscreen: false,
      boxDynameicStyle:{
              
      },
      titleDynameicStyle:{
        
      },
      iconDynameicStyle:{
        
      },
      fullScreenDynameicStyle:{
        
      }
    }
  },
  setup() {
  },
  activated() {

  },
  methods: {
    onChange() {
      console.log(this.checked)
    },
    changePageSize() {
      this.$emit("changePageSize", this.pageSize)
    },
    changeFullscreen() {
      console.log("innnn")
      this.fullscreen = !this.fullscreen
      this.$emit("changeFullscreen", this.fullscreen)
    },
    handleMbData(item){
      if(item.cardBoxBase64){
        const cardBoxBase64 = getImageUrl(item.cardBoxBase64)
        this.boxDynameicStyle = {
          background: `url(${cardBoxBase64}) no-repeat center`,
          backgroundSize:"100% 100%"
        }
      }
      if(item.cameraTitleBase64){
        const cameraTitleBase64 = getImageUrl(item.cameraTitleBase64)
        this.titleDynameicStyle = {
          background: `url(${cameraTitleBase64}) no-repeat center`,
          backgroundSize:"100% 100%"
        }
      }
      if(item.boxIcon){
        const boxIcon = getImageUrl(item.boxIcon)
        this.iconDynameicStyle = {
          background: `url(${boxIcon}) no-repeat center`,
          backgroundSize:"100% 100%",
          width:"0.12rem",
          height:"0.16rem",
          top:"0.05rem",
          left:"0.05rem"
        }
      }
      if(item.fullScreenUrl){
        const fullScreenUrl = getImageUrl(item.fullScreenUrl)
        this.fullScreenDynameicStyle = {
          background: `url(${fullScreenUrl}) no-repeat center`,
          backgroundSize:"100% 100%"
        }
      }
    }
  }
})
</script>
<style lang="less" scoped>
.fullscreen-box {
  height: calc(100% - 0.3rem) !important;
}

.box {
  position: relative;
  width: 100%;
  height: calc(100% - 1rem);
  background: url("../assets/imgs/card_box_bg.png") no-repeat center;
  background-size: 100% 100%;

  .title {
    //color: #fff;
    color: var(--text-title-color);
    width: 100%;
    height: 0.255rem;
    background: url("../assets/imgs/camera_box_bg.png") no-repeat center;
    background-size: 100% 100%;
    text-align: center;
    font-weight: bold;
    line-height: 0.240rem;
    font-size: 0.1rem;
    text-align: left;
    padding-left: 0.21rem;
    padding-right: 0.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title-box {
      display: flex;
      align-items: center;
    }

    .text {
      //color: #FFF;
      color: var(--text-title-color);
      text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
      font-family: YouSheBiaoTiHei;
      font-size: 0.11rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      width: 1rem;
    }

    .icon {
      //content: '';
      position: absolute;
      width: 0.18rem;
      height: 0.23rem;
      top: 0.05rem;
      left: 0.05rem;
      background: url(../assets/imgs/box_title_icon.png) no-repeat;
    }

    .text-en {
      color: #215A8E;
      font-family: YouSheBiaoTiHei;
      font-size: 0.08rem;
      font-style: normal;
      font-weight: 400;
      text-transform: uppercase;
    }

    .more {
      display: flex;
      align-items: center;
      font-size: 0.09rem;
      font-weight: normal;

      .fullscreen {
        cursor: pointer;
      }

      .more-item {
        display: flex;
        align-items: center;
        margin-left: 0.1rem;

        .fullscreen-icon {
          display: inline-block;
          width: 0.12rem;
          height: 0.12rem;
          background: url(../assets/imgs/fullscreen.png) no-repeat;
          margin-left: 0.05rem;
          background-size: 100% 100%;
        }

        .select {
          margin-left: 0.1rem;

          .t-select__wrap {
            width: 0.6rem;
          }

          :deep(.t-input) {
            height: 0.2rem;
            //background: #0071bc;
            // border: var(--td-bg-color-specialcomponent);
            border: 1px solid var(--td-brand-color);
            background: transparent;
          }

          :deep(input) {
            font-size: 0.08rem;
            //color: #fff;
            color: var(--input-color-normal);
            text-align: center;
          }

          :deep(path) {
            color: #fff;
          }

          :deep(.t-input--focused) {
            box-shadow: none;
          }
        }
      }
    }
  }

  .content {
    position: absolute;
    top: 0.260rem;
    bottom: 0.05rem;
    left: 0.05rem;
    right: 0.05rem;
    overflow: hidden;
  }
}
</style>