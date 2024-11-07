<template>
  <div class="container">
    <div class="container-cover">
      <div class="header">
        <div class="title"></div>
        <div class="times">
          <div class="date">{{date}}</div>
          <div class="time">{{time}}</div>
          <div class="week">{{week}}</div>
        </div>
        <div class="buttons">
          <div class="new-item">
            <span @click="toggleFullScreen" style="color:#fff;">关闭告警</span>
            <t-switch v-model="currentProps.alarmActived" style="margin-left: 0.05rem;" />
          </div>
          <div class="new-item">
            <span @click="toggleFullScreen" style="color:#fff;">全屏</span>
          </div>
          <div style="width: 0.6rem;"></div>
          <div class="item">
            <img src="@/assets/imgs/manager.png" @click="gotoDashboard()"/>
          </div>
          <div class="item">
            <img src="@/assets/imgs/loginout.png"/>
          </div>
        </div>
      </div> 
      <div id="main" class="main">
        <loading v-show="$store.getters.isLoading()"></loading>
        <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" v-bind="currentProps" />
            </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script>
import loading from '@/components/basic/RouterLoading.vue';
import $ from 'jquery';
import { defineComponent } from 'vue';
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    loading
  },
  data(){
    return {
      date:"",
      time:"",
      week:"",
      currentProps: {
        alarmActived: false
      }
    }
  },
  setup() {
    const router = useRouter();
    return {router};
  },
  computed:{
  },
  methods:{
    gotoDashboard(){
      window.top.location.href="/";
    },
    link(url,event){
      $(event.target).parent().parent().find(".item").removeClass("active");
      $(event.target).addClass("active");
      this.router.push({ path:  url});
    },
    getDate(){
      var date = new Date(); 
      var year = date.getFullYear(); 
      var month = date.getMonth() + 1;
      var day = date.getDate();
      this.date = year+"年"+month+"月"+day;

      var week=date.getDay();
      if(week==0){
        this.week="星期天";
      }
      else if(week==1){
        this.week="星期一";
      }
      else if(week==2){
        this.week="星期二";
      }
      else if(week==3){
        this.week="星期三";
      }
      else if(week==4){
        this.week="星期四";
      }
      else if(week==5){
        this.week="星期五";
      }
      else if(week==6){
        this.week="星期六";
      }

      var hour = date.getHours(); 
      if(hour<10){
        hour="0"+hour.toString();
      }
      var minute=date.getMinutes(); 
      if(minute<10){
        minute="0"+minute.toString();
      }
      var second=date.getSeconds(); 
      if(second<10){
        second="0"+second.toString();
      }
      this.time=hour+":"+minute+":"+second;
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        this.enterFullScreen();
      } else {
        this.exitFullScreen();
      }
    },
    enterFullScreen() {
      let element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { /* Firefox */
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE/Edge */
        element.msRequestFullscreen();
      }
    },
    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    },
  },
  mounted(){
      setInterval(()=>{ this.getDate()},1000);
  }
})
</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: url("../assets/imgs/home-bg.png") no-repeat center;
    background-size: 100% 100%;
  }
  .container-cover {
    width: 100%;
    height: 100%;
    background: radial-gradient(48.84% 50.6% at 50% 48.19%, rgba(0, 144, 225, 0.35) 0%, rgba(5, 118, 223, 0.03) 100%), #000;
  }
  .header {
    position: absolute;
    width: 100%;
    z-index: 1;
    height: 0.62rem;
    background: url("../assets/imgs/head_bg.png") no-repeat center;
    background-size: 100% 100%;
    .title{
      width: 3.382rem;
      height: 0.193rem;
      background-size: 100% 100%;  
      margin: 0.08rem auto; 
    }
    .times{
      position: absolute;
      top: 0rem;
      left: 0rem;
      font-size: 0.08rem;
      line-height: 0.209rem;
      color: #39d6fe;
      display: flex;
      .time{
        font-size: 0.09rem;
        width: 0.58rem;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
      }
      .date{
        font-size: 0.09rem;
        width: 0.78rem;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
      }
      .week{
        width: 0.58rem;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .buttons{
      position: absolute;
      top:0.08rem;
      right: 0;
      display: flex;
      .item{
        width: 0.5rem;
        img{
          width: 100%;
        }
      }
      .new-item {
        display: flex;
        font-size: 0.09rem;
        margin-right: 0.1rem;
      }
    }
  }
  .main {
    position: absolute;
    left: 0rem;
    right: 0rem;
    bottom: 0rem;
    top: 0.64rem;
  }
</style>