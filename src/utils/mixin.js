export const mixin = {
  data() {
    return {
      alarmNotify: !localStorage.getItem("alarmSwitchStatus")
        ? false
        : JSON.parse(localStorage.getItem("alarmSwitchStatus")),
      playerType: "liveplayer", // liveplayer|jessibuca
      playerAction: "proxy" // national|proxy
    };
  }
};
