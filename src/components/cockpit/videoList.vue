<template>
  <div class="videoList-container">
    <el-row style="width: 100%;height: 100%;" :gutter="10">
      <!-- <el-col :span="24">{{`当前轮播:[${playList.map(item => item.deviceName).join(',')}]`}}</el-col> -->
      <el-col
        :span="24/splitNum"
        v-for="(player,index) in playList"
        :key="index"
        :style="{height: `calc(${Math.floor(100/splitNum)}% - 10px)`,marginBottom: '10px'}"
      >
        <dv-border-box-12 class="player-border">
          <div class="video-box">
            <LivePlayer
              ref="livePlayer"
              :videoUrl="player.ws_flv"
              :hasaudio="false"
              :poster="img"
              live
              muted
              stretch
              aspect="fullscreen"
              hide-big-play-button
              hide-stretch-button
              :controls="false"
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
      loopPlayerTimeOut: null,
      looptime: 5 * 60,
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
      id: "",
      ws_flv: ""
    });
    this.getDeviceList();
  },
  methods: {
    getDeviceList: function() {
      this.$axios({
        method: "get",
        url: `/cockpit/api/proxy/list`,
        params: {
          page: 1,
          pageSize: 9999
        }
      })
        .then(res => {
          if (res.data.code === 0) {
            const list = res.data.data.list;
            this.videoLists = list.map(item => {
              return {
                id: item.app + item.stream,
                ws_flv: item.streamInfo.flv.url
              };
            });
            // list.forEach(item => {
            //   this.getVideoList(item);
            // });
            this.changeVideo();
          }
        })
        .finally(() => {
          // dialogObj.handleLoading = false;
        });
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
    // 轮播
    changeVideo: function(index = 0) {
      const num = Math.pow(this.splitNum, 2);
      const pageSize = Math.ceil(this.videoLists.length / num); // 总页数
      if (index > pageSize - 1) {
        index = 0;
      }
      const list = this.videoLists.slice(index * num, index * num + num);
      // console.log(`第${index}次轮播`, list);
      const list2 = new Array(num - list.length).fill({
        id: "",
        ws_flv: ""
      });
      this.playList = [...list, ...list2];
      // [...list, ...list2].forEach((item, index) => {
      //   this.$set(this.playList, index, item);
      // });
      // console.log(`第${index}次轮播`, this.playList);
      // this.playList = this.videoLists.slice(index * num, index * num + num);
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
