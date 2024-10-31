<template>
    <div class="player" ref="player">
        <LivePlayer ref="player" :videoUrl="videoUrl" live="true" stretch="true" style="width: 100%;height: 100%;"></LivePlayer>
    </div>
    </template>
    
    <script>
    import testVideo from "../assets/video/test.mp4"
    import LivePlayer from '@liveqing/liveplayer-v3'
    export default {
        name: 'LivePlayerDemo',
        components: {
            LivePlayer
        },
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
        data(){
            return {
                videoUrl:'',
                videoPoster:''
            }
        },
        methods: {
            onShow(url,poster){
                //this.videoUrl=url;
                //this.videoPoster=poster;
                this.$refs.player.play();
            },
            onHide(){
                this.$refs.player.pause();
            }
        },
        mounted(){
            this.videoUrl=testVideo;
        }
    }
    </script>
    <style lang="less" scoped>
    .player{
      width:100%;
      height: 100%;
      :deep(.video-wrapper){
        padding: 0 !important;
        height: 100%;
      }
    }
    </style>