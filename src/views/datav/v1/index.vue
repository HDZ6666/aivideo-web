<template>
  <div class="container">
    <div class="container-cover" id="container-cover">
      <div class="header">
        <div class="icon-time"></div>
        <div class="datetime">
          <div class="date">{{ dateStr }}</div>
          <div class="time">{{ timeStr }}</div>
          <div class="week">{{ weekStr }}</div>
        </div>

        <div class="header-center">
          <span class="title">{{ title }}</span>
        </div>

        <div class="header-right">
          <div class="action-item">
            <span>{{ alarmActive ? '开启' : '关闭' }}告警</span>
            <el-switch v-model="alarmActive" class="alarm-switch" />
          </div>
          <div class="action-item map-btn" @click="handleMapScreen">
            <span>地图大屏</span>
          </div>
          <div class="action-item back-btn" @click="gotoDashboard">
            <img src="@/assets/datav/v1/back.png" alt="" />
            <span>后台管理</span>
          </div>
        </div>
      </div>

      <div class="main">
        <div class="left">
          <div class="device_list">
            <div class="list">
              <div class="rows">
                <!-- 设备树列表 -->
              </div>
            </div>
          </div>
        </div>

        <div class="center">
          <div class="nav">
            <div class="item" v-for="item in statItems" :key="item.name">
              <div class="icon"><img :src="item.icon" /></div>
              <div class="text">
                <div class="value">
                  <span class="number" :class="{ 'warn-color': item.isWarn }">{{ item.value }}</span>
                  <span class="unit">个</span>
                </div>
                <div class="name">{{ item.name }}</div>
              </div>
            </div>
          </div>

          <div class="video-box">
            <div class="video-header">
              <div class="title-box">
                <div class="icon"></div>
                <div class="text">监控视频</div>
              </div>
              <div class="more">
                <div class="more-item">
                  自动轮播
                  <el-switch v-model="autoPlay" size="small" style="margin-left: 10px;" />
                </div>
                <div class="more-item">
                  画布展示
                  <el-select v-model="pageSize" size="small" class="page-select" @change="changePageSize">
                    <el-option label="四宫格" value="4" />
                    <el-option label="九宫格" value="9" />
                    <el-option label="十二宫格" value="12" />
                  </el-select>
                </div>
                <div class="more-item fullscreen-btn" @click="toggleFullscreen">
                  全屏
                  <span class="fullscreen-icon"></span>
                </div>
              </div>
            </div>
            <div class="video-content">
              <div class="videos">
                <div class="row">
                  <div
                    :class="{
                      col: true,
                      col2: pager.pageSize == 4,
                      col3: pager.pageSize == 9,
                      col4: pager.pageSize == 12,
                    }"
                    v-for="(item, index) in cameraList"
                    :key="index"
                  >
                    <div class="player">
                      <div class="video-wrapper">
                        <div class="video-placeholder">
                          <span class="play-icon">▶</span>
                        </div>
                      </div>
                    </div>
                    <div class="video-name">{{ item.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pager">
            <div class="rt">
              <div class="button" @click="onPage(-1)">上一屏</div>
              <div class="pageNum">{{ pager.pageIndex }} / {{ pager.totalPage }}</div>
              <div class="button" @click="onPage(1)">下一屏</div>
            </div>
          </div>
        </div>

        <div class="right">
          <div class="box box1">
            <div class="box-header">
              <span class="box-title">告警统计</span>
              <span class="box-more">详情</span>
            </div>
            <div class="box-content">
              <div class="warn_stat_box" v-for="(item, index) in alarmStatistics" :key="index">
                <div class="warn_stat_title">
                  <img src="@/assets/datav/v1/warnstat1.png" alt="" />
                  <span class="title title1">{{ item.alarmTypeName }}</span>
                </div>
                <div class="warn_stat">
                  <div class="warn_stat_content">
                    <div class="warn_frame">
                      <p>{{ item.curDateAlarmCount }}</p>
                      <span>当日告警数</span>
                    </div>
                    <div class="warn_frame">
                      <p class="untreated">{{ item.curDateAlarmNoHandleCount }}</p>
                      <span>当日未处理</span>
                    </div>
                    <div class="warn_frame">
                      <p>{{ item.sevenDayAlarmCount }}</p>
                      <span>近7天告警数</span>
                    </div>
                    <div class="warn_frame">
                      <p>{{ item.sevenDayAlarmNoHandleCount }}</p>
                      <span>近7天未处理</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box box2">
            <div class="box-header">
              <span class="box-title">摄像头告警</span>
              <span class="box-more">详情</span>
            </div>
            <div class="box-content">
              <div class="camera-warn">
                <!-- 摄像头告警列表 -->
              </div>
            </div>
          </div>

          <div class="box box3">
            <div class="box-header">
              <span class="box-title">告警趋势</span>
            </div>
            <div class="box-content">
              <div class="chart-label">告警数量：次</div>
              <div id="chartGJQS" class="chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import autofit from "autofit.js";
import deviceTotal from "@/assets/datav/v1/device_total.png";
import deviceOnline from "@/assets/datav/v1/device_online.png";
import warnTodo from "@/assets/datav/v1/warn_todo.png";
import warnTotal from "@/assets/datav/v1/warn_total.png";

const title = ref('监控驾驶舱')
const alarmActive = ref(false)
const dateStr = ref('')
const timeStr = ref('')
const weekStr = ref('')
let timer = null

const weekMap = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const statItems = ref([
  { icon: deviceTotal, name: '设备总数', value: 4, isWarn: false },
  { icon: deviceOnline, name: '在线设备数', value: 4, isWarn: false },
  { icon: warnTodo, name: '未处理告警数', value: 0, isWarn: true },
  { icon: warnTotal, name: '告警总数', value: 0, isWarn: false },
])

const pager = ref({
  pageIndex: 1,
  pageSize: 4,
  totalPage: 1,
})

const autoPlay = ref(true)
const pageSize = ref('4')
const isFullscreen = ref(false)

const cameraList = ref([
  { id: 1, name: '摄像头1-入口通道', videoUrl: '' },
  { id: 2, name: '摄像头2-大厅区域', videoUrl: '' },
  { id: 3, name: '摄像头3-后门通道', videoUrl: '' },
  { id: 4, name: '摄像头4-停车场', videoUrl: '' },
])

const changePageSize = (val) => {
  pager.value.pageSize = parseInt(val)
  pager.value.pageIndex = 1
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const alarmStatistics = ref([
  {
    alarmTypeName: '烟雾烟火',
    curDateAlarmCount: 0,
    curDateAlarmNoHandleCount: 0,
    sevenDayAlarmCount: 0,
    sevenDayAlarmNoHandleCount: 0,
  },
  {
    alarmTypeName: '通道占用',
    curDateAlarmCount: 0,
    curDateAlarmNoHandleCount: 0,
    sevenDayAlarmCount: 0,
    sevenDayAlarmNoHandleCount: 0,
  },
])

const onPage = (val) => {
  if (val > 0) {
    if (pager.value.pageIndex < pager.value.totalPage) {
      pager.value.pageIndex++
    }
  } else {
    if (pager.value.pageIndex > 1) {
      pager.value.pageIndex--
    }
  }
}

const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  dateStr.value = `${year}年${month}月${day}`

  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  timeStr.value = `${hour}:${minute}:${second}`

  weekStr.value = weekMap[now.getDay()]
}

const gotoDashboard = () => {
  const currentHref = window.top.location.href
  const newUrl = currentHref.replace(/#.*$/, '#/index')
  window.top.location.href = newUrl
}

const handleMapScreen = () => {
  console.log('跳转地图大屏')
}

onMounted(() => {
  updateDateTime()
  // autofit.init({
  //   dh: 919,
  //   dw: 1920,
  //   el: "#container-cover",
  //   resize: false,
  // });
  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
  autofit.off()
})
</script>
<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: no-repeat center url("@/assets/datav/v1/home-bg.png");
  user-select: none;
  transition: all 0.5s ease-in;
}

.container-cover {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  background: radial-gradient(48.84% 50.6% at 50% 48.19%,
      rgba(0, 144, 225, 0.35) 0%,
      rgba(5, 118, 223, 0.03) 100%), #000;
}

.header {
  position: absolute;
  width: 1920px;
  z-index: 10;
  height: 119px;
  background: url("@/assets/datav/v1/head_bg.png") no-repeat center top;
  background-size: 1920px 119px;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
}

.icon-time {
  position: absolute;
  top: 14px;
  left: 19px;
  width: 29px;
  height: 29px;
  background: url("@/assets/datav/v1/time.png") no-repeat;
  background-size: 100% 100%;
}

.datetime {
  position: absolute;
  top: 0;
  left: 10px;
  font-size: 15px;
  line-height: 59px;
  color: #fff;
  display: flex;

  .time {
    font-size: 17px;
    width: 111px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
  }

  .date {
    font-size: 17px;
    width: 154px;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
  }

  .week {
    width: 111px;
    overflow: hidden;
    white-space: nowrap;
  }
}

.header-center {
  height: 37px;
  margin: 15px auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background: #fff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: ysbthFont;
  font-size: 38px;

  .title {
    font-size: inherit;
    font-weight: 400;
  }
}

.header-right {
  position: absolute;
  top: 11px;
  right: 0;
  display: flex;
  width: 504px;

  .item {
    width: 96px;

    img {
      width: 100%;
    }
  }

  .action-item {
    display: flex;
    font-size: 17px;
    margin-right: 19px;
    color: #fff;
    align-items: center;
    cursor: pointer;
    padding: 3.8px 9.6px;

    &:hover {
      background-color: #ffffff1a;
      transform: translateY(-1px);
    }

    img {
      margin-right: 6px;
      width: 19px;
      height: 19px;
    }

    &.btn:hover {
      color: #7dd3fc;
    }
  }

  .alarm-switch {
    margin-left: 10px;
    --el-switch-on-color: #00d4ff;
    --el-switch-off-color: #4a5568;
  }

  .back-btn {
    margin-left: auto;
  }
}

.main {
  position: absolute;
  left: 0;
  width: 1920px;
  bottom: 0;
  top: 119px;
  pointer-events: all;
}

.left {
  position: absolute;
  width: 305px;
  top: -38px;
  left: 19px;
  bottom: 19px;
  background: url("@/assets/datav/v1/left-bg.png") no-repeat;
  background-size: 100% 100%;

  .device_list {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .list {
      width: 100%;
      height: calc(100% - 88px);
      overflow-x: hidden;
      overflow-y: auto;
      padding-top: 77px;

      .rows {
        padding: 19px 29px;
        color: #fff;
        font-size: 15px;
      }
    }
  }
}

.right {
  position: absolute;
  width: 497px;
  top: -38px;
  right: 19px;
  bottom: 38px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 19px;

  .box {
    position: relative;
    background: url("@/assets/datav/v1/card_box_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
  }

  .box1 {
    flex: 1.5;
  }

  .box2, .box3 {
    flex: 1;
  }

  .box-header {
    position: relative;
    width: 100%;
    height: 45px;
    background: url("@/assets/datav/v1/card_title_bg.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    box-sizing: border-box;

    &::before {
      content: '';
      position: absolute;
      width: 21px;
      height: 27px;
      top: 10px;
      left: 10px;
      background: url("@/assets/datav/v1/box_title_icon.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .box-title {
    color: #fff;
    text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
    font-family: ysbthFont;
    font-size: 21px;
    font-weight: 400;
  }

  .box-more {
    color: #7cbfff;
    font-family: "PingFang SC";
    font-size: 17px;
    font-weight: 400;
    padding-right: 10px;
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }

  .box-content {
    position: absolute;
    top: 50px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    overflow: hidden;
  }
}

.center {
  position: absolute;
  left: 324px;
  right: 535px;
  top: -19px;
  bottom: 19px;
  display: flex;
  flex-direction: column;

  .nav {
    width: 991px;
    margin: 31px auto;
    display: flex;

    .item {
      width: 269px;
      height: 81px;
      display: flex;

      .icon {
        width: 61px;
        line-height: 100px;
        text-align: center;

        img {
          width: 100%;
        }
      }

      .text {
        flex: 1;
        padding: 0 10px;
        font-size: 16px;

        .value {
          margin-top: -8px;

          .number {
            font-size: 27px;
            padding-right: 5px;
            color: #f2f6fa;
            font-family: DINPro, sans-serif;
            font-weight: 700;
          }

          .number.warn-color {
            color: #ff6b6b;
          }

          .unit {
            color: #a0aec0;
            font-size: 15px;
          }
        }

        .name {
          color: #a0aec0;
          font-size: 17px;
        }
      }
    }

    .item:not(:first-child) {
      margin-left: 19px;
    }
  }

  .video-box {
    position: relative;
    flex: 1;
    background: url("@/assets/datav/v1/card_box_bg.png") no-repeat center;
    background-size: 100% 100%;

    .video-header {
      position: relative;
      width: 100%;
      height: 49px;
      background: url("@/assets/datav/v1/camera_box_bg.png") no-repeat center;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 40px;
      padding-right: 19px;
      box-sizing: border-box;
      color: #fff;

      .title-box {
        display: flex;
        align-items: center;

        .icon {
          position: absolute;
          width: 23px;
          height: 29px;
          top: 10px;
          left: 10px;
          background: url("@/assets/datav/v1/box_title_icon.png") no-repeat;
          background-size: 100% 100%;
        }

        .text {
          color: #fff;
          text-shadow: 0px 0px 4px rgba(21, 142, 255, 0.70);
          font-family: ysbthFont;
          font-size: 21px;
          font-weight: 400;
          width: 192px;
        }
      }

      .more {
        display: flex;
        align-items: center;
        font-size: 17px;
        font-weight: normal;

        .more-item {
          display: flex;
          align-items: center;
          margin-left: 19px;

          .fullscreen-icon {
            display: inline-block;
            width: 23px;
            height: 23px;
            background: url("@/assets/datav/v1/fullscreen.png") no-repeat;
            margin-left: 10px;
            background-size: 100% 100%;
          }

          .page-select {
            margin-left: 19px;
            width: 115px;

            :deep(.el-input) {
              height: 38px;
              border: 1px solid #0071bc;
              background: transparent;
            }

            :deep(.el-input__inner) {
              font-size: 15px;
              color: #fff;
              text-align: center;
            }
          }
        }

        .fullscreen-btn {
          cursor: pointer;

          &:hover {
            color: #00d4ff;
          }
        }
      }
    }

    .video-content {
      position: absolute;
      top: 50px;
      bottom: 10px;
      left: 10px;
      right: 10px;
      overflow: hidden;

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
            overflow: hidden;
            padding: 0 8px 0 8px;
            box-sizing: border-box;

            .player {
              height: calc(100% - 38px);
              padding: 12px 6px;
              background: url("@/assets/datav/v1/video_bg.png") no-repeat;
              background-size: 100% 100%;
              box-sizing: border-box;
            }

            .video-wrapper {
              width: 100%;
              height: 100%;
              border: 1px solid #1fc6ff;
              border-top-left-radius: 5px;
              border-top-right-radius: 5px;
              overflow: hidden;
              box-sizing: border-box;

              .video-placeholder {
                width: 100%;
                height: 100%;
                background: linear-gradient(180deg, #0a1628 0%, #0d2137 100%);
                display: flex;
                align-items: center;
                justify-content: center;

                .play-icon {
                  width: 67px;
                  height: 42px;
                  line-height: 42px;
                  text-align: center;
                  background: rgba(0, 0, 0, 0.6);
                  border: 1px solid rgba(255, 255, 255, 0.3);
                  border-radius: 8px;
                  color: #fff;
                  font-size: 19px;
                  cursor: pointer;

                  &:hover {
                    background: rgba(0, 100, 200, 0.6);
                  }
                }
              }
            }

            .video-name {
              width: 100%;
              text-align: center;
              height: 38px;
              line-height: 38px;
              color: #fff;
              font-size: 15px;
            }
          }

          .col2 {
            width: 50%;
            height: 50%;
          }

          .col3 {
            width: 33.333%;
            height: 33.333%;
          }

          .col4 {
            width: 25%;
            height: 33.333%;
          }
        }
      }
    }
  }

  .pager {
    width: 100%;
    padding: 10px 19px;
    display: flex;
    color: #a0aec0;
    font-size: 15px;

    .rt {
      flex: 1;
      justify-content: right;
      display: flex;
      align-items: center;
    }

    .button {
      width: 96px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: rgba(0, 100, 200, 0.5);
      border: 1px solid rgba(0, 150, 255, 0.5);
      border-radius: 4px;
      margin-left: 8px;
      cursor: pointer;
      color: #fff;

      &:hover {
        background: rgba(0, 150, 255, 0.5);
      }
    }

    .pageNum {
      line-height: 38px;
      font-size: 15px;
      padding: 0 6px 0 12px;
    }
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

  img {
    width: 23px;
  }

  .title {
    font-family: ysbthFont;
    font-weight: 400;
    font-size: 19px;
    padding-top: 4px;
    padding-left: 15px;
    letter-spacing: 0.04em;
  }

  .title1 {
    background: linear-gradient(180deg, #ffa06b 0%, #ff3426 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.warn_stat {
  position: relative;
  padding: 19px;
  width: 100%;
  height: 60%;
  background: linear-gradient(90deg, #0953bc 0%, #042656 100%);
}

.warn_stat_content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.warn_frame {
  width: 25%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  p {
    color: #00a0e9;
    font-family: DINPro, sans-serif;
    font-size: 25px;
    font-weight: 700;
    line-height: 29px;
    margin: 0;
  }

  p.untreated {
    color: #ff6b6b;
  }

  span {
    color: #c6d1db;
    font-size: 15px;
  }
}

.warn_stat::before,
.warn_stat::after,
.warn_stat_content::before,
.warn_stat_content::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
}

.warn_stat::before {
  top: 0;
  left: 0;
  border-top: 1px solid #00d4ff;
  border-left: 1px solid #00d4ff;
}

.warn_stat::after {
  top: 0;
  right: 0;
  border-top: 1px solid #00d4ff;
  border-right: 1px solid #00d4ff;
}

.warn_stat_content::before {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid #00d4ff;
  border-right: 1px solid #00d4ff;
}

.warn_stat_content::after {
  bottom: 0;
  left: 0;
  border-bottom: 1px solid #00d4ff;
  border-left: 1px solid #00d4ff;
}

.camera-warn {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.chart-label {
  color: #a0aec0;
  position: absolute;
  font-size: 14px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
