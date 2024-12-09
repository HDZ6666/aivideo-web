<template>
    <el-color-picker
      v-model="theme"
      :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
      class="theme-picker"
      popper-class="theme-picker-dropdown"
      :disabled="isDisabled"
    />
  </template>
  
  <script>

  
  export default {
    props:{
        themeColor:{
            type:String,
            default:""
        },
        isDisabled:{
          type:Boolean,
          default:false
        }
    },
    data() {
      return {
        chalk: '', // content of theme-chalk css
        theme: '#409EFF'
      }
    },
    // computed: {
    //   defaultTheme() {
    //     return this.$store.state.settings.theme
    //   }
    // },
    watch: {
    //   defaultTheme: {
    //     handler: function(val, oldVal) {
    //       this.theme = val
    //     },
    //     immediate: true
    //   },
      themeColor: {
        handler: function(val, oldVal) {
          this.theme = val
          // if(!this.isDisabled){
            
          // }else{
          //   this.$message.info('当前背景不支持修改颜色')
          // }
          
        },
        immediate: true
      },
      theme(val){
        debugger
        this.$emit('change',val)
      }
    },
  
    methods: {
  
    }
  }
  </script>
  
  <style>
  .theme-message,
  .theme-picker-dropdown {
    z-index: 99999 !important;
  }
  
  .theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }
  
  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
  </style>
  