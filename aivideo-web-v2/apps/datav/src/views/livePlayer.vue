<template>
    <div class="player" :style="playDynameicStyle" ref="player">
        <LivePlayer ref="player" :videoUrl="videoUrl" live="true" style="width: 100%;height: 100%;"></LivePlayer>
    </div>
    </template>
    
    <script>
    import testVideo from "../assets/video/test.mp4"
    import LivePlayer from '@liveqing/liveplayer-v3'
    import { mapGetters } from "vuex";
    import { getImageUrl } from '@/utils/imageUrl.js'
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
            },

        },
        data(){
            return {
                videoUrl:'',
                videoPoster:'',
                playDynameicStyle:{

                }
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
            },
            handleMbData(item){
                if(item.video_bg){
                    const video_bg = getImageUrl(item.video_bg)
                    this.playDynameicStyle = {
                        background: `url(${video_bg}) no-repeat center`,
                        backgroundSize:"100% 100%"
                    }
                }
            }
        },
        mounted(){
            this.videoUrl=this.url
        },
        computed:{
            ...mapGetters([ "mbData"]),
        },
        watch:{
            mbData(newVal){
                this.handleMbData(newVal)
            }
        },
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