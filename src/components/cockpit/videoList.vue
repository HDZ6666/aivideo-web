<template>
  <div class="videoList-container">
    <el-row>
      <el-col :span="24">
        <div class="control-box">
          <div>
            <span>
              当前轮播:
              <el-tag effect="dark">{{ `第${loopPlayerIndex}屏` }}</el-tag>
            </span>
          </div>
          <div>
            <el-button type="primary" style="background: #6c7797;" @click="nextScreen">手动轮播</el-button>
            <el-button type="danger" @click="stopScreen" v-if="isAutoScreen">停止轮播</el-button>
            <el-button type="primary" style="background: #475998;" @click="autoScreen" v-else>自动轮播</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24/colSpan" v-for="(player,index) in playList" :key="index" class="palyer-box">
        <dv-border-box-12 class="player-border">
          <div
            class="video-box"
            v-loading="player.loading"
            :loading.sync="player.loading"
            element-loading-text="加载中..."
            element-loading-background="#000"
          >
            <LivePlayer
              ref="livePlayer"
              :video-title="player.name"
              :videoUrl="player.videoUrl"
              :hasaudio="false"
              :alt="player.error?'视频加载失败':'无信号'"
              live
              muted
              stretch
              hide-big-play-button
              hide-stretch-button
              :controls="false"
              @play="onPlayerPlay($event,player,index)"
              @error="onPlayerError($event,player,index)"
            ></LivePlayer>
          </div>
        </dv-border-box-12>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import player from "../common/jessibuca.vue";

import LivePlayer from "@liveqing/liveplayer";
import rtcPlayer from "../dialog/rtcPlayer.vue";
import img from "../../assets/image.png";

export default {
  name: "videoList",
  components: { LivePlayer, rtcPlayer },
  data() {
    return {
      requestTimer: null,
      loopPlayerTimeOut: null,
      getListLoading: false,
      pages: 1, //默认分页数
      total: -1, //默认总数
      loopPlayerIndex: 0, //当前轮播的屏数
      requesttime: 3, // 请求数据时间
      looptime: 5 * 60, //轮播间隔时间
      splitNum: 12, //分屏数
      videoLists: [], //视频列表
      playList: [], //播放器列表
      img: img, //播放器封面
      isAutoScreen: false //是否自动轮播
    };
  },
  computed: {
    colSpan() {
      return Math.ceil(Math.sqrt(this.splitNum));
    }
  },

  mounted() {
    this.playList = new Array(this.splitNum).fill({
      id: "",
      name: "",
      videoUrl: "",
      loading: false,
      error: false
    });
    this.getDeviceList();
  },
  methods: {
    // 获取设备列表
    getDeviceList: function(page = 1) {
      // 超过就不请求
      const _page = this.total == -1 ? 1 : page; //初始化页
      if (this.total == 0) return; //无数据
      if (_page > this.pages) return; //最后一页

      this.getListLoading = true;
      this.$axios({
        method: "get",
        url: `/cockpit/api/proxy/list`,
        params: {
          page: _page,
          pageSize: this.splitNum
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const data = res.data.data;
            const list = data.list.map(item => {
              return {
                name: item.name,
                id: item.app + item.stream,
                videoUrl: item.streamInfo.ws_flv.url,
                loading: false,
                error: false
              };
            });
            this.videoLists = [...this.videoLists, ...list];
            this.pages = data.pages;
            this.total = data.total;
            if (_page === 1 && this.videoLists.length > 0) {
              this.loopPlayer(); //首屏自动加载
              console.log("首屏自动加载");
            }
            // 循环获取设备列表
            this.getDeviceList(_page + 1);
          }
        })
        .finally(() => {
          this.getListLoading = false;
        });
    },
    // 播放一屏
    loopPlayer: function() {
      const num = this.splitNum; //分屏数
      const pageSize = Math.ceil(this.videoLists.length / num); // 总页数
      if (this.loopPlayerIndex > pageSize - 1) {
        this.loopPlayerIndex = 0;
      }
      const list = this.videoLists.slice(
        this.loopPlayerIndex * num,
        this.loopPlayerIndex * num + num
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
      this.loopPlayerIndex++;
    },
    // 手动轮播
    nextScreen: function() {
      if (this.videoLists.length === 0) {
        this.$message.error("当前没有播放资源");
        return;
      }
      if (this.loopPlayerTimeOut) {
        clearTimeout(this.loopPlayerTimeOut);
      }
      this.loopPlayer();
    },
    // 自动轮播
    autoScreen: function() {
      // 已经请求了
      if (this.videoLists.length === 0) {
        this.$message.error("当前没有播放资源");
        return;
      }
      if (this.total > -1 && this.total < this.splitNum) {
        //数据少于分屏数
        this.$message.error(`可播放资源少于${this.splitNum}个，无法自动轮播`);
        return;
      }
      this.$message.success(`开始轮播，轮播间隔${this.looptime}秒`);
      this.isAutoScreen = true;
      this.loopPlayer();
      if (this.loopPlayerTimeOut) {
        clearInterval(this.loopPlayerTimeOut);
      }
      this.loopPlayerTimeOut = setInterval(() => {
        this.loopPlayer();
      }, this.looptime * 1000);
    },
    // 停止轮播
    stopScreen: function() {
      if (this.loopPlayerTimeOut) {
        clearInterval(this.loopPlayerTimeOut);
      }
      this.isAutoScreen = false;
      this.$message.success(`停止轮播`);
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
  }
};
</script>

<style scoped>
.videoList-container {
  /* flex: 1; */
  width: 100%;
  /* height: 450px; */
  /* height: 60%; */
  /* height: 540px; */
  /* display: flex;
  flex-direction: row; */
  /* flex-wrap: wrap; */
  /* justify-content: center;
  align-items: center; */
  padding-bottom: 1%;
  box-sizing: border-box;
}
.palyer-box {
  padding: 2px;
}
/* .palyer-box:last-child {
  margin-bottom: 0;
} */

.video-box {
  width: 100%;
  height: 100%;
  /* width: calc(100% - 10px);
  height: calc(100% - 10px); */
  /* width: 48%;
  height: 48%;
  margin: 1%; */
  /* border: 1px solid #fff; */
  /* background: #000; */
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  /* margin: 20px; */
}
.video-content {
  height: 0;
  padding-bottom: 56.25%;
  position: relative;
}

.player-content {
  position: absolute;
  inset: 0;
  background-image: url("/static/images/video.jpeg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.player-border {
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
  /* position: absolute; */
  /* left: -5px;
  top: -5px; */
  /* width: calc(100% + 10px);
  height: calc(100% + 10px); */
}
.control-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  text-align: right;
}
</style>
