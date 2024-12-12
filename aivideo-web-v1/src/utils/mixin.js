export const mixin = {
  data() {
    return {
      alarmNotify:
        JSON.parse(localStorage.getItem("alarmSwitchStatus")) || false,
      playerType: "jessibuca", // liveplayer | jessibuca
      playerAction: "national", // national (国标) | proxy (拉流) | nationalCockpit (国标无层级)
      aiType: "proxyAI" // proxyAI（后端分析） | nationalAI （设备自带AI） | false (没有AI)
    };
  }
};
