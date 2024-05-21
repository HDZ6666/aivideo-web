<template>
  <div class="videoList-container">
    <el-row style="width: 100%;height: 100%;" :gutter="10">
      <!-- <el-col
        :span="24"
      >{{`当前轮播第${loopPlayerIndex}屏:[${playList.map(item => item.deviceName).join(',')}]`}}</el-col>-->
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
            <el-button type="primary" style="background: #475998;" @click="autoScreen">自动轮播</el-button>
          </div>
        </div>
      </el-col>
      <el-col
        :span="24/splitNum"
        v-for="(player,index) in playList"
        :key="index"
        :style="{height: `calc(${Math.floor(100/splitNum)}% - 10px)`,marginBottom: '10px'}"
      >
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
              aspect="fullscreen"
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
      requesttime: 10,
      looptime: 20,
      splitNum: 3,
      videoLists: [],
      playList: [],
      img: img
    };
  },
  computed: {
    // playList() {
    //   return new Array(Math.pow(this.splitNum, 2)).join({ ws_flv: "" });
    // }
  },

  mounted() {
    // console.log(this.playList)
    this.playList = new Array(Math.pow(this.splitNum, 2)).fill({
      name: "",
      id: "",
      videoUrl: "",
      loading: false,
      error: false
    });

    const list = [
      {
        id: "app226-15",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-152.live.flv"
      },
      {
        id: "app226-14",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-14.live.flv"
      },
      {
        id: "app226-13",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-13.live.flv"
      },
      {
        id: "app226-12",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-12.live.flv"
      },
      {
        id: "app226-11",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-11.live.flv"
      },
      {
        id: "app226-10",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-10.live.flv"
      },
      {
        id: "app226-9",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-9.live.flv"
      },
      {
        id: "app226-8",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-8.live.flv"
      },
      {
        id: "app226-7",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-7.live.flv"
      },
      {
        id: "app226-6",
        videoUrl: "http://10.16.139.254:10005/app/10.16.147.226-6.live.flv"
      }
    ];

    // setTimeout(() => {
    //   this.videoLists = list;
    //   this.total = 10;
    // }, 1000);
    this.getDeviceList();
    // this.changeVideo();
  },
  methods: {
    getDeviceList: function(page = 1) {
      // 超过就不请求
      const _page = this.total == -1 ? 1 : page; //初始化页
      if (this.total == 0) return; //无数据
      if (_page > this.pages) return; //最后一页
      // console.log("第" + _page + "页", this.videoLists);
      // this.getListLoading = true;
      this.$axios({
        method: "get",
        url: `/cockpit/api/proxy/list`,
        params: {
          page: _page,
          pageSize: 9
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
            if (this.videoLists.length === this.total) {
              //全部加载完毕
              this.getListLoading = true;
            }
            if (page === 1 && this.videoLists.length > 0) {
              this.loopPlayer(); //首屏自动加载
            }
          }
        })
        .finally(() => {
          // this.getListLoading = false;
        });
      if (this.requestTimer) clearTimeout(this.requestTimer);
      this.requestTimer = setTimeout(() => {
        this.getDeviceList(_page + 1);
      }, this.requesttime * 1000);
    },
    getVideoList: function(player) {
      this.$axios({
        method: "get",
        url: `/cockpit/api/proxy/getPlayUrl`,
        params: {
          app: player.app,
          stream: player.stream
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const data = res.data.data;
            player.ws_flv = data.ws_flv;
          }
        })
        .finally(() => {
          // dialogObj.handleLoading = false;
        });
    },
    loopPlayer: function() {
      const num = Math.pow(this.splitNum, 2); //分屏数
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
    // 轮播
    changeVideo: function(index = 0) {
      const num = Math.pow(this.splitNum, 2); //9
      const _loopTime = this.total === -1 ? 2 : this.looptime; //默认获取数据时间
      let _index = this.total === -1 ? 0 : index; //默认轮播次数

      if (this.videoLists.length > 0) {
        const pageSize = Math.ceil(this.videoLists.length / num); // 总页数
        if (_index > pageSize - 1) {
          _index = 0;
        }
        const list = this.videoLists.slice(_index * num, _index * num + num);
        const list2 = new Array(num - list.length).fill({
          id: "",
          videoUrl: "",
          loading: false
        });
        this.playList = [...list, ...list2];
      }
      if (this.total !== -1 && this.total < num) return; //数据少于分屏数不轮播

      if (this.loopPlayerTimeOut) {
        clearTimeout(this.loopPlayerTimeOut);
      }
      this.loopPlayerTimeOut = setTimeout(() => {
        this.changeVideo(_index + 1);
      }, _loopTime * 1000);
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
      if (this.total > -1) {
        if (this.videoLists.length === 0) {
          this.$message.error("当前没有播放资源");
          return;
        }
        const num = Math.pow(this.splitNum, 2); //分屏数
        if (this.total < num) {
          //数据少于分屏数
          this.$message.error(`可播放资源少于${num}个，无法自动轮播`);
          return;
        }
        this.loopPlayer();
      }
      const _loopTime = this.total > -1 ? this.looptime : 2; //默认获取数据时间
      if (this.loopPlayerTimeOut) {
        clearTimeout(this.loopPlayerTimeOut);
      }
      this.loopPlayerTimeOut = setTimeout(() => {
        this.autoScreen();
      }, _loopTime * 1000);
    },
    // 播放器加载完成
    onPlayerPlay: function(e, palyer, index) {
      if (palyer.loading) {
        this.playList = [...this.playList].map((item, _index) => {
          if (index === _index) {
            item.loading = false;
          }
          return item;
        });
        console.log("播放器加载完成", palyer);
      }
    },
    // 播放器错误
    onPlayerError: function(e, palyer, index) {
      if (palyer.loading) {
        this.playList = [...this.playList].map((item, _index) => {
          if (index === _index) {
            item.videoUrl = ""; // 错误的话把URL置空
            item.loading = false;
            item.error = true;
          }
          return item;
        });
        console.log("播放器错误：", palyer);
      }
    }
  }
};
</script>

<style scoped>
.videoList-container {
  /* flex: 1; */
  width: 100%;
  height: 450px;
  /* height: 60%; */
  /* height: 540px; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding-bottom: 1%;
}

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
