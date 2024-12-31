<template>
  <div class="container">
    <div class="container-cover" :style="coverDynameicStyle">
      <div class="header" :style="headDynamicStyle" id="header">
        <div class="title"><span>{{title}}</span></div>
        <div class="icon-time" :style="iconDynameStyle" ></div>
        <div class="times">
          <div class="date">{{date}}</div>
          <div class="time">{{time}}</div>
          <div class="week">{{week}}</div>
        </div>
        <div class="buttons">
          <div class="new-item">
            <span @click="toggleFullScreen">{{currentProps.alarmActived?'开启':'关闭'}}告警</span>
            <t-switch v-model="currentProps.alarmActived" style="margin-left: 0.05rem;" />
          </div>
          <!-- <div class="new-item">
            <span @click="toggleFullScreen">全屏</span>
          </div> -->
          <div style="width: 0.6rem;"></div>
          <div class="new-item" @click="gotoDashboard()">
            <!-- <img src="@/assets/imgs/manager.png" @click="gotoDashboard()"/> -->
            <img src="../assets/imgs/back.png" alt="">后台管理
          </div>
          <!-- <div class="item">
            <img src="@/assets/imgs/loginout.png"/>
          </div> -->
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
import { getApiClient } from '@aivideo/rest';
import { insertThemeStylesheet,generateColorMap ,colorList,imageList} from "@/utils/color.js"
import { Color } from 'tvision-color';
import { getImageUrl } from "@/utils/imageUrl.js"
export default defineComponent({
  components: {
    loading
  },
  data(){
    return {
      date:"",
      time:"",
      week:"",
      title:"监控驾驶舱",
      currentProps: {
        alarmActived: false
      },
      headDynamicStyle:{
        
      },
      coverDynameicStyle:{
        
      },
      iconDynameStyle:{

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
      window.top.location.href="/#/aiView";
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
    getmbList(){
      const apiClient = getApiClient();
      apiClient.GET('/modelSettings/list?page=1&count=15').then((res)=>{
        console.log(res,"res")
        if(res.data.code==0){
          const list = res.data.data.list;
          
          let flag = true // 是否启动了模板
          list&&list.map((item)=>{
            // 状态为0表示启动
            if(item.status==0&&flag&&item.themeColor!=="#0052d9"){
              flag = false
              // import(imageList[item.themeColor].backgroundBase64).then((res)=>{
              //   debugger
              // })
              if(item.title){
                this.title = item.title
              }
              if(imageList[item.themeColor].header){
                const backgroundImage = getImageUrl(imageList[item.themeColor].header);
                
                this.headDynamicStyle = {
                    background: `url(${backgroundImage}) no-repeat center`,
                    backgroundSize:"100% 100%"
                }
              }
              if(imageList[item.themeColor].pageBack){
                const backgroundContentBase64 = getImageUrl(imageList[item.themeColor].pageBack);
                this.coverDynameicStyle = {
                  background: `url(${backgroundContentBase64}) no-repeat center`,
                  backgroundSize:"100% 100%"
                }
              }
              if(imageList[item.themeColor].time){
                const timeUrl = getImageUrl(imageList[item.themeColor].time);
                this.iconDynameStyle = {
                  background: `url(${timeUrl}) no-repeat center`,
                  backgroundSize:"100% 100%"
                }
              }
              
              // if(item.backgroundBase64){
                
              //   console.log(this.headDynamicStyle,"headDynamicStyle")
              // }
              console.log(this.headDynamicStyle,"headDynamicStyle")
              // if(item.backgroundContentBase64){
              //   this.coverDynameicStyle = {
              //     background: `url(${item.backgroundContentBase64}) no-repeat center`,
              //     backgroundSize:"100% 100%"
              //   }
              // }
              debugger
              const color = item.themeColor||'#0052d9'; // #0052d9默认风格
              this.changeBrandTheme(color)
              this.$store.dispatch('mbData',{themeColor:color,...imageList[color]})
            }
          })
          if(flag){
            const color = '#0052d9'; // #0052d9默认风格
            this.changeBrandTheme(color)
          }
        }
        
      }).catch(()=>{
        const color = '#0052d9'; // #0052d9默认风格
            this.changeBrandTheme(color)
      })
    },
    changeBrandTheme(brandTheme) {
      
      //const mode = this.displayMode;
      const mode = "light" // 默认是高亮模式
      
      
      // 以主题色加显示模式作为键
      const colorKey = `${brandTheme}[${mode}]`;
      let colorMap = colorList[colorKey];
      debugger
      // let colorMap = {
      // "--td-brand-color": "#0052d9",
      // "--td-brand-color-1": "#f2f3ff",
      // "--td-brand-color-2": "#d9e1ff",
      // "--td-brand-color-3": "#b5c7ff",
      // "--td-brand-color-4": "#8eabff",
      // "--td-brand-color-5": "#618dff",
      // "--td-brand-color-6": "#366ef4",
      // "--td-brand-color-7": "#366ef4",
      // "--td-brand-color-8": "#0052d9",
      // "--td-brand-color-9": "#003cab",
      // "--td-brand-color-10": "#001a57",
      // }
      // 如果不存在色阶，就需要计算
      // if (colorMap === undefined) {
      //   const [{ colors: newPalette, primary: brandColorIndex }] = Color.getColorGradations({
      //     colors: [brandTheme],
      //     step: 10,
      //     remainInput: false, // 是否保留输入 不保留会矫正不合适的主题色
      //   });
      //   colorMap = generateColorMap(brandTheme, newPalette, mode, brandColorIndex);
      //   this.colorList[colorKey] = colorMap;
      // }
      // TODO 需要解决不停切换时有反复插入 style 的问题
      insertThemeStylesheet(brandTheme, colorMap, mode); 
      document.documentElement.setAttribute('theme-color', brandTheme);
    },
  },
  mounted(){
      this.getmbList();
      
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
      // width: 3.382rem;
      height: 0.193rem;
      // background-size: 100% 100%;  
      margin: 0.08rem auto; 
      color: var(--text-title-center-color,#fff);
      background: var(--text-title-center-color);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-family: ysbthFont;
      font-size: 0.2rem;
      span{
        
      }
    }
    .times{
      position: absolute;
      top: 0rem;
      left: 0.05rem;
      font-size: 0.08rem;
      line-height: 0.309rem;
      //color: #fff;
      color: var(--text-title-color);
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
        width: 0.8rem;
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
    .icon-time{
      position: absolute;
      top: 0.075rem;
      left: 0.1rem;
      background: url(../assets/imgs/time.png) no-repeat;
      background-size: 100% 100%;
      width: 0.15rem;
      height: 0.15rem;
    }
    .times::before {
      // content: '';
      // position: absolute;
      // top: 0.075rem;
      // left: 0.1rem;
      
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
        //color: #fff;
        color: var(--text-title-color);
        align-items: center;
        img {
          margin-right: 0.03rem;
          width: 0.1rem;
          height: 0.1rem;
        }
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