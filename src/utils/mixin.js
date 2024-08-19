export const mixin = {
  data() {
    return {
      alarmNotify: !localStorage.getItem("alarmSwitchStatus")
        ? false
        : JSON.parse(localStorage.getItem("alarmSwitchStatus")),
      playerType: "liveplayer", // liveplayer | jessibuca
      playerAction: "proxy", // national (国标) | proxy (拉流) | nationalCockpit (国标无层级)
      aiType: "nationalAI" // proxyAI（后端分析） | nationalAI （设备自带AI） | false (没有AI)
    };
  }
};
