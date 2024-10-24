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
                <t-tree :data="bind.deviceTree" :activable="true" @active="changeDeviceTree" />
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
            <span class="number">21</span>个
          </div>
          <div class="name">国际设备</div>
        </div>
      </div>
      <div class="item">
        <div class="icon"><img src="@/assets/imgs/nav_icon.png"/></div>
        <div class="text">
          <div class="value">
            <span class="number">2665</span>个
          </div>
          <div class="name">通道总数量</div>
        </div>
      </div>
      <div class="item">
        <div class="icon"><img src="@/assets/imgs/nav_icon.png"/></div>
        <div class="text">
          <div class="value">
            <span class="number">6617</span>个
          </div>
          <div class="name">在线通道数量</div>
        </div>
      </div>
      <div class="item">
        <div class="icon"><img src="@/assets/imgs/nav_icon.png"/></div>
        <div class="text">
          <div class="value">
            <span class="number">12</span>个
          </div>
          <div class="name">非国标设备数</div>
        </div>
      </div>
    </div>
    <div class="pager">
      <div class="lf">
        <!-- <div class="button">全屏</div> -->
        <div class="button" @click="autoPage($event)">自动轮播</div>
      </div>
      <div class="rt">
        <div class="button">上一页</div>
        <div class="pageNum">{{ pager.pageIndex }} / {{ pager.totalPage }}</div>
        <div class="button">下一页</div>
        <div class="select">
          <t-select v-model="pager.pageSize" @change="changePageSize">
            <t-option key="4" label="2X2/页" value="4" />
            <t-option key="9" label="3X3/页" value="9"></t-option>
            <t-option key="16" label="4X4/页" value="16" />
          </t-select>
        </div>
      </div>
    </div>
    <div class="videos videos4" v-if="pager.pageSize=='4'">
      <div class="row">
        <div class="col">
          <vol-player class="active" @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
    </div>
    <div class="videos videos9" v-else-if="pager.pageSize=='9'">
      <div class="row">
        <div class="col">
          <vol-player class="active" @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
    </div>
    <div class="videos videos16" v-else-if="pager.pageSize=='16'">
      <div class="row">
        <div class="col">
          <vol-player class="active" @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
        <div class="col">
          <vol-player @click="selectVideo($event)"></vol-player>
        </div>
      </div>
    </div>
  </div>

  <t-dialog v-model:visible="showWarnDialog" width="5rem" class="warnDialog">
    <div class="content">
      <img src="@/assets/imgs/close.png" class="close" @click="showWarnDialog=false">
      <div></div>
    </div>
  </t-dialog>
</div>
</template>
<script>
import $ from 'jquery'
import 'swiper/swiper-bundle.css';
import 'swiper/components/scrollbar/scrollbar.min.css'
import 'swiper/components/pagination/pagination.min.css'
import SwiperCore, { Scrollbar, Pagination, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import { Vue3SeamlessScroll } from "vue3-seamless-scroll"
import VolBox from "./box.vue"
import VolPlayer from "./player.vue"
import { defineComponent } from "vue"

import { gjqsOption, gjqsChartCreate, gjqsReload, gjqsDestroy, gjqsResize } from './monitor/chartGJQS.js' 
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
      showWarnDialog:false,
      leftBox1Height:0,
      rightBox1Height:0,
      rightBox2Height:0,
      deviceSelected:'全部设备',
      chart:{
      },
      pager:{
        pageIndex:1,
        pageSize:'9',
        totalPage:20
      },
      bind:{
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
        ]
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
    changeDevice(row){
      this.deviceSelected=row.name;
    },
    changePageSize(){
    },
    autoPage(event){
      if($(event.currentTarget).hasClass("active")){
        $(event.currentTarget).removeClass("active")
      }
      else{
        $(event.currentTarget).addClass("active")
      }
    },
    selectVideo(event){
      $(event.currentTarget).parent().parent().parent().find(".player").removeClass("active")
      $(event.currentTarget).addClass("active")
    },
    viewWarnInfo(row){
        this.showWarnDialog=true;
    },
    changeDeviceTree(node){
      console.log(node);
    },
    getDeviceList(){
      this.bind.deviceTree=[];
      const apiClient = getApiClient();
      apiClient.GET("/ai/api/device/group/cameraGroupList?parentId=0").then(r => {
        if(r.data.code=="0"){
          let tree=[];
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
        return [];
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
    getInfo(){
      const apiClient = getApiClient();
      apiClient.GET("/cockpit/api/proxy/resource/info").then(r => {
        console.log(JSON.stringify(r));
        
      })
    },
    getAlarmList(){
      const apiClient = getApiClient();
      apiClient.GET("/ai/api/alarm/alarmCameraListAll?page=1&pageSize=20").then(r => {
        if(r.data.code=="0"){
          this.bind.warnList=[];
          let rows=[];
          for(let i=0;i<r.data.data.list.length;i++){
            rows.push({
              id:r.data.data.list[i].id,
              time:r.data.data.list[i].alarmTime.substr(0,18),
              name:r.data.data.list[i].alarmTypeName,
              status:r.data.data.list[i].status==0?'未处理':'已处理'
            });
          }
          this.bind.warnList=rows;
        }
      })
    },
    getAlarmTrend(){
      const apiClient = getApiClient();
      apiClient.GET("/ai/api/alarm/alarmTrendListSevenDay").then(r => {
        if(r.data.code=="0"){
          let xAxiData=[];
          let serieData=[];
          for(let i=0;i<r.data.data.length;i++){

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
    this.getDeviceList();
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
      .row{
        display: flex;
        .col{
          flex:1;
          width: 0.5rem;
          background-color: #000000;
          margin:0.05rem;
          .active{
            border:2px solid #d5aa5b
          }
        }
      }
    }
    .videos4{
      .col{
        height: 1.475rem;
      }
    }
    .videos9{
      .col{
        height: 0.95rem;
      }
    }
    .videos16{
      .col{
        height: 0.687rem;
      }
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
  .fullscreen {
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100vw;
    height: 100vh; 
    z-index: 1000;
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
      .close{
        position: absolute; 
        right:0.1rem; 
        top:0.07rem; 
        width:0.25rem;
      }
    }
  }
}
</style>
