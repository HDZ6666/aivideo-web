<template>
  <div class="container" id="container">
    <!-- <dv-full-screen-container> -->
    <header-top />
    <div class="container-content">
      <div class="content-left">
        <device-tree :deviceList="deviceList" @deviceClick="handleDeviceClick"></device-tree>
        <device-count :deviceCountData="deviceCountData"></device-count>
        <device-online-rate :deviceOnlineData="deviceOnlineData"></device-online-rate>
      </div>
      <div class="content-main">
        <indicator-list :indicatorListData="indicatorListData"></indicator-list>
        <videoList></videoList>
        <!-- <dv-decoration-3 style="width:300px;height:50px;" /> -->
        <!-- <alarm-carousel></alarm-carousel> -->
      </div>
      <div class="content-right">
        <alarm-list :alarmListData="alarmListData"></alarm-list>
        <alarm-tendency
          :alarmTendencyData="alarmTendencyData"
          :alarmTendencyExtend="alarmTendencyExtend"
        ></alarm-tendency>
        <alarm-count :alarmCountData="alarmCountData" :alarmCountExtend="alarmCountExtend"></alarm-count>
        <!-- <dv-decoration-7 style="width:150px;height:50px;">处理情况</dv-decoration-7>
          <div class="handle-box">
            <div class="handle-itme">
              <dv-percent-pond :config="handleconfig1" style="width:120px;height:50px;" />
              <span class="handle-label">今日未处理</span>
            </div>
            <div class="handle-itme">
              <dv-percent-pond :config="handleconfig2" style="width:120px;height:50px;" />
              <span class="handle-label">历史未处理</span>
            </div>
        </div>-->
      </div>
    </div>
    <!-- </dv-full-screen-container> -->
    <!-- <button style="position: absolute;left:0" @click=" showDialog = !showDialog;">切换</button> -->
    <transition
      enter-active-class="animate__animated animate__fadeInTopRight"
      leave-active-class="animate__animated animate__fadeOutBottomLeft"
    >
      <div v-if="dialogObj.showDialog" class="alarm-dialog">
        <dv-border-box-11
          class="dialog-border"
          :title="dialogObj.showAlarmObj.modelname"
          backgroundColor="rgba(67,79,103,0.9)"
        ></dv-border-box-11>
        <div
          class="dialog-content"
          v-loading="dialogObj.handleLoading"
          element-loading-background="rgba(0, 0, 0, 0.4)"
        >
          <div class="close-box">
            <span v-if="!dialogObj.showClose">{{ dialogObj.count }}</span>
            <i v-else class="el-icon-close" @click="handleClose"></i>
          </div>
          <div class="img-box">
            <el-image
              style="width: 100%; height: 100%"
              :src="dialogObj.showAlarmObj.alarmImg"
              fit="contain"
            ></el-image>
          </div>
          <!-- <dv-decoration-2 style="width:5px;height:150px;" /> -->
          <dv-decoration-2 :reverse="true" style="width:5px;height:300px;" />
          <div class="medium-content">
            <!-- <dv-border-box-10 style="width:150px;height:40px;line-height:40px;text-align:center">人脸识别检测</dv-border-box-10> -->
            <!-- <dv-decoration-5 style="width:300px;height:40px;" /> -->
            <dv-decoration-3 style="width:250px;height:30px;" />
            <el-descriptions :column="1" size="medium">
              <el-descriptions-item label="告警时间">{{ dialogObj.showAlarmObj.alarmTime || '' }}</el-descriptions-item>
              <el-descriptions-item label="告警地点">信息大厦</el-descriptions-item>
              <el-descriptions-item label="设备名称">信息大厦-华为枪机#1</el-descriptions-item>
              <el-descriptions-item label="告警ID">{{ dialogObj.showAlarmObj.alarmId }}</el-descriptions-item>
              <el-descriptions-item label="置信度">58%</el-descriptions-item>
              <el-descriptions-item label="处理情况">
                <el-tag size="small" color="#2db7f5" class="handleStatus">待处理</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="通知人员">
                <div class="notifePeople-box">
                  <el-tag size="small" class="notifePeople">黄总</el-tag>
                  <el-tag size="small" class="notifePeople">李总</el-tag>
                  <el-tag size="small" class="notifePeople">何总</el-tag>
                  <el-tag size="small" class="notifePeople">何总</el-tag>
                  <el-tag size="small" class="notifePeople">何总</el-tag>
                  <el-tag size="small" class="notifePeople">何总</el-tag>
                  <el-tag size="small" class="notifePeople">何总</el-tag>
                </div>
              </el-descriptions-item>
              <!-- <el-descriptions-item label="置信度">58%</el-d/escriptions-item> -->
            </el-descriptions>
            <div class="handleButtons">
              <dv-border-box-8 class="handleButton">
                <div @click="handleState(1)">处理</div>
              </dv-border-box-8>
              <dv-border-box-8 class="handleButton" :reverse="true">
                <div @click="handleState(2)">误报</div>
              </dv-border-box-8>
            </div>
          </div>
        </div>
        <!-- <div class="dialog-content"></div> -->
        <!-- <dv-border-box-5 style="width:300px;height:100px">电瓶车检测</dv-border-box-5> -->

        <!-- <dv-border-box-1></dv-border-box-1> -->

        <!-- <dv-decoration-5 style="width:300px;height:40px;" /> -->
        <!-- <dv-border-box-11 class="dialog-border" title="dv-border-box-11"></dv-border-box-11> -->

        <!-- <dv-border-box-1 style="width:300px;height:400px;">dv-border-box-1</dv-border-box-1> -->
      </div>
    </transition>
    <!-- <div v-show="false">
      <img :src="item.alarmImg" alt v-for="item in dialogObj.alarmShowList" :key="item.id" />
    </div>-->
  </div>
</template>

<script>
import "animate.css";
import autofit from "autofit.js";
import headerTop from "./cockpit/header-top.vue";
import player from "./common/jessibuca.vue";
import LivePlayer from "@liveqing/liveplayer";
import deviceTree from "./cockpit/deviceTree.vue";
import deviceCount from "./cockpit/deviceCount.vue";
import deviceOnlineRate from "./cockpit/deviceOnlineRate.vue";
import indicatorList from "./cockpit/indicatorList.vue";
import videoList from "./cockpit/videoList.vue";
import alarmCarousel from "./cockpit/alarmCarousel.vue";
import alarmList from "./cockpit/alarmList.vue";
import alarmTendency from "./cockpit/alarmTendency.vue";
import alarmCount from "./cockpit/alarmCount.vue";
import moment from "moment";
// import img  from "/static/images/catch.jpg"

export default {
  name: "videoCockpit",
  components: {
    headerTop,
    // player,
    LivePlayer,
    deviceTree,
    deviceCount,
    deviceOnlineRate,
    indicatorList,
    videoList,
    alarmCarousel,
    alarmList,
    alarmTendency,
    alarmCount
  },
  data() {
    return {
      dialogObj: {
        requestTimer: null,
        domTimer: null,
        alarmShowList: [],
        alarmMap: {},
        showTime: 10,
        hideTime: 3,
        showDialog: false,
        canshow: false,
        showAlarmObj: {},
        page: 1,
        pageSize: 10,
        total: 0,
        getAllData: false,
        count: 0,
        countDownTimer: null,
        getListLoading: false,
        handleLoading: false,
        showClose: false
        // showTimes: 0
      },
      // timer: null,
      // showDialog: true,
      videoUrl:
        "ws://183.239.58.24:20001/rtp/44010200491330000001_34020000001340000001.live.flv",
      deviceList: [
        {
          label: "移动信息大厦",
          children: [
            {
              label: "枪机1"
            },
            {
              label: "枪机2"
            },
            {
              label: "球机1"
            }
          ]
        }
      ],
      deviceCountData: {
        rowNum: 8,
        data: []
      },
      deviceOnlineData: {
        radius: "80%",
        activeRadius: "85%",
        color: ["#16bf9d", "#519fd7", "#e16379"],
        data: [
          {
            name: "设备总数",
            value: 78
          },
          {
            name: "在线数",
            value: 55
          },
          {
            name: "离线数",
            value: 120
          }
        ],
        digitalFlopStyle: {
          fontSize: 20
        }
      },
      indicatorListData: [
        {
          label: "设备总数",
          value: 5000
        },
        {
          label: "在线数量",
          value: 4500
        },
        {
          label: "今日告警",
          value: 30
        },
        {
          label: "待处理",
          value: 100
        }
      ],
      alarmListData: {
        header: ["时间", "事件", "状态"],
        rowNum: 6,
        data: [
          ["2024/1/19 10:20:33", "区域入侵", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"],
          ["2024/1/19 10:20:33", "区域入侵", "未处理"],
          ["2024/1/19 10:20:33", "周界闯入", "未处理"],
          ["2024/1/19 10:20:33", "周界闯入", "未处理"],
          ["2024/1/19 10:20:33", "区域入侵", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"],
          ["2024/1/19 10:20:33", "人脸识别", "未处理"]
        ],
        columnWidth: [180, 120, 80],
        align: ["center"]
      },
      alarmTendencyData: {
        columns: ["date", "告警"],
        rows: [
          { date: "1-01", 告警: 10 },
          { date: "1-02", 告警: 20 },
          { date: "1-03", 告警: 30 },
          { date: "1-04", 告警: 50 },
          { date: "1-05", 告警: 100 },
          { date: "1-06", 告警: 10 }
        ]
      },
      alarmTendencyExtend: {
        grid: { x: 10, y: 10, x2: 15, y2: 10 },
        yAxis: {
          axisLabel: {
            color: "#fff"
          }
        },
        xAxis: {
          axisLabel: {
            color: "#fff"
          }
        }
      },
      handleconfig1: {
        value: 66,
        borderWidth: 5,
        borderRadius: 10,
        borderGap: 5
      },
      handleconfig2: {
        value: 66,
        borderWidth: 5,
        borderRadius: 10,
        borderGap: 5
      },
      alarmCountData: {
        columns: ["date", "提醒", "普通", "严重"],
        rows: [
          { date: "1-01", 提醒: 10, 普通: 20, 严重: 30 },
          { date: "1-02", 提醒: 20, 普通: 20, 严重: 30 },
          { date: "1-03", 提醒: 30, 普通: 20, 严重: 30 },
          { date: "1-04", 提醒: 10, 普通: 20, 严重: 30 },
          { date: "1-05", 提醒: 20, 普通: 20, 严重: 30 },
          { date: "1-06", 提醒: 30, 普通: 20, 严重: 30 }
        ]
      },
      alarmCountExtend: {
        grid: { x: 10, y: 40, x2: 15, y2: 10 },
        legend: {
          textStyle: {
            color: "#fff"
          }
        },
        yAxis: {
          axisLabel: {
            color: "#fff"
          }
        },
        xAxis: {
          axisLabel: {
            color: "#fff"
          }
        }
      }
    };
  },
  mounted() {
    // 设备列表
    for (let i = 0; i < 10; i++) {
      this.deviceList.push({
        id: `customer${i + 1}`,
        label: `客户${i + 1}`,
        children: [
          {
            id: `customer${i + 1}_device1`,
            label: "枪机1"
          },
          {
            id: `customer${i + 1}_device2`,
            label: "枪机2"
          },
          {
            id: `customer${i + 1}_device3`,
            label: "球机1"
          }
        ]
      });
    }
    // 统计
    this.deviceCountData.data = this.deviceList.map((item, i) => {
      return {
        name: item.label,
        value: 2 * i + 10
      };
    });
    autofit.init(
      {
        dh: 779,
        dw: 1440,
        el: "#container",
        resize: true
      },
      true
    );

    this.getAlarmList();
    this.handleShowDialog();

    this.$nextTick(_ => {
      // const player = this.$refs.player;
      const LivePlayer = this.$refs.livePlayer;

      // player && player.updatePlayerDomSize();

      // let dom = this.$refs.container;
      // let width = dom.parentNode.clientWidth
      // let height = (9 / 16) * width
      //
      // const clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
      // if (height > clientHeight) {
      //   height = clientHeight
      //   width = (16 / 9) * height
      // }
      // if (width > 0 && height > 0) {
      //   dom.style.width = width + 'px';
      //   dom.style.height = height + "px";
      // }
    });

    // this.timer = setInterval(() => {
    //   this.showDialog = !this.showDialog;
    // }, 3000);
  },
  methods: {
    handleDeviceClick(data) {
      console.log(data);
    },
    handleClose() {
      this.handleShowDialog();
    },
    handleState(state) {
      // console.log(state);
      const dialogObj = this.dialogObj;
      dialogObj.showClose = true;
      const ID = dialogObj.showAlarmObj.id;
      if (dialogObj.domTimer) clearTimeout(dialogObj.domTimer); //清除当前的定时器
      if (dialogObj.countDownTimer) clearInterval(dialogObj.countDownTimer); //清除当前的定时器
      dialogObj.handleLoading = true;
      this.$axios({
        method: "get",
        url: `/ai/api/alarm/handle`,
        params: {
          alarmId: ID,
          status: state
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const list = dialogObj.alarmShowList.filter(item => item.id !== ID);
            dialogObj.alarmShowList = [...list];
            delete dialogObj.alarmMap[ID];
            this.handleShowDialog();
          }
        })
        .finally(() => {
          dialogObj.handleLoading = false;
        });
    },
    handleShowDialog() {
      const dialogObj = this.dialogObj;
      let _timeout = 2;
      if (dialogObj.alarmShowList.length === 0) {
        dialogObj.showDialog = false; //展示的长度没有就关闭弹窗
        _timeout = 2; //没有数组的话 2秒检测一次
      } else {
        // const imgLoad = dialogObj.alarmShowList.every(item => item.imgload);
        // console.log(dialogObj.alarmShowList);
        if (dialogObj.showDialog) {
          if (dialogObj.countDownTimer) clearInterval(dialogObj.countDownTimer);
          if (dialogObj.alarmShowList.every(item => item.showDialog)) {
            // 全部都展示过就重置
            dialogObj.alarmShowList.map(item => {
              item.showDialog = false;
              return item;
            });
          }
          _timeout = dialogObj.hideTime;
          this.dialogObj.showDialog = false;
        } else {
          // console.log(dialogObj.alarmShowList)
          const showItem = dialogObj.alarmShowList.filter(
            item => !item.showDialog && item.imgload
          )[0]; // 拿第一个没有展示的值
          _timeout = 0.5; // 500毫秒检测一次看图片加载完没有
          // 图片已经加载了
          if (showItem) {
            _timeout = dialogObj.showTime;
            showItem.showDialog = true; // 开始展示
            dialogObj.showAlarmObj = showItem;
            this.countDown(_timeout);
            this.dialogObj.showDialog = true;
          }
        }
      }
      if (dialogObj.domTimer) clearTimeout(dialogObj.domTimer);
      dialogObj.domTimer = setTimeout(() => {
        this.handleShowDialog();
      }, _timeout * 1000);
    },
    // 循环全部告警列表，最新的排前面告警，每个告警只展示10秒，同时关闭3秒
    // handleShowDialog() {
    //   const dialogObj = this.dialogObj;
    //   let _timeout = 2;
    //   if (dialogObj.alarmShowList.length === 0) {
    //     dialogObj.showDialog = false; //展示的长度没有就关闭弹窗
    //     _timeout = 2; //没有数组的话 2秒检测一次
    //   } else {
    //     if (dialogObj.showDialog) {
    //       dialogObj.alarmShowList.shift(); // 开始展示并删除展示列表的第一位
    //     } else {
    //       dialogObj.showAlarmObj =
    //         dialogObj.alarmMap[dialogObj.alarmShowList[0]]; //关闭状态赋值展示页面取第一个
    //       // console.log(dialogObj.showAlarmObj.alarmId);
    //     }
    //     _timeout = dialogObj.showDialog
    //       ? dialogObj.hideTime
    //       : dialogObj.showTime;
    //     this.dialogObj.showDialog = !this.dialogObj.showDialog; // 取反
    //   }
    //   if (dialogObj.domTimer) clearTimeout(dialogObj.domTimer);
    //   dialogObj.domTimer = setTimeout(() => {
    //     this.handleShowDialog();
    //     this.countDown(
    //       dialogObj.showDialog ? dialogObj.showTime : dialogObj.hideTime
    //     );
    //   }, _timeout * 1000);
    // },
    countDown(time) {
      const dialogObj = this.dialogObj;
      dialogObj.count = time;
      dialogObj.showClose = false;
      if (dialogObj.countDownTimer) clearInterval(dialogObj.countDownTimer);
      dialogObj.countDownTimer = setInterval(() => {
        dialogObj.count--;
      }, 1000);
    },
    // getAlarmList() {
    //   const dialogObj = this.dialogObj;
    //   if (dialogObj.requestTimer) clearInterval(this.dialogObj.requestTimer);
    //   dialogObj.requestTimer = setInterval(() => {
    //     this.$axios({
    //       method: "get",
    //       url: `/ai/api/alarm/alarmCameraListAll`,
    //       params: {
    //         page: dialogObj.page,
    //         pageSize: dialogObj.pageSize
    //       }
    //     }).then(res => {
    //       if (res.data.code === 0) {
    //         const { list, total } = res.data.data;
    //         const page_s = Math.ceil(total / dialogObj.pageSize);
    //         if (total !== dialogObj.total) {
    //           dialogObj.page = 1;
    //           dialogObj.getAllData = false;
    //         } else {
    //           if (!dialogObj.getAllData) {
    //             dialogObj.page++;
    //             dialogObj.getAllData = dialogObj.page === page_s;
    //           } else {
    //             dialogObj.page = 1;
    //           }
    //         }
    //         dialogObj.total = total;
    //         dialogObj.pages = page_s;
    //         const _list = [];
    //         list.forEach(item => {
    //           if (!dialogObj.alarmMap.hasOwnProperty(item.id)) {
    //             dialogObj.alarmMap[item.id] = item;
    //             _list.push(item.id);
    //           }
    //         });
    //         dialogObj.alarmShowList = [..._list, ...dialogObj.alarmShowList];
    //       }
    //     });
    //   }, 5000);
    // },
    getAlarmList() {
      const dialogObj = this.dialogObj;
      if (!dialogObj.getListLoading) {
        dialogObj.getListLoading = true;
        this.$axios({
          method: "get",
          url: `/ai/api/alarm/alarmCameraListAll`,
          params: {
            page: 1,
            pageSize: 9999,
            status: 0,
            todayTime: moment(new Date()).format("YYYY-MM-DD")
          }
        })
          .then(res => {
            if (res.data.code === 0) {
              const { list } = res.data.data;
              const _list = [];
              list.forEach(item => {
                if (!dialogObj.alarmMap.hasOwnProperty(item.id)) {
                  item.showDialog = false;
                  dialogObj.alarmMap[item.id] = item;
                  _list.push(item);
                  if (!item.imgload && item.alarmImg) {
                    const img = new Image();
                    img.src = item.alarmImg;
                    img.onload = function() {
                      item.imgload = true;
                    };
                  }
                }
              });
              dialogObj.alarmShowList = [..._list, ...dialogObj.alarmShowList];
            }
          })
          .finally(() => {
            dialogObj.getListLoading = false;
          });
      }
      if (dialogObj.requestTimer) clearInterval(this.dialogObj.requestTimer);
      dialogObj.requestTimer = setInterval(() => {
        this.getAlarmList();
      }, 5000);
    }
  }
};
</script>

<style>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #646a8a;
  color: #fff;
  background-image: url("/static/images/cockpitbg.jpg");
  filter: brightness(90%);
  background-size: 100% 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
  position: relative;
}

#dv-full-screen-container {
  background-image: url("/static/images/cockpitbg.jpg");
  background-size: 100% 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
}
.container-content {
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0 10px 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.module-title {
  width: 150px;
  height: 50px;
}

.content-left {
  display: flex;
  flex-direction: column;
  /* min-width: 300px; */
  width: 280px;
  height: 100%;
  /* background: #000; */
}

.content-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 30px;
  /* background: #c18585; */
}

.content-right {
  display: flex;
  flex-direction: column;
  /* min-width: 400px; */
  width: 350px;
  height: 100%;
  /* background: #ad1919; */
}

.alarm {
  width: 100%;
  height: 250px;
}

.handle-box {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.handle-itme {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}
.handle-label {
  line-height: 20px;
  margin-top: 5px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-descriptions__body {
  color: #fff;
  background: transparent;
}

.alarm-dialog {
  position: absolute;
  width: 800px;
  height: 500px;
  inset: 0;
  margin: auto;
  z-index: 9999;
  /* border-radius: 10px; */
}

.dialog-border {
  width: 100%;
  height: 100%;
}
.dialog-content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 80px 30px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  /* align-items: center; */
}
.close-box {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 21px;
  top: 37px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
}
.img-box {
  width: 400px;
  height: 350px;
  background: #000;
  margin-right: 30px;
}

.medium-content {
  flex: 1;
  display: inline-block;
  margin-left: 30px;
}
.handleStatus {
  color: #fff;
}

.notifePeople-box {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.notifePeople {
  margin-right: 5px;
  margin-bottom: 5px;
  color: #000;
}

.handleButtons {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
}

.handleButton {
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-left: 20px;
  cursor: pointer;
}
</style>
