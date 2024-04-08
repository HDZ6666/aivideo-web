<template>
  <div class="videoList-container">
    <div class="video-box" v-for="i in videoLists" :key="i">
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
      <LivePlayer
        ref="livePlayer"
        :videoUrl="i"
        :hasaudio="false"
        aspect="fullscreen"
        fluent
        stretch
        autoplay
        hide-big-play-button
        live
      ></LivePlayer>
      <dv-border-box-12 class="player-border"></dv-border-box-12>
      <!-- <div class="video-content">
        <div class="player-content">
          <LivePlayer  ref="livePlayer"  :videoUrl="videoUrl" :hasaudio="false" fluent autoplay live></LivePlayer>
        </div>
        <dv-border-box-12 class="player-border"></dv-border-box-12>
      </div>-->
    </div>
  </div>
</template>

<script>
//"ws://192.168.1.106:80/rtp/34020000001320000001_34020000001320000001.live.flv"
//"ws://192.168.1.110:80/rtp/31010500002000000002_31010500002000000002.live.flv"
//"ws://192.168.1.110:80/rtp/31010500002000000002_31010500002000000002.live.mp4"
//"ws://183.239.58.24:20001/rtp/44010200491330000001_34020000001340000001.live.flv"
// rtsp://183.239.58.24:554/rtp/44010200491330000001_44010200491330000001
import player from "../common/jessibuca.vue";

import LivePlayer from "@liveqing/liveplayer";
import rtcPlayer from "../dialog/rtcPlayer.vue";

export default {
  name: "videoList",
  components: { LivePlayer, rtcPlayer },
  data() {
    return {
      videoLists: [
        // ws://183.239.58.24:20001/rtp/44060610091182000010_44060610091322000010.live.flv
        "ws://183.239.58.24:20001/rtp/44060610091182000010_44060610091322000010.live.flv",
        "ws://183.239.58.24:20001/rtp/44060610091182000010_44060610091322000020.live.flv",
        "ws://183.239.58.24:20001/rtp/44060610091182000010_44060610091322000030.live.flv",
        "ws://183.239.58.24:20001/rtp/44060610091182000010_44060610091322000040.live.flv"
      ],
      videoUrl:
        // http://183.239.58.24:20001/rtp/44010200491330000001_44010200491330000001.live.flv
        "ws://183.239.58.24:20001/rtp/44010200491330000001_44010200491330000001.live.flv"
    };
  },
  mounted() {
    // this.$nextTick(_ => {
    //   const player = this.$refs.player;
    //   player && player.updatePlayerDomSize();
    // });
  },
  methods: {
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
  width: 48%;
  height: 48%;
  margin: 1%;
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
  position: absolute;
  left: -5px;
  top: -5px;
  width: calc(100% + 10px);
  height: calc(100% + 10px);
}
</style>
