<template>
  <div id="addUser" v-loading="isLoging">
    <el-dialog
      title="添加用户"
      width="40%"
      top="2rem"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      :destroy-on-close="true"
      @close="close()"
    >
      <div id="shared" style="margin-right: 20px;">
        <MapComponent ref="map"></MapComponent>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapComponent from "../common/MapComponent.vue";
export default {
  name: "getDeviceLocation",
  props: {},
  computed: {
    MapComponent
  },
  created() {
    console.log(1);
  },
  data() {
    return {
      listChangeCallback: null,
      showDialog: false
    };
  },
  methods: {
    openDialog: function(callback) {
      this.listChangeCallback = callback;
      this.showDialog = true;
    },
    onSubmit: function() {},
    close: function() {
      this.showDialog = false;
    }
  }
};
</script>
