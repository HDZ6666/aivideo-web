<template>
  <div class="videoList-container">
    <el-row>
      <el-col :span="24">
        <div class="videoList-control-box">
          <div>
            <span>
              当前轮播:
              <el-tag effect="dark">{{ `第${loopPlayerIndex}屏` }}</el-tag>
            </span>
          </div>
          <div class="videoList-control-btn">
            <el-select v-model="splitNum" @change="changeSplitNum" style="width: 150px;">
              <el-option :value="4" label="4宫格"></el-option>
              <el-option :value="9" label="9宫格"></el-option>
              <el-option :value="12" label="12宫格"></el-option>
              <el-option :value="16" label="16宫格"></el-option>
            </el-select>
            <el-button
              type="primary"
              style="background: #6c7797;margin-left:10px"
              @click="screenAction('prev')"
            >上一屏</el-button>
            <el-button type="primary" style="background: #6c7797;" @click="screenAction('next')">下一屏</el-button>
            <el-button type="danger" @click="screenAction('stop')" v-if="isAutoScreen">停止轮播</el-button>
            <el-button
              type="primary"
              style="background: #475998;"
              @click="screenAction('auto')"
              v-else
            >自动轮播</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="player-list">
      <el-row>
        <el-col
          :span="24/colSpan"
          v-for="(player,index) in playList"
          :key="`${splitNum}宫格_${index}`"
          class="palyer-box"
        >
          <div class="video-out-container" :style="{width:`${videoWidthPX}px`}">
            <div class="video-inner-container">
              <dv-border-box-12 class="player-border">
                <div
                  class="video-box"
                  v-loading="player.loading"
                  :loading.sync="player.loading"
                  element-loading-text="加载中..."
                  element-loading-background="#000"
                  v-if="playerType === 'liveplayer'"
                >
                  <LivePlayer
                    ref="livePlayer"
                    :video-title="player.name"
                    :videoUrl="player.videoUrl"
                    :hasaudio="false"
                    :alt="player.error?'视频加载失败':'无信号'"
                    live
                    muted
                    aspect="fullscreen"
                    stretch
                    hide-big-play-button
                    hide-stretch-button
                    :controls="false"
                    @play="onPlayerPlay($event,player,index)"
                    @error="onPlayerError($event,player,index)"
                  ></LivePlayer>
                </div>
                <div class="video-box" v-if="playerType === 'jessibuca'">
                  <player
                    v-if="player.videoUrl"
                    ref="player"
                    :videoUrl="player.videoUrl"
                    hideControls
                    screen
                  />
                </div>
              </dv-border-box-12>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import player from "../common/jessibuca.vue";

import LivePlayer from "@liveqing/liveplayer";
import rtcPlayer from "../dialog/rtcPlayer.vue";
import img from "../../assets/image.png";
import { mixin } from "../../utils/mixin";

export default {
  name: "videoList",
  components: { LivePlayer, rtcPlayer, player },
  mixins: [mixin],
  data() {
    return {
      loopPlayerTimeOut: null,
      getListLoading: false,
      pages: 1, //默认分页数
      total: -1, //默认总数
      loopPlayerIndex: 0, //当前轮播的屏数
      requesttime: 3, // 请求数据时间
      looptime: 5 * 60, //轮播间隔时间
      splitNum: 9, //分屏数 [1,4,9,12,16]
      videoLists: [], //视频列表
      playList: [], //播放器列表
      deviceList: [], //设备列表
      img: img, //播放器封面
      isAutoScreen: false //是否自动轮播
    };
  },
  computed: {
    colSpan() {
      return Math.ceil(Math.sqrt(this.splitNum));
    },
    videoHeightPX() {
      return Math.floor(500 / (this.splitNum / this.colSpan));
    },
    videoWidthPX() {
      return Math.floor(this.videoHeightPX * (16 / 9));
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      this.playList = new Array(this.splitNum).fill({
        id: "",
        name: "",
        videoUrl: "",
        loading: false,
        error: false
      });
      this.getDeviceList();
    },
    changeSplitNum(num) {
      this.reset();
      this.init();
    },
    reset() {
      this.videoLists = []; //视频列表
      this.playList = []; //播放器列表
      this.deviceList = []; //设备列表
      this.loopPlayerIndex = 0;
      this.isAutoScreen = false;
      if (this.loopPlayerTimeOut) {
        clearInterval(this.loopPlayerTimeOut);
      }
    },
    // 获取设备列表
    getDeviceList: function(page = 1) {
      // 超过就不请求
      const _page = this.total == -1 ? 1 : page; //初始化页
      const _pageSize = this.splitNum > 10 ? this.splitNum : 10; //每页条数
      if (this.total == 0) return; //无数据
      if (_page > this.pages) return; //最后一页

      this.getListLoading = true;
      this.$axios({
        method: "get",
        url: `/cockpit/api/proxy/list`,
        params: {
          page: _page,
          pageSize: _pageSize
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const data = res.data.data;
            const list = data.list.map(item => {
              return {
                name: item.name,
                id: item.app + item.stream,
                deviceId: item.deviceId || "",
                channelId: item.channelId || "",
                videoUrl: item.streamInfo.ws_flv.url,
                getVideoUrl: false,
                loading: false,
                error: false
              };
            });
            this.pages = data.pages;
            this.total = data.total;
            this.videoLists = [...this.videoLists, ...list];
            if (_page === 1 && this.videoLists.length > 0) {
              this.nextScreen(); //首屏自动加载
              console.log("首屏自动加载");
            }
            // 循环获取设备列表
            this.getDeviceList(_page + 1);
            // this.deviceList = list;
            // this.deviceList.forEach(item => {
            //   this.sendDevicePush(item, _page);
            // });
          }
        })
        .finally(() => {
          this.getListLoading = false;
        });
    },
    sendDevicePush: function(itemData, page) {
      let deviceId = itemData.deviceId;
      let channelId = itemData.channelId;
      const that = this;
      that
        .$axios({
          method: "get",
          url: "/api/play/start/" + deviceId + "/" + channelId
        })
        .then(function(res) {
          if (res.data.code === 0 && res.data.data) {
            let videoUrl;
            if (location.protocol === "https:") {
              videoUrl = res.data.data.wss_flv;
            } else {
              videoUrl = res.data.data.ws_flv;
            }
            itemData.videoUrl = videoUrl;
          }
        })
        .finally(() => {
          itemData.getVideoUrl = true;
          console.log(itemData);
          // 全部都获取一次url了
          if (this.deviceList.every(item => item.getVideoUrl)) {
            this.videoLists = [...this.videoLists, ...this.deviceList];
            if (page === 1 && this.videoLists.length > 0) {
              this.loopPlayer(); //首屏自动加载
              console.log("首屏自动加载");
            }
            // 循环获取设备列表
            this.getDeviceList(page + 1);
          }
        });
    },
    // 获取通道列表
    getChannelList: function(app, stream) {},
    screenAction(tyep) {
      if (this.videoLists.length === 0) {
        this.$message.error("当前没有播放资源");
        return;
      }
      if (this.total > -1 && this.total < this.splitNum) {
        //数据少于分屏数
        this.$message.error(`可播放资源少于${this.splitNum}个`);
        return;
      }
      if (this.loopPlayerTimeOut) {
        clearInterval(this.loopPlayerTimeOut);
      }
      this.isAutoScreen = false;
      switch (tyep) {
        case "next":
          this.nextScreen();
          break;
        case "prev":
          this.prevScreen();
          break;
        case "auto":
          this.autoScreen();
          break;
        case "stop":
          this.$message.success(`停止轮播`);
          break;
      }
    },
    // 播放一屏
    loopPlayer: function() {
      const num = this.splitNum; //分屏数
      const pageSize = Math.ceil(this.videoLists.length / num); // 总页数
      if (this.loopPlayerIndex > pageSize) {
        this.loopPlayerIndex = 1;
      }
      if (this.loopPlayerIndex < 1) {
        this.loopPlayerIndex = pageSize;
      }

      const playIndex = this.loopPlayerIndex - 1;
      const list = this.videoLists.slice(
        playIndex * num,
        playIndex * num + num
      );
      const list2 = new Array(num - list.length).fill({
        id: "",
        name: "",
        videoUrl: "",
        loading: false,
        error: false
      });
      this.playList = [...list, ...list2].map(item => {
        if (item.videoUrl) {
          item.loading = true;
        }
        return item;
      });
    },
    // 下一屏
    nextScreen: function() {
      //如果下一屏
      this.loopPlayerIndex++;
      this.loopPlayer();
    },
    // 上一屏
    prevScreen: function() {
      this.loopPlayerIndex--;
      this.loopPlayer();
    },
    // 自动轮播
    autoScreen: function() {
      this.$message.success(`开始轮播，轮播间隔${this.looptime}秒`);
      this.isAutoScreen = true;
      this.loopPlayerTimeOut = setInterval(() => {
        this.loopPlayerIndex++;
        this.loopPlayer();
      }, this.looptime * 1000);
    },
    // 播放器加载完成
    onPlayerPlay: function(e, player, index) {
      if (player.loading) {
        this.playList = [...this.playList].map((item, _index) => {
          if (index === _index) {
            item.loading = false;
          }
          return item;
        });
      }
    },
    // 播放器错误
    onPlayerError: function(e, player, index) {
      if (player.loading) {
        this.playList = [...this.playList].map((item, _index) => {
          if (index === _index) {
            item.videoUrl = ""; // 错误的话把URL置空
            item.loading = false;
            item.error = true;
          }
          return item;
        });
      }
    }
  },
  destroyed() {
    this.reset();
  }
};
</script>

<style scoped>
.videoList-container {
  flex: 1;
  width: 100%;
  padding-bottom: 1%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.videoList-control-box {
  display: flex;
  align-items: center;
  padding: 10px 0px;
}

.videoList-control-btn {
  flex: 1;
  text-align: right;
}


/* .control-btn{
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
} */

.player-list {
  flex: 1;
  display: flex;
}
.palyer-box {
  padding: 1px;
}
.video-out-container {
  max-width: 100%;
  padding-top: 56.25%;
  position: relative;
}
.video-inner-container {
  position: absolute;
  inset: 0;
}

.video-box {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  background-color: #000;
}

.player-border {
  max-width: 100%;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
}
</style>
