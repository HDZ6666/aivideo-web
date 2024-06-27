export const mixin = {
  data() {
    return {
      alarmNotify: !localStorage.getItem("alarmSwitchStatus")
        ? false
        : JSON.parse(localStorage.getItem("alarmSwitchStatus"))
    };
  }
};
