<template>
  <router-view />
</template>
<script>
    import { defineComponent,getCurrentInstance  } from "vue";
    export default defineComponent({
    setup() {
      const currentInstance=getCurrentInstance();
      const setFontSize=function(){
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        var fontSize = 1 * (width / 10);
        document.getElementsByTagName('html')[0].setAttribute('style', 'font-size:' + fontSize + 'px !important');
        currentInstance.appContext.config.globalProperties.$fontSize=fontSize;
        //1920*1080 0.11rem=19.19px
      };
      return  {setFontSize};
    },
    mounted(){
      this.setFontSize();
      window.addEventListener("resize",this.setFontSize);
    },
    unmounted(){
      window.removeEventListener("resize",this.setFontSize);
    }
})
</script>

