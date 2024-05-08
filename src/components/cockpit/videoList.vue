<template>
  <div class="videoList-container">
    <el-row style="width: 100%;height: 100%;" :gutter="10">
      <!-- <el-col :span="24">{{`当前轮播:[${playList.map(item => item.deviceName).join(',')}]`}}</el-col> -->
      <el-col
        :span="24/splitNum"
        v-for="index in Math.pow(splitNum,2)"
        :key="index"
        :style="{height: `calc(${Math.floor(100/splitNum)}% - 10px)`,marginBottom: '10px'}"
      >
        <dv-border-box-12 class="player-border">
          <div class="video-box">
            <LivePlayer
              ref="livePlayer"
              :videoUrl="(playList[index-1] && playList[index-1].ws_flv) || '' "
              :hasaudio="false"
              aspect="fullscreen"
              fluent
              stretch
              autoplay
              hide-big-play-button
              hide-stretch-button
              live
              alt="无视频源"
              :controls="false"
            ></LivePlayer>
            <!-- <rtc-player
              v-if="Object.keys(this.player).length == 1 && this.player.webRTC"
              ref="jessibuca"
              :visible.sync="showVideoDialog"
              :videoUrl="videoUrl"
              :error="videoError"
              :message="videoError"
              height="100%"
              :hasAudio="hasAudio"
              fluent
              autoplay
              live
            ></rtc-player>-->
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

export default {
  name: "videoList",
  components: { LivePlayer, rtcPlayer },
  data() {
    return {
      loopPlayerTimeOut: null,
      looptime: 5,
      splitNum: 3,
      videoLists: [],
      playList: []
    };
  },
  computed: {
    // splitNum() {
    //   return Math.sqrt(this.videoLists.length) || 1;
    // }
  },
  mounted() {
    this.getDeviceList();
    // this.changeVideo();
    // this.$nextTick(_ => {
    //   const player = this.$refs.player;
    //   player && player.updatePlayerDomSize();
    // });
  },
  methods: {
    getDeviceList: function() {
      this.$axios({
        method: "get",
        url: `/cockpit/api/proxy/list`,
        params: {
          page: 1,
          pageSize: 99
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const list = res.data.data.list;
            list.forEach(item => {
              this.getVideoList(item);
            });
          }
        })
        .finally(() => {
          // dialogObj.handleLoading = false;
        });
    },
    getVideoList: function(params) {
      this.$axios({
        method: "get",
        url: `/cockpit/api/proxy/getPlayUrl`,
        params: {
          app: params.app,
          stream: params.stream
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            this.videoLists.push(res.data.data);
            this.changeVideo();
          }
        })
        .finally(() => {
          // dialogObj.handleLoading = false;
        });
    },
    // 轮播
    changeVideo: function(index = 0) {
      const num = Math.pow(this.splitNum, 2);
      const pageSize = Math.ceil(this.videoLists.length / num); //2
      if (this.videoLists.length <= num) {
        this.playList = this.videoLists;
        return;
      }
      if (index > pageSize - 1) {
        index = 0;
      }
      this.playList = this.videoLists.slice(index * num, index * num + num);
      if (this.loopPlayerTimeOut) {
        clearTimeout(this.loopPlayerTimeOut);
      }
      this.loopPlayerTimeOut = setTimeout(() => {
        this.changeVideo(index + 1);
      }, this.looptime * 1000);
    },
    videoError: function(e) {
      console.log("播放器错误：" + JSON.stringify(e));
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
</style>
