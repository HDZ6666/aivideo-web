<template>
  <div class="container">
    <dv-full-screen-container>
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
          <dv-decoration-3 style="width:300px;height:50px;" />
          <alarm-carousel></alarm-carousel>
        </div>
        <div class="content-right">
          <alarm-list :alarmListData="alarmListData"></alarm-list>
          <alarm-tendency :alarmTendencyData="alarmTendencyData"></alarm-tendency>
          <alarm-count :alarmCountData="alarmCountData"></alarm-count>
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
    </dv-full-screen-container>
  </div>
</template>

<script>
import headerTop from "./cockpit/header-top.vue";
import player from "./common/jessibuca.vue";

import LivePlayer from '@liveqing/liveplayer'

import deviceTree from "./cockpit/deviceTree.vue";
import deviceCount from "./cockpit/deviceCount.vue";
import deviceOnlineRate from "./cockpit/deviceOnlineRate.vue";
import indicatorList from "./cockpit/indicatorList.vue";
import videoList from "./cockpit/videoList.vue";
import alarmCarousel from "./cockpit/alarmCarousel.vue";
import alarmList from "./cockpit/alarmList.vue";
import alarmTendency from "./cockpit/alarmTendency.vue";
import alarmCount from "./cockpit/alarmCount.vue";

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
      videoUrl: "ws://183.239.58.24:20001/rtp/44010200491330000001_34020000001340000001.live.flv",
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
        rowNum: 5,
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
        ],
        extend: {
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
        ],
        extend: {
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
  },
  methods: {
    handleDeviceClick(data) {
      console.log(data);
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
  /* background-image: url("/static/images/cockpitbg.jpg"); */
  filter: brightness(90%);
  background-size: 100% 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
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
  padding: 0 20px 20px;
  box-sizing: border-box;
}

.module-title {
  width: 150px;
  height: 50px;
}

.content-left {
  min-width: 250px;
}

.content-main {
  flex: 1;
  margin: 0 30px;
}

.content-right {
  min-width: 300px;
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
</style>
