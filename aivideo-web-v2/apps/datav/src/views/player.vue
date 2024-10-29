<template>
    <div class="player" ref="player">
      <video ref="videoPlayer" class="video-js video-player vjs-big-play-centered box"></video>
    </div>
</template>
<script>
import cacheMP4 from "../assets/video/cache.mp4"
import $ from 'jquery'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// import 'videojs-contrib-hls'

import { defineComponent } from "vue"
export default defineComponent({
    props: {
        id:{
          type: String,
          default: ""
        },
        url: {
          type: String,
          default: ""
        },
        poster:{
          type:String,
          default:""
        },
        autoplay:{
          type:Boolean,
          default:false
        }
    },
    components:{
    },
    data(){
        return {
          playing:false,
          player:null,
          videoUrl:'',
          videoPoster:'',
          playerOption: {
              playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
              autoplay: false, // 如果为true,浏览器准备好时开始回放。
              muted: true, // 默认情况下将会消除任何音频。
              loop: false, // 是否视频一结束就重新开始。
              preload: false, // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: 'zh-CN',
              aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: false,        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              poster: this.poster, // 封面地址
              sources: [{
                type: "video/mp4",   // 类型application/x-mpegURL
                src: cacheMP4
              }],
              controls:true,
              html5: {
                vhs: {
                    overrideNative: true
                },
                nativeVideoTracks: false,
                nativeAudioTracks:false,
                nativeTextTracks:false
              }
          },
          timer:null
        }
    },
    created(){

    },
    methods:{
      onShow(url,poster){
        this.videoUrl=url;
        this.videoPoster=poster;
        this.player.poster(this.videoPoster);
        this.getRealVideoUrl();
      },
      onHide(){
        this.stopPlay();
      },
      stopPlay(){
        if(this.player){
          if(this.playing){
            this.playing=false;
            this.player.src([{
                src: cacheMP4,
                type: 'video/mp4' 
            }]);
            if(this.timer!=null){
              clearTimeout(this.timer);
            }
          }
        }
      },
      startPlay(url){
        this.playing=true;
        this.player.src([{
            src: url,
            type: url.indexOf('.mp4')!=-1 ? 'video/mp4' : 'application/x-mpegURL'
        }]);
        if(this.timer!=null){
          clearTimeout(this.timer);
        }
        this.timer=setTimeout(this.checkPlayer, 1000);
        setTimeout(() => {
          this.player.play();
        }, 500);
      },
      getRealVideoUrl(){
        if(this.videoUrl!="" && this.videoUrl!=undefined && this.videoUrl!=null){
          if(this.videoUrl.toLowerCase().indexOf("shipinyun")!=-1){
          this.$http.post(this.videoUrl,"",true)
            .then((x) => {
                if(x.resultCode==0){
                  this.startPlay(x.url);
                }
                else{
                  this.$message.error(x.resultDesc);
                }
            });
          }
          else{
            this.startPlay(this.videoUrl)
          }
        }
      },
      checkPlayer(){
        if($(this.$refs["player"]).find('div:first').hasClass("vjs-error")){
          this.stopPlay();
          this.$message.error("视频播放失败");
        }
        else{
          this.timer=setTimeout(this.checkPlayer, 1000);
        }
      }
    },
    mounted() {
      this.videoUrl=this.url;
      this.videoPoster=this.poster;
      this.player = videojs(this.$refs.videoPlayer, this.playerOption, () => {
        if(this.autoplay){
          this.getRealVideoUrl(this.videoUrl);
        }
        this.player.on("play", ()=>{
          //由于脚本控制play，点击播放，会触发2次该事件
          if(!this.playing){
            this.$emit('onPlay',this.id);
            this.getRealVideoUrl(this.videoUrl);
          }
        });
        this.player.on("pause",()=>{
        });
      });
    },
    beforeDestroy() {
      if (this.player) {
        this.player.dispose()
      }
    },
    activated(){
    },
    deactivated(){
      this.stopPlay();
    }
})
</script>
<style lang="less" scoped>
.player{
  width:100%;
  height: 100%;
  .vjs-big-play-centered{
    height: 100%;
    padding-top: 0;
    video{
      height: calc(100% - 0.02rem);
    }
  }
  :deep(.video-js .vjs-big-play-button){
    font-size: 0.15rem;
    line-height: 0.22rem;
  }
}
</style>