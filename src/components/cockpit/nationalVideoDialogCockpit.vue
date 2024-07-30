<template>
  <transition
    enter-active-class="animate__animated animate__fadeInTopRight"
    leave-active-class="animate__animated animate__fadeOutBottomLeft"
  >
    <div v-if="showDetail" class="alarm-dialog">
      <div class="close-box" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <dv-border-box-11 class="dialog-border" title="监控详情" backgroundColor="rgba(67,79,103,1)">
        <div
          class="video-box"
          v-loading="player.loading"
          :loading.sync="player.loading"
          element-loading-text="加载中..."
          element-loading-background="#000"
          v-if="playerType==='liveplayer'"
        >
          <div class="video-title" v-if="player.name && !player.loading">{{player.name}}</div>
          <LivePlayer
            ref="livePlayer"
            :videoUrl="player.videoUrl"
            :hasaudio="false"
            :alt="player.error?'视频加载失败':'无信号'"
            live
            stretch
            aspect="fullscreen"
            hide-big-play-button
            @play="onPlayerPlay($event)"
            @error="onPlayerError($event)"
          ></LivePlayer>
        </div>
        <div class="video-box" v-else>
          <div class="video-title" v-if="player.name && !player.loading">{{player.name}}</div>
          <player ref="player" :videoUrl="player.videoUrl" screen autoplay />
        </div>
      </dv-border-box-11>
    </div>
  </transition>
</template>

<script>
import LivePlayer from "@liveqing/liveplayer";
import player from "../common/jessibuca.vue";
import { mixin } from "../../utils/mixin";

export default {
  name: "videoDialog",
  mixins: [mixin],
  components: { LivePlayer, player },
  data() {
    return {
      showDetail: false,
      player: {
        name: "",
        videoUrl: "",
        loading: false,
        error: false
      }
    };
  },
  mounted() {},
  methods: {
    //通知设备上传媒体流
    sendDevicePush: function(itemData) {
      let deviceId = itemData.deviceId;
      let channelId = itemData.channelId;
      const that = this;
      console.log("通知设备推流1：" + deviceId + " : " + channelId);
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

            that.player.videoUrl = videoUrl;
          } else {
            that.$message.error(res.data.msg);
          }
        })
        .catch(function(e) {})
        .finally(() => {});
    },
    open: function(data) {
      if (data.userData && data.userData.aiStreamInfo) {
        const url =
          location.protocol === "https:"
            ? data.userData.aiStreamInfo.wss_flv.url
            : data.userData.aiStreamInfo.ws_flv.url;
        this.showDetail = true;
        this.player = {
          name: data.name,
          videoUrl: url,
          loading: true,
          error: false
        };
      } else {
        this.$message.error("设备播放异常");
      }
      // if (data.userData.deviceId && data.userData.channelId) {
      //   this.showDetail = true;
      //   this.player = {
      //     name: data.name,
      //     videoUrl: "",
      //     loading: true,
      //     error: false
      //   };
      //   this.sendDevicePush(data.userData);
      // } else {
      //   this.$message.error("设备播放异常");
      // }
    },
    close: function() {
      this.player = {
        name: "",
        videoUrl: "",
        loading: false,
        error: false
      };
      this.showDetail = false;
    },
    // 播放器加载完成
    onPlayerPlay: function(e) {
      if (this.player.loading) {
        this.player.loading = false;
      }
    },
    // 播放器错误
    onPlayerError: function(e) {
      if (this.player.loading) {
        this.player.loading = false;
        this.player.videoUrl = "";
        this.player.error = true;
      }
    }
  }
};
</script>

<style scoped>
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
  padding: 60px 20px 20px;
  position: relative;
  box-sizing: border-box;
}

.video-box {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.video-title {
  position: absolute;
  top: 5px;
  left: 5px;
  border-radius: 2px;
  color: #fff;
  background-color: hsla(0, 0%, 50%, 0.8);
  max-width: 400px;
  padding: 10px 5px;
  z-index: 666;
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dialog-content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 60px 30px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  /* align-items: center; */
}
.close-box {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 2px;
  top: 12px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  border-radius: 50%;
  border: 2px solid #809fe9;
  background: #434f67;
  cursor: pointer;
  z-index: 777;
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
  width: 300px;
  display: flex;
  justify-content: flex-end;
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
