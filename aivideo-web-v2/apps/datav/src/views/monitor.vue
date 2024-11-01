<template>
<div id="monitor">
  <div class="left">
    <vol-box title="设备列表" :height="leftBox1Height" class="box">
      <template #content>
        <div class="box_content">
          <div class="device_list">
            <div class="select">
              <div class="text">当前选择：{{ deviceSelected }}</div>
            </div>
            <div class="line"></div>
            <div class="list">
              <div class="rows">
                <t-tree ref="tree" value-mode="all" :data="bind.deviceTree" :activable="true" @active="changeDeviceTree" @expand="deviceTreeExpand" />
              </div>
            </div>
          </div>

        </div>
      </template>
    </vol-box>
  </div>
  <div class="right">
    <vol-box title="告警概览" :height="rightBox1Height" class="box">
      <template #content>
        <div class="box_content">
          <div class="warn_list">
            <div class="header">
              <div class="time">时间</div>
              <div class="name">事件</div>
              <div class="status">状态</div>
            </div>
            <div class="body">
              <vue3-seamless-scroll :list="bind.warnList" :step="0.35" :hover="true">
                    <div class="item" v-for="(row,index) in bind.warnList" :key="index" @click="viewWarnInfo(row)">
                      <div class="time">{{row.time}}</div>
                      <div class="name">{{row.name}}</div>
                      <div class="status">{{row.status}}</div>
                    </div>
              </vue3-seamless-scroll>
            </div>
          </div>
        </div>
      </template>
    </vol-box>
    <vol-box title="告警趋势" :height="rightBox2Height" class="box">
      <template #content>
        <div class="box_content">
          <div id="chartGJQS" class="chart"></div>
        </div>
      </template>
    </vol-box>
  </div>
  <div class="center">
    <div class="nav">
      <div class="item">
        <div class="icon"><img src="@/assets/imgs/nav_icon.png"/></div>
        <div class="text">
          <div class="value">
            <span class="number">{{bind.info.device.total}}</span>个
          </div>
          <div class="name">国际设备</div>
        </div>
      </div>
      <div class="item">
        <div class="icon"><img src="@/assets/imgs/nav_icon.png"/></div>
        <div class="text">
          <div class="value">
            <span class="number">{{bind.info.channel.total}}</span>个
          </div>
          <div class="name">通道总数量</div>
        </div>
      </div>
      <div class="item">
        <div class="icon"><img src="@/assets/imgs/nav_icon.png"/></div>
        <div class="text">
          <div class="value">
            <span class="number">{{bind.info.channel.online}}</span>个
          </div>
          <div class="name">在线通道数量</div>
        </div>
      </div>
      <div class="item">
        <div class="icon"><img src="@/assets/imgs/nav_icon.png"/></div>
        <div class="text">
          <div class="value">
            <span class="number">{{bind.info.proxy.total}}</span>个
          </div>
          <div class="name">非国标设备数</div>
        </div>
      </div>
    </div>
    <div class="pager">
      <div class="lf">
        <div class="button" @click="toggleFullScreen()">全屏</div>
        <div class="button" @click="autoPage($event)">自动轮播</div>
      </div>
      <div class="rt">
        <div class="button" @click="onPage(-1)">上一页</div>
        <div class="pageNum">{{ pager.pageIndex }} / {{ pager.totalPage }}</div>
        <div class="button" @click="onPage(1)">下一页</div>
        <div class="select">
          <t-select v-model="pageSize" @change="changePageSize">
            <t-option key="4" label="四分屏" value="4" />
            <t-option key="9" label="九分屏" value="9"></t-option>
            <t-option key="16" label="十六分屏" value="16" />
          </t-select>
        </div>
      </div>
    </div>
    <div class="videos">
      <div class="row">
        <div :class="{col:true,col2:pager.pageSize==4,col3:pager.pageSize==9,col4:pager.pageSize==16}" v-for="(row,index) in bind.cameraRows" :key="index">
          <vol-player :url="row.streamInfo.hls.url" :autoplay="true" @click="selectVideo($event)"></vol-player>
        </div>
      </div>
    </div>
  </div>

  <t-dialog v-model:visible="warnDialog.show" width="5rem" class="warnDialog">
    <div class="content">
      <img src="@/assets/imgs/close.png" class="close" @click="warnDialog.show=false">
      <div class="title">{{warnDialog.data.alarmTypeName}}</div>
      <div class="body">
        <div class="lf">
          <div class="img">
            <img error="@/assets/imgs/alarm_pic.png" :src="warnDialog.data.alarmImg"/>
          </div>
        </div>
        <div class="rt">
          <div>告警时间：{{ warnDialog.data.alarmTime }}</div>
          <div>分组名称：{{ warnDialog.data.alarmCategory }}</div>
          <div>设备名称：{{ warnDialog.data.deviceName }}</div>
          <div>告警ID：{{ warnDialog.data.alarmId }}</div>
          <div>置信度：{{ warnDialog.data.alarmPriority }}</div>
          <div>处理情况：  <t-tag theme="warning" v-if="warnDialog.data.status==0">未处理</t-tag><t-tag theme="success" v-else>已处理</t-tag></div>
          <div>通知人员：</div>
          <div class="buttons">

          </div>
        </div>
      </div>
    </div>
  </t-dialog>
  <!--查看视频弹出框-->
  <t-dialog width="5rem" class="videoDialog" :header="videoDialog.title" v-model:visible="videoDialog.show" @closed="videoDialogClosed">
    <div class="content">
      <vol-player ref="videoPlayer" :url="videoDialog.url" :poster="videoDialog.poster"></vol-player>
    </div>   
  </t-dialog>
</div>
</template>
<script>
import $ from 'jquery';
import SwiperCore, { Autoplay, Pagination, Scrollbar } from 'swiper';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';

import { defineComponent } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import VolBox from "./box.vue";
import VolPlayer from "./livePlayer.vue";

import { gjqsChartCreate, gjqsDestroy, gjqsOption, gjqsReload, gjqsResize } from './monitor/chartGJQS.js';
SwiperCore.use([Scrollbar, Pagination, Autoplay])

import { getApiClient } from '@aivideo/rest';
export default defineComponent({
  components:{
    Swiper,
    SwiperSlide,
    Vue3SeamlessScroll,
    'vol-box':VolBox,
    'vol-player':VolPlayer
  },
  data(){
    return{
      leftBox1Height:0,
      rightBox1Height:0,
      rightBox2Height:0,
      deviceSelected:'全部设备',
      pageSize:'9',
      chart:{
      },
      pager:{
        pageIndex:1,
        pageSize:9,
        totalPage:20
      },
      warnDialog:{
        show:false,
        data:{}
      },
      videoDialog:{
        show:false,
        title:'',
        url:'',
        poster:''
      },
      bind:{
        info:{
          channel:{
            online:0,
            total:0
          },
          device:{
            online:0,
            total:0
          },
          proxy:{
            online:0,
            total:0
          },
          push:{
            online:0,
            total:0
          }
        },
        warnList:[
          // {id:'1',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'2',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'3',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'4',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'5',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'6',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'7',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'8',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'9',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'},
          // {id:'10',time:'2024-10-14 10:50:33',name:'电子围栏',status:'未处理'}
        ],
        deviceData:[],
        deviceTree:[
          // {id:'1',label:'全部设备',value:'全部设备',children:[{id:'1_2',label:'全部设备1',value:'全部设备1'}]},
          // {id:'2',label:'数字大屏',value:'数字大屏'},
          // {id:'3',label:'高新区',value:'高新区'},
          // {id:'4',label:'三水区',value:'三水区'},
          // {id:'5',label:'禅城区',value:'禅城区'},
          // {id:'6',label:'南海区',value:'南海区'},
          // {id:'7',label:'顺德区',value:'顺德区'}
        ],
        cameraList:[],
        cameraRows:[]
      }
    }
  },
  computed:{
  },
  setup() {
  },
  watch:{
  },
  methods:{
    toggleFullScreen(){
      window.top?.dispatchEvent(new CustomEvent("toggleFullScreen"))
    },
    initBoxHeight(){
      var totalHeight = parseInt($(document).height()-this.$fontSize*0.5);
      var height = parseInt(totalHeight/3);
      var maxHeight = parseInt(this.$fontSize*1.52);
      if(height>maxHeight){
        height=maxHeight;
      }
      this.leftBox1Height=totalHeight;
      this.rightBox2Height=height;
      this.rightBox1Height=totalHeight-this.rightBox2Height-this.$fontSize*0.1;
    },
    changePageSize(){
      this.pager.pageSize=parseInt(this.pageSize);
      this.pager.pageIndex=1;
      this.pager.totalPage=Math.ceil(this.bind.cameraList.length/this.pager.pageSize);
      this.getCameraPage();
    },
    autoPage(event){
      if($(event.currentTarget).hasClass("active")){
        $(event.currentTarget).removeClass("active")
      }
      else{
        $(event.currentTarget).addClass("active")
      }
    },
    onPage(val){
      if(val>0){
        if(this.pager.pageIndex+1>this.pager.totalPage){
          this.$message.error("没有下一页了");
        }
        else{
          this.pager.pageIndex++;
          this.getCameraPage();
        }
      }
      else{
        if(this.pager.pageIndex-1<1){
          this.$message.error("没有上一页了");
        }
        else{
          this.pager.pageIndex--;
          this.getCameraPage();
        }
      }
    },
    selectVideo(event){
      $(event.currentTarget).parent().parent().parent().find(".player").removeClass("active")
      $(event.currentTarget).addClass("active")
    },
    viewWarnInfo(row){
        this.warnDialog.show=true;
        this.warnDialog.data=row.data;
        console.log(row);
    },
    changeDeviceTree(values,context){
      this.deviceSelected=context.node.data.label;
      if(context.node.data.url!=undefined && context.node.data.url!=null){
        this.videoDialog.show=true;
        this.$nextTick(()=>{
          this.videoDialog.title=context.node.data.label;
          this.videoDialog.url=context.node.data.url;
        });
      }
    },
    deviceTreeExpand(value,context){
      if(context.node.data.children===true){
        this.getDeviceChilrenList(context.node);
      }
    },
    videoDialogClosed(){
      this.$refs['videoPlayer'].onHide();
    },
    getCameraList(){
      this.bind.deviceTree=[];
      const apiClient = getApiClient();
      apiClient.GET("/api/cockpit/proxy/list?page=1&pageSize=1000").then(r => {
        if(r.data.code=="0"){
          this.bind.cameraList=r.data.data.list;
          this.pager.pageIndex=1;
          this.pager.totalPage=Math.ceil(this.bind.cameraList.length/this.pager.pageSize);
          this.getCameraPage();
          let tree=[{id:0,label:'全部设备',value:'0',children:[]}];
          for(let i=0;i<this.bind.cameraList.length;i++){
            tree[0].children.push({
              id:this.bind.cameraList[i].id,
              label:this.bind.cameraList[i].name,
              value:this.bind.cameraList[i].id.toString(),
              url:this.bind.cameraList[i].streamInfo.hls.url
            });
          }
          this.bind.deviceTree=tree;
          this.getDeviceGroupList();
        }
      })
    },
    getCameraPage(){
      let rows=[];
      this.bind.cameraRows=[];
      for(let i=0;i<this.bind.cameraList.length;i++){
        if((i>=this.pager.pageIndex-1)*this.pager.pageSize && i<this.pager.pageIndex*this.pager.pageSize){
          rows.push(this.bind.cameraList[i]);
        }
      }
      this.bind.cameraRows=rows;
    },
    getDeviceGroupList(){
      const apiClient = getApiClient();
      apiClient.GET("/ai/api/device/group/cameraGroupList?parentId=0").then(r => {
        if(r.data.code=="0"){
          let tree=JSON.parse(JSON.stringify(this.bind.deviceTree));
          this.bind.deviceData=r.data.data;
          for(let i=0;i<r.data.data.length;i++){
            tree.push({
              id:r.data.data[i].id,
              label:r.data.data[i].group_name,
              value:r.data.data[i].id.toString(),
              children:this.getDeviceChilren(r.data.data[i].children)
            });
          }
          this.bind.deviceTree=tree;
        }
      })
    },
    getDeviceChilren(data){
      if(data.length==0){
        // return [{
        //     id:'',
        //     label:'',
        //     value:''
        //   }];
        return true;
      }
      else{
        let tree=[];
        for(let i=0;i<data.length;i++){
          tree.push({
            id:data[i].id,
            label:data[i].group_name,
            value:data[i].id.toString(),
            children:this.getDeviceChilren(data[i].children)
          });
        }
        return tree;
      }
    },
    getDeviceChilrenList(node){
      const apiClient = getApiClient();
      apiClient.GET("/ai/api/device/queryManager/list?page=1&pageSize=9999&categoryId="+node.value).then(r => {
        if(r.data.code=="0"){
          let children=[];
          for(let i=0;i<r.data.data.list.length;i++){
            children.push({
              id:r.data.data.list[i].id,
              label:r.data.data.list[i].name,
              value:r.data.data.list[i].id.toString(),
              url:r.data.data.list[i].streamInfo.hls.url
            });
          }
          // let nodes=node.getChildren();
          // for(let i=0;i<nodes.length;i++){
          //   nodes[i].remove();
          // }
          this.$refs.tree.appendTo(node.value, children);
        }
      })
    },
    getInfo(){
      const apiClient = getApiClient();
      apiClient.GET("/api/cockpit/proxy/resource/info").then(r => {
        if(r.data.code=="0"){
          this.bind.info=r.data.data;
        }
      })
    },
    getAlarmList(){
      const apiClient = getApiClient();
      apiClient.GET("/api/alarm/v2/events/").then(r => {
        if(r.data.code=="0"){
          this.bind.warnList=[];
          let rows=[];
          for(let i=0;i<r.data.data.records.length;i++){
            rows.push({
              id:r.data.data.records[i].id,
              time:r.data.data.records[i].alarmTime.substr(0,18),
              name:r.data.data.records[i].alarmTypeName,
              status:r.data.data.records[i].status==0?'未处理':'已处理',
              data:r.data.data.records[i]
            });
          }
          this.bind.warnList=rows;
        }
      })
    },
    getAlarmTrend(){
      const apiClient = getApiClient();
      apiClient.GET("/api/alarm/v2/stat/statAlarmCountByTime?startTime=2024-10-01&endTime=2024-10-29").then(r => {
        if(r.data.code=="0"){
          let xAxiData=[];
          let serieData=[];
          for(let i=0;i<r.data.data.length;i++){
            xAxiData.push(r.data.data[i].alarmDate.substr(5,5));
            serieData.push(r.data.data[i].alarmCount);
          }
          gjqsOption.xAxis[0].data=xAxiData;
          gjqsOption.series[0].data=serieData;
          gjqsReload();
        }
      })
    }
  },
  created(){
    this.initBoxHeight();
    window.addEventListener("resize", this.initBoxHeight);
  },
  mounted(){
    this.getInfo();
    this.getCameraList();
    this.getAlarmList();
    this.getAlarmTrend();
    gjqsChartCreate(this.$echart,'chartGJQS');
  },
  unmounted(){
    gjqsDestroy();
    window.removeEventListener("resize", this.initBoxHeight);      
  },
  activated(){
    gjqsResize();
  },
  deactivated(){
  }
})
</script>
<style lang="less" scoped>
#monitor{
  position: absolute;
  z-index: 1;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: all;
  .left{
    position: absolute;
    width: 2.188rem;
    top:-0.3rem;
    left: 0.1rem;
    bottom:0.1rem;
    .box{
      margin-top:0.1rem;
    }
  }
  .right{
    position: absolute;
    width: 2.188rem;
    top:-0.3rem;
    right: 0.1rem;
    bottom:0.1rem;
    .box{
      margin-top:0.1rem;
    }
  }
  .center{
    position: absolute;
    left: 2.388rem;
    right: 2.388rem;
    top:0;
    bottom:0.1rem;
    .nav{
      width:5.159rem;
      margin: 0.15rem auto;
      display: flex;
      .item{
        width:1.4rem;
        height: 0.422rem;
        display: flex;
        .icon{
          width: 0.38rem;
          line-height: 0.522rem;
          text-align: center;
        }
        .icon img{
          width:100%;
        }
        .text{
          flex: 1;
          color: #39d6fe;
          padding: 0.09rem 0.05rem;
          font-size: 0.085rem;
          .value{
            margin-top:-0.04rem;
            .number{
              color:#00ff90;
              font-size: 0.16rem;
              font-family: "electronicFont";
              padding-right: 0.025rem;
            }
          }
        }
      }
      .item:not(firts-children){
        margin-left: 0.1rem;
      }
    }
    .pager{
      width: 100%;
      padding:0.05rem 0.1rem;
      display: flex;
      color: #fff;
      font-size: 0.08rem;
      margin-bottom: 0.1rem;
      .lf{
        display: flex;
        flex: 1;
        text-align: left;
        line-height: 0.2rem;
      }
      .rt{
        flex: 1;
        justify-content: right;
        display: flex;
      }
      .button{
        width: 0.5rem;
        height: 0.2rem;
        line-height: 0.2rem;
        text-align: center;
        background: url("../assets/imgs/pager_button_bg.png") no-repeat center;
        background-size: 100% 100%;
        margin-left: 0.04rem;
        cursor: pointer;
      }
      .button.active{
        background: url("../assets/imgs/pager_button_bg2.png") no-repeat center;
        background-size: 100% 100%;
      }
      .select{
        margin-left: 0.1rem;
        .t-select__wrap{
          width: 0.6rem;
        }
        :deep(.t-input){
          height: 0.2rem;
          background: #0071bc;
          border: #0071bc;
        }
        :deep(input){
          font-size: 0.08rem;
          color:#fff;
          text-align: center;
        }
        :deep(path){
          color:#fff;
        }
        :deep(.t-input--focused){
          box-shadow: none;
        }
      }
      .pageNum{
        line-height: 0.2rem;
        font-size: 0.08rem;
        padding:0 0.03rem 0 0.06rem;
      }
    }
    .videos{
      width: 100%;
      height: calc(100% - 1.2rem);
      margin-left: 0.14rem;
      .row{
        width:100%;
        height:100%;
        display: block;
        .col{
          float:left;
          width: 0.5rem;
          background-color: #000000;
          margin:0.02rem;
          overflow: hidden;
          .active{
            border:2px solid #d5aa5b
          }
          :deep(.vjs-control-bar){
            height: 0.18rem;
            font-size: 0.08rem;
          }
          :deep(.vjs-time-control){
            line-height: 0.18rem;
            font-size: 0.08rem;
          }
          :deep(.vjs-icon-placeholder:before){
            font-size: 0.1rem;
          }
          :deep(.vjs-playback-rate-value){
            line-height: 0.18rem;
            font-size: 0.09rem;
          }
          :deep(.vjs-button){
            line-height: 0.19rem;
          }
          :deep(.vjs-icon-spinner:before){
            font-size: 0.1rem;
            line-height: 0.18rem;
          }
          :deep(.vjs-menu-item-text){
            font-size: 0.08rem;
            line-height: 0.14rem;
          }
          :deep(.vjs-menu-content){
            bottom: 0.07rem;
          }
          :deep(.vjs-play-control){
            width:0.2rem;
          }
          :deep(.vjs-big-play-button){
            top: calc(50% - 0.07rem);
            width: 0.35rem;
            height: 0.22rem;
            line-height: 0.18rem;
          }
        }
        .col2{
          width: calc(50% - 0.14rem);
          //height: 1.39rem;
          height: 50%;
        }
        .col3{
          width:calc(33.333% - 0.1rem);
          //height: 0.92rem;
          height: 33.333%;
        }
        .col4{
          width:calc(25% - 0.078rem);
          //height: 0.687rem;
          height: 25%;
        }
      }
    }
    .fullscreen{
      object-fit: contain;
      user-select: text;
      position: fixed!important;
      box-sizing:border-box!important;
      min-width: 0px !important;
      max-width: none !important;
      min-height: 0px !important;
      max-height: none !important;
      width: 100% !important;
      height: 100% !important;
      transform:none !important;
      inset:0px !important;
      margin:0% !important;
      overlay: auto !important;
      background-color: #0071bc;
    }
  }
  .box_content{
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    .chart{
      width: 100%;
      height: 100%;
    }
  }
  .warn_list {
    position: relative;
    padding: 0px;
    margin-top: 0rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: 0.1rem;
    .header{
      width: 100%;
      height: 0.2rem;
      line-height: 0.2rem;
      color:#ffffff;
      background: url("../assets/imgs/table_header_bg.png") no-repeat center;
      background-size: 100% 100%;  
      font-size: 0.08rem;
      display: flex;
      .time{
        flex:1;
        text-align: center; 
      }
      .name{
        flex:1;
        text-align: center; 
      }
      .status{
        width:0.45rem;
        text-align: center; 
      }
    }
    .body {
      width: 100%;
      flex:1;
      overflow:hidden;
      .item{
        display: flex;
        text-align: center;
        color: #fff;
        line-height: 0.25rem;
        font-size: 0.08rem;
        border-bottom:1px dashed #084893;
        .time{
          flex: 1;
          text-align: center; 
        }
        .name{
          flex:1;
          text-align: center;
        }
        .status{
          color:#ffd700;
          width:0.45rem;
          text-align: center;
        }
      }
    }
  }
  .device_list{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .select{
      width: 100%;
      height: 0.2rem;
      background: url("../assets/imgs/device_select_bg.png") no-repeat center;
      background-size: 100% 100%;
      margin:0.06rem 0;
      .text{
        font-weight: bold;
        font-size: 0.08rem;
        color: #fff;
        text-align: left;
        line-height: 0.2rem;
        padding-left: 0.25rem;
      }
    }
    .line{
      width: 94%;
      height: 0.08rem;
      background: url("../assets/imgs/device_line.png") no-repeat center;
      background-size: 100% 100%;
      margin-bottom: 0.06rem;
    }
    .list{
      width:100%;
      height: calc(100% - 0.46rem);
      background: url("../assets/imgs/device_list_bg.png") no-repeat center;
      background-size: 100% 100%;
      overflow-x: hidden;
      overflow-y: auto;
      .rows{
        padding: 0.1rem 0.15rem;
        :deep(.t-tree){
          color:#fff;
          font-size: 0.08rem;
          line-height: 0.18rem;
          text-align: left;
        }
        :deep(.t-is-active){
          color:#ffd700;
          background-color: transparent !important;
        }
        :deep(.t-tree__icon:hover){
          background-color: transparent !important;
        }
        :deep(.t-tree__icon){
          path{
            fill: #fff;
          }
        }
      }
    }
  }
  :deep(.warnDialog){
    .t-dialog{
      background-color: transparent;
      padding: 0;
      border: none;
    }
    .t-dialog__header{
      display: none;
    }
    .t-dialog__footer{
      display: none;
    }
    .content{
      width: 5rem;
      height: 3.15rem;
      background: url('../assets/imgs/dialog_bg.png') no-repeat center;
      background-size: 100% 100%;
      position: relative;
      padding: 0.1rem 0.2rem;
      overflow: hidden;
      .close{
        position: absolute; 
        right:0.1rem; 
        top:0.07rem; 
        width:0.25rem;
      }
      .title{
        color: #fff;
        padding-left: 0.2rem;
        line-height: 0.42rem;
        font-size: 0.1rem;
        font-weight: bold;
      }
      .body{
        margin-top:0.15rem; 
        color:#fff;
        display: flex;
        font-size: 0.08rem;
        .lf{
          width:2rem;
          padding-left: 0.1rem;
          img{
            width:100%;
          }
        }
        .rt{
          flex:1;
          padding-left: 0.2rem;
          line-height: 0.2rem;
        }
      }
    }
  }
  :deep(.videoDialog){
    .content{
      width:4.7rem;
      height:2.8rem;
    }
    .t-dialog__footer{
      display: none;
    }
    .t-dialog__header{
      padding-top:0.06rem;
      color:#fff;
    }
    .t-dialog--default{
      padding:0.05rem 0.14rem;
      background-color: #3d7ab9;
      border-color: #0f5a9b;
    }
  }
}
</style>
