<template>
  <div class="videoList-container">
    <div class="video-box" v-for="i in 4" :key="i">
      <div class="video-content">
        <div class="player-content">
          <player ref="player" :videoUrl="videoUrl" fluent autoplay />
        </div>
        <dv-border-box-12 class="player-border"></dv-border-box-12>
      </div>
    </div>
  </div>
</template>

<script>
//"ws://192.168.1.106:80/rtp/34020000001320000001_34020000001320000001.live.flv"
//"ws://192.168.1.110:80/rtp/31010500002000000002_31010500002000000002.live.flv"
//"ws://192.168.1.110:80/rtp/31010500002000000002_31010500002000000002.live.mp4"
//"ws://183.239.58.24:20001/rtp/44010200491330000001_34020000001340000001.live.flv"
import player from "../common/jessibuca.vue";
export default {
  name: "videoList",
  components: { player },
  data() {
    return {
      videoUrl:
        "ws://183.239.58.24:20001/rtp/44010200491330000001_34020000001340000001.live.flv"
    };
  },
  mounted() {
    // this.$nextTick(_ => {
    //   const player = this.$refs.player;
    //   player && player.updatePlayerDomSize();
    // });
  }
};
</script>

<style scoped>
.videoList-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.video-box {
  width: 49%;
  margin-bottom: 2%;
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
