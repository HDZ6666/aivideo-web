<template>
  <div id="monitor">
    <div v-if="!cameraFullscreen" :style="leftDynameicStyle" class="left">
      <div class="device_list">
        <div class="list">
          <div class="rows">
            <t-tree
              ref="tree"
              value-mode="all"
              :data="bind.deviceTree"
              :activable="true"
              @active="changeDeviceTree"
              @expand="deviceTreeExpand"
            >
              <template #label="{ node }">
                <span @dblclick.stop="() => searchDeviceTree(node)">{{ node.label }}</span>
              </template>
            </t-tree>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!cameraFullscreen" class="right">
      <card-box title="告警统计" :height="rightBox1Height" class="box" @more="toggleWarnDialog">
        <div class="box_content" style="flex-direction: column">
          <div class="warn_stat_box" v-for="(item, index) in bind.alarmStatistics" :key="index">
            <div class="warn_stat_title">
              <img src="../assets/imgs/warnstat1.png" alt="" />
              <span class="title title1">{{ item["alarmTypeName"] }}</span>
            </div>
            <div class="warn_stat">
              <div class="warn_stat_content">
                <div class="warn_frame">
                  <p>{{ item["curDateAlarmCount"] }}</p>
                  <span>当日告警数</span>
                </div>
                <div class="warn_frame">
                  <p style="color: var(--td-untreated-color)">{{ item["curDateAlarmNoHandleCount"] }}</p>
                  <span>当日未处理</span>
                </div>
                <div class="warn_frame">
                  <p>{{ item["sevenDayAlarmCount"] }}</p>
                  <span>近7天告警数</span>
                </div>
                <div class="warn_frame">
                  <p>{{ item["sevenDayAlarmNoHandleCount"] }}</p>
                  <span>近7天未处理</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </card-box>
      <card-box class="box" title="摄像头告警" more="详情" :height="rightBox2Height" @more="toggleCameraDialog">
        <div class="box_content">
          <div class="camera-warn">
            <div class="camera-item" v-for="(item, index) in bind.warnList" :key="index" @click="cameraDetail(item)">
              <img :src="item.alarmImg" alt="" />
              <div class="camera-addr">【{{ item.alarmTypeName }}】{{ item.deviceName }}</div>
            </div>
          </div>
        </div>
      </card-box>
      <card-box title="告警趋势" more="" :height="rightBox2Height" class="box">
        <div style="color: var(--chart-title-color); position: absolute">告警数量：次</div>
        <div class="box_content">
          <div id="chartGJQS" class="chart"></div>
        </div>
      </card-box>
    </div>
    <div :class="{ center: true, 'center-fullscreen': cameraFullscreen }">
      <div v-if="!cameraFullscreen" class="nav">
        <div class="item" v-for="item in cameraFullscreenList" :key="item.imgaeUrl">
          <div class="icon"><img :src="item.imgaeUrl" /></div>
          <div class="text">
            <div class="value">
              <span class="number" :style="item.number == 'activedAlarm' ? 'color:var(--td-untreated-color)' : ''">{{
                bind.stat[item.number]
              }}</span
              ><span class="unit">个</span>
            </div>
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
        <!-- <div class="item">
          <div class="icon"><img src="@/assets/imgs/device_online.png" /></div>
          <div class="text">
            <div class="value">
              <span class="number">{{ bind.stat.onlineDev }}</span><span class="unit">个</span>
            </div>
            <div class="name">在线设备数</div>
          </div>
        </div>
        <div class="item">
          <div class="icon"><img src="@/assets/imgs/warn_todo.png" /></div>
          <div class="text">
            <div class="value">
              <span class="number">{{ bind.stat.activedAlarm }}</span><span class="unit">个</span>
            </div>
            <div class="name">未处理告警数</div>
          </div>
        </div>
        <div class="item">
          <div class="icon"><img src="@/assets/imgs/warn_total.png" /></div>
          <div class="text">
            <div class="value">
              <span class="number">{{ bind.stat.allAlarm }}</span><span class="unit">个</span>
            </div>
            <div class="name">告警总数</div>
          </div>
        </div> -->
      </div>
      <camera-box title="监控视频" @changePageSize="changePageSize" @changeFullscreen="changeFullscreen">
        <template #more> </template>
        <template #content>
          <div class="videos">
            <div class="row">
              <div
                :class="{
                  col: true,
                  col2: pager.pageSize == 4,
                  col3: pager.pageSize == 9,
                  col4: pager.pageSize == 12,
                  col5: pager.pageSize == 16,
                }"
                v-for="(row, index) in bind.cameraRows"
                :key="row.id"
              >
                <vol-player :url="row.videoUrl" :autoplay="true" @click="selectVideo($event)"></vol-player>
                <div class="video-name">{{ row.name }}</div>
              </div>
            </div>
          </div>
        </template>
      </camera-box>
      <div class="pager">
        <div class="rt">
          <div class="button" @click="onPage(-1)">上一屏</div>
          <div class="pageNum">{{ pager.pageIndex }} / {{ pager.totalPage }}</div>
          <div class="button" @click="onPage(1)">下一屏</div>
        </div>
      </div>
    </div>

    <t-dialog v-model:visible="warnDialog.show" width="5rem" class="warnDialog">
      <div class="content">
        <img src="@/assets/imgs/close.png" class="close" @click="warnDialog.show = false" />
        <div class="title">{{ warnDialog.data.alarmTypeName }}</div>
        <div class="body">
          <div class="lf">
            <div class="img">
              <img error="@/assets/imgs/alarm_pic.png" :src="warnDialog.data.alarmImg" />
            </div>
          </div>
          <div class="rt">
            <div>告警时间：{{ warnDialog.data.alarmTime }}</div>
            <div>分组名称：{{ warnDialog.data.alarmCategory }}</div>
            <div>设备名称：{{ warnDialog.data.deviceName }}</div>
            <div>告警ID：{{ warnDialog.data.alarmId }}</div>
            <div>置信度：{{ warnDialog.data.alarmPriority }}</div>
            <div>
              处理情况： <t-tag theme="warning" v-if="warnDialog.data.status == 0">未处理</t-tag
              ><t-tag theme="success" v-else>已处理</t-tag>
            </div>
            <div>通知人员：</div>
            <div class="buttons"></div>
          </div>
        </div>
      </div>
    </t-dialog>
    <!--查看视频弹出框-->
    <t-dialog
      width="5rem"
      class="videoDialog"
      :header="videoDialog.title"
      v-model:visible="videoDialog.show"
      @closed="videoDialogClosed"
    >
      <div class="content">
        <vol-player ref="videoPlayer" :url="videoDialog.url" :poster="videoDialog.poster"></vol-player>
      </div>
    </t-dialog>

    <warn-box v-if="warnDialogShow" @close="toggleWarnDialog"></warn-box>
    <warn-box-grid v-if="warngridDialogShow" @close="toggleCameraDialog"></warn-box-grid>
    <transition name="slide">
      <warn-detail v-if="detailShow" :info="alarmDetail" @close="detailShow = false"></warn-detail>
    </transition>
    <audio id="alertSound" ref="alertSound" :src="soundSrc"></audio>
    <warn-detail v-if="cameraInfoShow" :info="cameraInfo" @close="cameraInfoShow = false"></warn-detail>
  </div>
</template>
<script>
import $ from "jquery";
import SwiperCore, { Autoplay, Pagination, Scrollbar } from "swiper";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/vue";
import sound from "../assets/alert.mp3";

import { defineComponent } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import VolBox from "./box.vue";
import CardBox from "../components/CardBox.vue";
import WarnBoxGrid from "../components/WarnBoxGrid.vue";
import CameraBox from "../components/CameraBox.vue";
import VolPlayer from "./livePlayer.vue";
import WarnBox from "../components/WarnBox.vue";
import WarnDetail from "../components/WarnDetail.vue";
import { mapGetters } from "vuex";
import { gjqsChartCreate, gjqsDestroy, gjqsOption, gjqsReload, gjqsResize } from "./monitor/chartGJQS.js";
import device_total from "@/assets/imgs/device_total.png";
import device_online from "@/assets/imgs/device_online.png";
import warn_todo from "@/assets/imgs/warn_todo.png";
import warn_total from "@/assets/imgs/warn_total.png";
import { getImageUrl } from "@/utils/imageUrl.js";
SwiperCore.use([Scrollbar, Pagination, Autoplay]);

import { getApiClient } from "@aivideo/rest";
export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    Vue3SeamlessScroll,
    CardBox,
    CameraBox,
    WarnBox,
    WarnBoxGrid,
    WarnDetail,
    "vol-box": VolBox,
    "vol-player": VolPlayer,
  },
  props: {
    alarmActived: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      soundSrc: sound,
      leftBox1Height: 0,
      rightBox1Height: 0,
      rightBox2Height: 0,
      deviceSelected: "全部设备",
      cameraFullscreen: false,
      warnDialogShow: false,
      warngridDialogShow: false,
      pageSize: "4",
      chart: {},
      pager: {
        pageIndex: 1,
        pageSize: 4,
        totalPage: 20,
      },
      warnDialog: {
        show: false,
        data: {},
      },
      videoDialog: {
        show: false,
        title: "",
        url: "",
        poster: "",
      },
      bind: {
        stat: {
          allDev: 0,
          onlineDev: 0,
          allAlarm: 0,
          activedAlarm: 0,
        },
        info: {
          channel: {
            online: 0,
            total: 0,
          },
          device: {
            online: 0,
            total: 0,
          },
          proxy: {
            online: 0,
            total: 0,
          },
          push: {
            online: 0,
            total: 0,
          },
        },
        warnList: [
          {
            alarmTypeName: 122,
            deviceName: 212,
          },
        ],
        deviceData: [],
        deviceTree: [
          { id: "1", label: "全部设备", value: "0",},
        ],
        cameraList: [],
        cameraRows: [
          {
            name: "模拟数据",
            streamInfo: {
              hls: {
                url: "",
              },
            },
          },
        ],
        alarmStatistics: [
          {
            alarmTypeName: "烟雾烟火",
            curDateAlarmCount: 0,
            curDateAlarmNoHandleCount: 0,
            sevenDayAlarmCount: 0,
            sevenDayAlarmNoHandleCount: 0,
          },
          {
            alarmTypeName: "通道占用",
            curDateAlarmCount: 0,
            curDateAlarmNoHandleCount: 0,
            sevenDayAlarmCount: 0,
            sevenDayAlarmNoHandleCount: 0,
          },
        ],
        intervalId: null,
      },
      detailShow: false,
      alarmDetail: {},
      cameraInfoShow: false,
      cameraInfo: {},
      cameraFullscreenList: [
        {
          imgaeUrl: device_total,
          name: "设备总数",
          number: "allDev",
        },
        {
          imgaeUrl: device_online,
          name: "设备总数",
          number: "onlineDev",
        },
        {
          imgaeUrl: warn_todo,
          name: "未处理告警数",
          number: "activedAlarm",
        },
        {
          imgaeUrl: warn_total,
          name: "告警总数",
          number: "allAlarm",
        },
      ],
      leftDynameicStyle: {}, //左侧动态样式
      cardBoxDynameicStyle: {},
      //backData:{}
    };
  },
  computed: {
    ...mapGetters(["mbData"]),
  },
  setup() {},
  watch: {
    alarmActived(newVal) {
      if (newVal) {
        this.getAlarmList();
        this.intervalId = setInterval(this.getAlarmList, 13000);
      } else {
        clearInterval(this.intervalId);
      }
    },
    mbData(newVal) {
      //this.backData = newVal
      this.getmbList(newVal);
    },
  },
  methods: {
    toggleFullScreen() {
      window.top?.dispatchEvent(new CustomEvent("toggleFullScreen"));
    },
    toggleWarnDialog(show) {
      this.warnDialogShow = show;
    },
    toggleCameraDialog(show) {
      console.log(show);
      this.warngridDialogShow = show;
    },
    initBoxHeight() {
      var totalHeight = parseInt($(document).height() - this.$fontSize * 0.5);
      var height = parseInt(totalHeight / 3.5);
      var maxHeight = parseInt(this.$fontSize * 1.52);
      if (height > maxHeight) {
        height = maxHeight;
      }
      this.leftBox1Height = totalHeight;
      this.rightBox2Height = height - this.$fontSize * 0.1;
      this.rightBox1Height = totalHeight - this.rightBox2Height * 2 - this.$fontSize * 0.1 * 2.5;
    },
    changePageSize(pageSize) {
      console.log("changePageSize", pageSize);
      this.pageSize = pageSize;
      this.pager.pageSize = parseInt(this.pageSize);
      this.pager.pageIndex = 1;
      this.pager.totalPage = Math.ceil(this.bind.cameraList.length / this.pager.pageSize);
      this.getCameraPage();
    },
    changeFullscreen(aa) {
      console.log("changeFullscreen", aa);
      this.cameraFullscreen = !this.cameraFullscreen;
    },
    autoPage(event) {
      if ($(event.currentTarget).hasClass("active")) {
        $(event.currentTarget).removeClass("active");
      } else {
        $(event.currentTarget).addClass("active");
      }
    },
    onPage(val) {
      if (val > 0) {
        if (this.pager.pageIndex + 1 > this.pager.totalPage) {
          this.$message.error("没有下一页了");
        } else {
          this.pager.pageIndex++;
          this.getCameraPage();
        }
      } else {
        if (this.pager.pageIndex - 1 < 1) {
          this.$message.error("没有上一页了");
        } else {
          this.pager.pageIndex--;
          this.getCameraPage();
        }
      }
    },
    selectVideo(event) {
      $(event.currentTarget).parent().parent().parent().find(".player").removeClass("active");
      $(event.currentTarget).addClass("active");
    },
    viewWarnInfo(row) {
      this.warnDialog.show = true;
      this.warnDialog.data = row.data;
      console.log(row);
    },
    searchDeviceTree(node) {
      console.log("searchDeviceTree", node);
      this.getCameraList(node.value);
    },
    changeDeviceTree(values, context) {
      console.log(context.node.data.id);
      // this.getCameraList(context.node.data.id)
      return;
      this.deviceSelected = context.node.data.label;
      if (context.node.data.url != undefined && context.node.data.url != null) {
        this.videoDialog.show = true;
        this.$nextTick(() => {
          this.videoDialog.title = context.node.data.label;
          this.videoDialog.url = context.node.data.url;
        });
      }
    },
    deviceTreeExpand(value, context) {
      if (context.node.data.children === true) {
        this.getDeviceChilrenList(context.node);
      }
    },
    videoDialogClosed() {
      this.$refs["videoPlayer"].onHide();
    },
    getCameraList(categoryId = 0) {
      // this.bind.deviceTree = [];
      const apiClient = getApiClient();
      var apiUrl = `/api/cockpit/proxy/list?page=1&pageSize=1000`;
      if (categoryId) {
        apiUrl += `&categoryId=${categoryId}`;
      }
      apiClient.GET(apiUrl).then((r) => {
        if (r.data.code == "0") {
          this.bind.cameraList = r.data.data.list.map((item) => {
            item.videoUrl = item.streamInfo
              ? location.protocol === "https:"
                ? item.streamInfo.https_flv.url
                : item.streamInfo.flv.url
              : "";
            return item;
          });
          this.pager.pageIndex = 1;
          this.pager.totalPage = Math.ceil(this.bind.cameraList.length / this.pager.pageSize);
          this.getCameraPage();
          // let tree = [{ id: 0, label: '全部设备', value: '0', children: [] }];
          // for (let i = 0; i < this.bind.cameraList.length; i++) {
          //   tree[0].children.push({
          //     id: this.bind.cameraList[i].id,
          //     label: this.bind.cameraList[i].name,
          //     value: this.bind.cameraList[i].id.toString(),
          //     url: this.bind.cameraList[i].streamInfo.hls.url
          //   });
          // }
          // this.bind.deviceTree = tree;
        }
      });
    },
    getCameraPage() {
      let rows = [];
      this.bind.cameraRows = [];
      for (let i = 0; i < this.bind.cameraList.length; i++) {
        if ((i >= this.pager.pageIndex - 1) * this.pager.pageSize && i < this.pager.pageIndex * this.pager.pageSize) {
          rows.push(this.bind.cameraList[i]);
        }
      }
      this.bind.cameraRows = rows;
    },
    getDeviceGroupList() {
      const apiClient = getApiClient();
      apiClient.GET("/ai/api/device/group/cameraGroupList?parentId=0").then((r) => {
        if (r.data.code == "0") {
          let tree = JSON.parse(JSON.stringify(this.bind.deviceTree));
          this.bind.deviceData = r.data.data;
          for (let i = 0; i < r.data.data.length; i++) {
            tree.push({
              id: r.data.data[i].id,
              label: r.data.data[i].group_name,
              value: r.data.data[i].id.toString(),
              children: this.getDeviceChilren(r.data.data[i].children),
            });
          }
          this.bind.deviceTree = tree;
        }
      });
    },
    getDeviceChilren(data) {
      if (data.length == 0) {
        // return [{
        //     id:'',
        //     label:'',
        //     value:''
        //   }];
        return true;
      } else {
        let tree = [];
        for (let i = 0; i < data.length; i++) {
          tree.push({
            id: data[i].id,
            label: data[i].group_name,
            value: data[i].id.toString(),
            children: this.getDeviceChilren(data[i].children),
          });
        }
        return tree;
      }
    },
    getDeviceChilrenList(node) {
      const apiClient = getApiClient();
      apiClient.GET("/ai/api/device/queryManager/list?page=1&pageSize=9999&categoryId=" + node.value).then((r) => {
        if (r.data.code == "0") {
          let children = [];
          for (let i = 0; i < r.data.data.list.length; i++) {
            children.push({
              id: r.data.data.list[i].id,
              label: r.data.data.list[i].name,
              value: r.data.data.list[i].id.toString(),
              url:
                location.protocol === "https:"
                  ? r.data.data.list[i].streamInfo.https_flv.url
                  : r.data.data.list[i].streamInfo.flv.url,
            });
          }
          // let nodes=node.getChildren();
          // for(let i=0;i<nodes.length;i++){
          //   nodes[i].remove();
          // }
          this.$refs.tree.appendTo(node.value, children);
        }
      });
    },
    getInfo() {
      const apiClient = getApiClient();
      apiClient.GET("/api/cockpit/proxy/resource/info").then((r) => {
        if (r.data.code == "0") {
          this.bind.info = r.data.data;
        }
      });
    },
    getAllDev() {
      const apiClient = getApiClient();
      apiClient.GET("/api/alarm/v2/deviceInfo/deviceCount").then((r) => {
        if (r.data.code == "0") {
          this.bind.stat.allDev = r.data.data.deviceCount;
        }
      });
    },
    getOnlineDev() {
      const apiClient = getApiClient();
      apiClient.GET("/api/alarm/v2/deviceInfo/onlineDeviceCount").then((r) => {
        if (r.data.code == "0") {
          this.bind.stat.onlineDev = r.data.data.onlineDeviceCount;
        }
      });
    },
    getAlarmList() {
      const apiClient = getApiClient();
      apiClient.GET(`/api/alarm/v2/stat/findAlarmInfoPage?page=0&size=2&status=0&startTime=${this.getDateDaysAgo(0)} 00:00:00&endTime=${this.getDateDaysAgo(0)} 23:59:59`).then((r) => {
        if (r.data.code == "0") {
          this.bind.warnList = r.data.data.records;
          if (this.bind.warnList.length == 0) {
           return
         }
        //  else {
        //    var hasNew = false;
        //    this.bind.warnList.forEach(w => {
        //      const today = new Date();
        //      const date = new Date(w.alarmTime);
        //      if (today - date < 86400000) {
        //        hasNew = true;
        //      }
        //    })
        //  }
         if (this.alarmActived) {
            this.alarmDetail = this.bind.warnList.find((item) => item.status == 0);
            this.$refs.alertSound.play();
            this.detailShow = true;
            setTimeout(() => {
              this.detailShow = false;
            }, 10000);
          }
        }
      });
    },
    getAlarmTrend() {
      const apiClient = getApiClient();
      apiClient
        .GET(
          "/api/alarm/v2/stat/statAlarmCountByTime?startTime=" + this.getDateDaysAgo(-7) + "&endTime=" + this.getDateDaysAgo(0)
        )
        .then((r) => {
          if (r.data.code == "0") {
            let xAxiData = [];
            let serieData = [];
            for (let i = 0; i < r.data.data.length; i++) {
              xAxiData.push(r.data.data[i].alarmDate.substr(5, 5));
              serieData.push(r.data.data[i].alarmCount);
            }
            gjqsOption.xAxis[0].data = xAxiData;
            gjqsOption.series[0].data = serieData;
            gjqsReload();
          }
        });
    },
    getAlarmStatistics() {
      const apiClient = getApiClient();
      apiClient.GET("/api/alarm/v2/stat/screenAlarmStatistics").then((r) => {
        if (r.data.code == "0") {
          r.data.data.sort((a, b) => b.sevenDayAlarmCount - a.sevenDayAlarmCount);
          this.bind.stat.allAlarm = r.data.data.reduce((t, current) => {
            return t + current.sevenDayAlarmCount;
          }, 0);
          this.bind.stat.activedAlarm = r.data.data.reduce((t, current) => {
            return t + current.sevenDayAlarmNoHandleCount;
          }, 0);
          this.bind.alarmStatistics = r.data.data.slice(0, 2);
        }
      });
    },
    getDateDaysAgo(days) {
      const date = new Date(); // 获取当前日期
      date.setDate(date.getDate() + days); // 根据传入的参数调整日期

      const year = date.getFullYear(); // 获取年份
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 获取月份并确保是两位数
      const day = String(date.getDate()).padStart(2, "0"); // 获取日期并确保是两位数

      return `${year}-${month}-${day}`; // 返回格式化后的日期字符串
    },
    cameraDetail(item) {
      this.cameraInfo = item;
      this.cameraInfoShow = true;
    },
    getmbList(item) {
      debugger;
      if (item.deviceBackgroundBase64) {
        const deviceBackgroundBase64 = getImageUrl(item.deviceBackgroundBase64);
        this.leftDynameicStyle = {
          background: `url(${deviceBackgroundBase64}) no-repeat center`,
          backgroundSize: "100% 100%",
        };
        console.log(this.leftDynameicStyle, "leftDynameicStyle");
      }
      if (item.device_total) {
        this.cameraFullscreenList[0].imgaeUrl = getImageUrl(item.device_total);
      }
      if (item.device_online) {
        this.cameraFullscreenList[1].imgaeUrl = getImageUrl(item.device_online);
      }
      if (item.warn_todo) {
        this.cameraFullscreenList[2].imgaeUrl = getImageUrl(item.warn_todo);
      }
      if (item.warn_total) {
        this.cameraFullscreenList[3].imgaeUrl = getImageUrl(item.warn_total);
      }
    },
  },
  created() {
    this.initBoxHeight();
    window.addEventListener("resize", this.initBoxHeight);
  },
  mounted() {
    gjqsChartCreate(this.$echart, "chartGJQS");
    this.getInfo();
    this.getAllDev();
    this.getOnlineDev();
    this.getCameraList();
    this.getDeviceGroupList();
    this.getAlarmList();
    this.getAlarmTrend();
    setInterval(this.getAlarmStatistics, 5000);
  },
  unmounted() {
    gjqsDestroy();
    window.removeEventListener("resize", this.initBoxHeight);
  },
  activated() {
    gjqsResize();
  },
  deactivated() {},
});
</script>
<style lang="less" scoped>
#monitor {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: all;

  .left {
    position: absolute;
    width: 1.588rem;
    top: -0.2rem;
    left: 0.1rem;
    bottom: 0.1rem;
    background: url(../assets/imgs/left-bg.png) no-repeat;
    background-size: 100% 100%;

    .box {
      margin-top: 0.1rem;
    }
  }

  .right {
    position: absolute;
    width: 2.588rem;
    top: -0.2rem;
    right: 0.1rem;
    bottom: 0.2rem;
    box-sizing: border-box;

    .box {
      margin-bottom: 0.1rem;
    }
  }

  .center-fullscreen {
    left: 0.1rem !important;
    right: 0.1rem !important;
  }

  .center {
    position: absolute;
    left: 1.688rem;
    right: 2.788rem;
    top: -0.1rem;
    bottom: 0.1rem;

    .nav {
      width: 5.159rem;
      margin: 0.16rem auto;
      display: flex;

      .item {
        width: 1.4rem;
        height: 0.422rem;
        display: flex;

        .icon {
          width: 0.32rem;
          line-height: 0.522rem;
          text-align: center;
        }

        .icon img {
          width: 100%;
        }

        .text {
          flex: 1;
          //color: #39d6fe;
          padding: 0 0.05rem;
          font-size: 0.085rem;

          .value {
            margin-top: -0.04rem;

            .number {
              font-size: 0.14rem;
              padding-right: 0.025rem;
              //color: #F2F6FA;
              color: var(--text-number-color);
              font-family: DINPro;
              font-style: normal;
              font-weight: 700;
              line-height: normal;
            }

            .unit {
              color: var(--text-unit-color);
              text-align: center;
              font-family: D-DIN;
              font-size: 0.08rem;
              font-style: normal;
              font-weight: 400;
            }
          }

          .name {
            color: var(--text-name-color);
            font-family: "PingFang SC";
            font-size: 0.09rem;
            font-style: normal;
            font-weight: 400;
          }
        }
      }

      .item:not(firts-children) {
        margin-left: 0.1rem;
      }
    }

    .pager {
      width: 100%;
      padding: 0.05rem 0.1rem;
      display: flex;
      //color: #fff;
      color: var(--text-page-color);
      font-size: 0.08rem;
      margin-bottom: 0.1rem;

      .lf {
        display: flex;
        flex: 1;
        text-align: left;
        line-height: 0.2rem;
      }

      .rt {
        flex: 1;
        justify-content: right;
        display: flex;
      }

      .button {
        width: 0.5rem;
        height: 0.2rem;
        line-height: 0.2rem;
        text-align: center;
        //background: url("../assets/imgs/pager_button_bg.png") no-repeat center;
        background: var(--button-bg-color);
        background-size: 100% 100%;
        margin-left: 0.04rem;
        cursor: pointer;
      }

      .button.active {
        //background: url("../assets/imgs/pager_button_bg2.png") no-repeat center;
        background: var(--button-bg-active-color);
        background-size: 100% 100%;
      }

      .select {
        margin-left: 0.1rem;

        .t-select__wrap {
          width: 0.6rem;
        }

        :deep(.t-input) {
          height: 0.2rem;
          background: var(--td-bg-color-specialcomponent);
          //border: var(--td-bg-color-specialcomponent);
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

      .pageNum {
        line-height: 0.2rem;
        font-size: 0.08rem;
        padding: 0 0.03rem 0 0.06rem;
      }
    }

    .videos {
      width: 100%;
      height: 100%;

      .row {
        width: 100%;
        height: 100%;
        display: block;
        box-sizing: border-box;

        .col {
          float: left;

          // background-color: #000000;
          // margin: 0.06rem;
          overflow: hidden;
          padding: 0 0.04rem 0.2rem 0.04rem;
          box-sizing: border-box;

          .active {
            border: 2px solid var(--border-row-col-color);
          }

          :deep(.player) {
            padding: 0.06rem 0.03rem;
            background: url(../assets/imgs/video_bg.png) no-repeat;
            background-size: 100% 100%;
          }

          :deep(.vjs-control-bar) {
            height: 0.18rem;
            font-size: 0.08rem;
          }

          :deep(.vjs-time-control) {
            line-height: 0.18rem;
            font-size: 0.08rem;
          }

          :deep(.vjs-icon-placeholder:before) {
            font-size: 0.1rem;
          }

          :deep(.vjs-playback-rate-value) {
            line-height: 0.18rem;
            font-size: 0.09rem;
          }

          :deep(.vjs-button) {
            line-height: 0.19rem;
          }

          :deep(.vjs-icon-spinner:before) {
            font-size: 0.1rem;
            line-height: 0.18rem;
          }

          :deep(.vjs-menu-item-text) {
            font-size: 0.08rem;
            line-height: 0.14rem;
          }

          :deep(.vjs-menu-content) {
            bottom: 0.07rem;
          }

          :deep(.vjs-play-control) {
            width: 0.2rem;
          }

          :deep(.vjs-big-play-button) {
            top: calc(50% - 0.07rem);
            width: 0.35rem;
            height: 0.22rem;
            line-height: 0.18rem;
          }
        }

        .col2 {
          width: 50%;
          //height: 1.39rem;
          height: 50%;
        }

        .col3 {
          width: 33.333%;
          //height: 0.92rem;
          height: 33.333%;
        }

        .col4 {
          width: 25%;
          //height: 0.687rem;
          height: 33.333%;
        }

        .col5 {
          width: 25%;
          //height: 0.687rem;
          height: 25%;
        }

        .video-name {
          width: 100%;
          text-align: center;
          height: 0.2rem;
          line-height: 0.2rem;
          color: var(--video-name);
          font-size: 0.08rem;
        }
      }
    }

    .fullscreen {
      object-fit: contain;
      user-select: text;
      position: fixed !important;
      box-sizing: border-box !important;
      min-width: 0px !important;
      max-width: none !important;
      min-height: 0px !important;
      max-height: none !important;
      width: 100% !important;
      height: 100% !important;
      transform: none !important;
      inset: 0px !important;
      margin: 0% !important;
      overlay: auto !important;
      background-color: var(--td-bg-color-specialcomponent);
    }
  }

  .box_content {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;

    .chart {
      width: 100%;
      height: 100%;
    }
  }

  .warn_stat_box {
    width: 100%;
    height: 50%;
  }

  .warn_stat_title {
    height: 40%;
    display: flex;
    align-items: center;
    justify-items: left;

    img {
      width: 0.12rem;
    }

    .title {
      font-family: "YouSheBiaoTiHei";
      font-style: normal;
      font-weight: 400;
      font-size: 0.1rem;
      padding-top: 0.02rem;
      padding-left: 0.08rem;
      /* identical to box height, or 100% */
      letter-spacing: 0.04em;
    }

    .title1 {
      background: linear-gradient(180deg, #ffa06b 0%, #ff3426 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }

    .title2 {
      background: linear-gradient(180deg, #ffc700 0%, #ff8b04 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }

  .warn_stat {
    position: relative;
    padding: 0.1rem;
    width: 100%;
    height: 60%;
    //background: linear-gradient(90deg, #0953BC 0%, #042656 100%);
    background: var(--bg-linear-gradient);
  }

  .warn_stat_content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }

  .camera-warn {
    width: 100%;
    padding: 0.05rem;
    display: flex;
    justify-content: space-between;

    .camera-item {
      width: 45%;
      height: 100%;
      cursor: pointer;
    }

    .camera-item img {
      width: 100%;
      height: 80%;
    }

    .carema-item .carema-addr {
      color: var(--carema_addr_color);
      font-family: "PingFang SC";
      font-size: 0.08rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      overflow: hidden;
      /* 隐藏超出部分 */
      white-space: nowrap;
      /* 不换行 */
      text-overflow: ellipsis;
      padding-top: 0.05rem;
    }
  }

  .warn_frame {
    width: 25%;
    display: flex;
    align-items: center;
    justify-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .warn_frame p {
    color: var(--vi-00-a-0-e-9, #00a0e9);
    font-family: DINPro;
    font-size: 0.13rem;
    font-style: normal;
    font-weight: 700;
    line-height: 0.15rem;
    /* 76.923% */
  }

  .warn_frame span {
    color: var(--warn__frame__span, #c6d1db);
    font-family: "PingFang SC";
    font-size: 0.08rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .warn_stat::before,
  .warn_stat::after,
  .warn_stat_content::before,
  .warn_stat_content::after {
    content: "";
    position: absolute;
    width: 0.06rem;
    height: 0.06rem;
  }

  .warn_stat::before {
    top: 0px;
    left: 0px;
    border-top: 1px solid var(--warn_stat__border-color);
    border-left: 1px solid var(--warn_stat__border-color);
  }

  .warn_stat::after {
    top: 0px;
    right: 0px;
    border-top: 1px solid var(--warn_stat__border-color);
    border-right: 1px solid var(--warn_stat__border-color);
  }

  .warn_stat_content::before {
    bottom: 0px;
    right: 0px;
    border-bottom: 1px solid var(--warn_stat__border-color);
    border-right: 1px solid var(--warn_stat__border-color);
  }

  .warn_stat_content::after {
    bottom: 0px;
    left: 0px;
    border-bottom: 1px solid var(--warn_stat__border-color);
    border-left: 1px solid var(--warn_stat__border-color);
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

    .header {
      width: 100%;
      height: 0.2rem;
      line-height: 0.2rem;
      color: #ffffff;
      background: url("../assets/imgs/table_header_bg.png") no-repeat center;
      background-size: 100% 100%;
      font-size: 0.08rem;
      display: flex;

      .time {
        flex: 1;
        text-align: center;
      }

      .name {
        flex: 1;
        text-align: center;
      }

      .status {
        width: 0.45rem;
        text-align: center;
      }
    }

    .body {
      width: 100%;
      flex: 1;
      overflow: hidden;

      .item {
        display: flex;
        text-align: center;
        color: #fff;
        line-height: 0.25rem;
        font-size: 0.08rem;
        border-bottom: 1px dashed #084893;

        .time {
          flex: 1;
          text-align: center;
        }

        .name {
          flex: 1;
          text-align: center;
        }

        .status {
          color: #ffd700;
          width: 0.45rem;
          text-align: center;
        }
      }
    }
  }

  .device_list {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .select {
      width: 100%;
      height: 0.2rem;
      background: url("../assets/imgs/device_select_bg.png") no-repeat center;
      background-size: 100% 100%;
      margin: 0.06rem 0;

      .text {
        font-weight: bold;
        font-size: 0.08rem;
        //color: #fff;
        color: var(--text-title-color);
        text-align: left;
        line-height: 0.2rem;
        padding-left: 0.25rem;
      }
    }

    .line {
      width: 94%;
      height: 0.08rem;
      background: url("../assets/imgs/device_line.png") no-repeat center;
      background-size: 100% 100%;
      margin-bottom: 0.06rem;
    }

    .list {
      width: 100%;
      height: calc(100% - 0.46rem);
      background-size: 100% 100%;
      overflow-x: hidden;
      overflow-y: auto;
      padding-top: 0.4rem;

      .rows {
        padding: 0.1rem 0.15rem;

        :deep(.t-tree) {
          //color: #fff;
          color: var(--text-tree-colot);
          font-size: 0.08rem;
          line-height: 0.18rem;
          text-align: left;
        }

        :deep(.t-is-active) {
          //color: #ffd700;
          color: var(--text-tree-active-color);
          //background-color: transparent !important;
        }

        :deep(.t-tree__icon:hover) {
          background-color: transparent !important;
        }

        :deep(.t-tree__icon) {
          path {
            //fill: #fff;
            fill: var(--icon-tree-fill-color);
          }
        }
      }
    }
  }

  :deep(.warnDialog) {
    .t-dialog {
      background-color: transparent;
      padding: 0;
      border: none;
    }

    .t-dialog__header {
      display: none;
    }

    .t-dialog__footer {
      display: none;
    }

    .content {
      width: 5rem;
      height: 3.15rem;
      background: url("../assets/imgs/dialog_bg.png") no-repeat center;
      background-size: 100% 100%;
      position: relative;
      padding: 0.1rem 0.2rem;
      overflow: hidden;

      .close {
        position: absolute;
        right: 0.1rem;
        top: 0.07rem;
        width: 0.25rem;
      }

      .title {
        //color: #fff;
        color: var(--text-dialog-header-title-color);
        padding-left: 0.2rem;
        line-height: 0.42rem;
        font-size: 0.1rem;
        font-weight: bold;
      }

      .body {
        margin-top: 0.15rem;
        //color: #fff;
        color: var(--text-dialog-body-color);
        display: flex;
        font-size: 0.08rem;

        .lf {
          width: 2rem;
          padding-left: 0.1rem;

          img {
            width: 100%;
          }
        }

        .rt {
          flex: 1;
          padding-left: 0.2rem;
          line-height: 0.2rem;
        }
      }
    }
  }

  :deep(.videoDialog) {
    .content {
      width: 4.7rem;
      height: 2.8rem;
    }

    .t-dialog__footer {
      display: none;
    }

    .t-dialog__header {
      padding-top: 0.06rem;
      //color: #fff;
      color: var(--text-dialog-header-title-color);
    }

    .t-dialog--default {
      padding: 0.05rem 0.14rem;
      //background-color: #3d7ab9;
      background-color: var(--dialog-bg-color);
      border-color: #0f5a9b;
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    transition:
      transform 0.5s ease,
      opacity 0.5s ease;
  }

  .slide-enter {
    transform: translate(-100%, -100%);
    /* 从右上角进入 */
    opacity: 0;
    /* 透明度为零 */
  }

  .slide-leave-to {
    transform: translate(-100%, 100%);
    /* 从左下角退出 */
    opacity: 0;
    /* 透明度为零 */
  }
}
</style>
