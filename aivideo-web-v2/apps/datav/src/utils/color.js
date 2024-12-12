import { Color } from 'tvision-color';
/**
 * 将生成的样式嵌入头部
 */
export function insertThemeStylesheet(theme, colorMap, mode) {
    const isDarkMode = mode === 'dark';
    const root = !isDarkMode ? `:root[theme-color='${theme}']` : `:root[theme-color='${theme}'][theme-mode='dark']`;
    debugger
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `${root}{
      --td-brand-color: ${colorMap['--td-brand-color']};
      --td-brand-color-1: ${colorMap['--td-brand-color-1']};
      --td-brand-color-2: ${colorMap['--td-brand-color-2']};
      --td-brand-color-3: ${colorMap['--td-brand-color-3']};
      --td-brand-color-4: ${colorMap['--td-brand-color-4']};
      --td-brand-color-5: ${colorMap['--td-brand-color-5']};
      --td-brand-color-6: ${colorMap['--td-brand-color-6']};
      --td-brand-color-7: ${colorMap['--td-brand-color-7']};
      --td-brand-color-8: ${colorMap['--td-brand-color-8']};
      --td-brand-color-9: ${colorMap['--td-brand-color-9']};
      --td-brand-color-10: ${colorMap['--td-brand-color-10']};
      --td-bg-color-specialcomponent:${colorMap['--td-bg-color-specialcomponent']};
      --input-color-normal:${colorMap['--input-color-normal']};
      --button-bg-color:${colorMap['--button-bg-color']};
      --button-bg-active-color:${colorMap['--button-bg-active-color']};
      --text-title-color:${colorMap['--text-title-color']};
      --text-number-color:${colorMap['--text-number-color']};
      --text-unit-color:${colorMap['--text-unit-color']};
      --text-name-color:${colorMap['--text-name-color']};
      --text-more-color:${colorMap['--text-more-color']};
      --text-en-color:${colorMap['--text-en-color']};
      --text-dialog-header-title-color:${colorMap['--text-dialog-header-title-color']};
      --dialog-bg-color:${colorMap['--dialog-bg-color']};
      --detail-dialog-bg-color:${colorMap['--detail-dialog-bg-color']};
      --detail-dialog-box:${colorMap['--detail-dialog-box']};
      --text-dialog-body-color:${colorMap['--text-dialog-body-color']};
      --td-success-color:${colorMap['--td-success-color']};
      --text-page-color:${colorMap['--text-page-color']};
      --bg-linear-gradient:${colorMap['--bg-linear-gradient']};
      --vi-00-a-0-e-9:${colorMap['--vi-00-a-0-e-9']};
      --warn__frame__span:${colorMap['--warn__frame__span']};
      --warn_stat__border-color:${colorMap['--warn_stat__border-color']};
      --carema_addr_color:${colorMap['--carema_addr_color']};
      --chart-title-color:${colorMap['--chart-title-color']};
      --video-name:${colorMap['--video-name']};
      --warn__dialog__color:${colorMap['--warn__dialog__color']};
      --table_tbody_tr:${colorMap['--table_tbody_tr']};
      --warn__dialog__text__color:${colorMap['--warn__dialog__text__color']};
      --text-tree-colot:${colorMap['--text-tree-colot']};
      --text-tree-active-color:${colorMap['--text-tree-active-color']};
      --icon-tree-fill-color:${colorMap['--icon-tree-fill-color']};
      --border-row-col-color:${colorMap['--border-row-col-color']};
      --info-bottom-color:${colorMap['--info-bottom-color']};
      --dashed-color:${colorMap['--dashed-color']};
      --td-untreated-color:${colorMap['--td-untreated-color']};
      --text-title-center-color:${colorMap['--text-title-center-color']};
    }`;
  
    document.head.appendChild(styleSheet);
  }
  
/**
 * 根据当前主题色、模式等情景 计算最后生成的色阶
 */
export function generateColorMap(theme, colorPalette, mode, brandColorIdx) {
    const isDarkMode = mode === 'dark';
  
    if (isDarkMode) {
      // eslint-disable-next-line no-use-before-define
      colorPalette.reverse().map((color) => {
        const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl');
        return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex');
      });
      brandColorIdx = 5;
      colorPalette[0] = `${colorPalette[brandColorIdx]}20`;
    }
  
    const colorMap = {
      '--td-brand-color': colorPalette[brandColorIdx], // 主题色
      '--td-brand-color-1': colorPalette[0], // light
      '--td-brand-color-2': colorPalette[1], // focus
      '--td-brand-color-3': colorPalette[2], // disabled
      '--td-brand-color-4': colorPalette[3],
      '--td-brand-color-5': colorPalette[4],
      '--td-brand-color-6': colorPalette[5],
      '--td-brand-color-7': brandColorIdx > 0 ? colorPalette[brandColorIdx - 1] : theme, // hover
      '--td-brand-color-8': colorPalette[brandColorIdx], // 主题色
      '--td-brand-color-9': brandColorIdx > 8 ? theme : colorPalette[brandColorIdx + 1], // click
      '--td-brand-color-10': colorPalette[9],
    };
    return colorMap;
  }
export const colorList = {
    "#0052d9[light]":{ // 默认
        "--td-brand-color": "#0052d9",
        "--td-brand-color-1": "transparent",
        "--td-brand-color-2": "#d9e1ff",
        "--td-brand-color-3": "#b5c7ff",
        "--td-brand-color-4": "#8eabff",
        "--td-brand-color-5": "#618dff",
        "--td-brand-color-6": "#366ef4",
        "--td-brand-color-7": "#366ef4",
        "--td-brand-color-8": "#0052d9",
        "--td-brand-color-9": "#003cab",
        "--td-brand-color-10": "#001a57",
        "--td-bg-color-specialcomponent":"#0071bc",
        "--input-color-normal":"#fff",
        "--button-bg-color":"#0071bc",
        "--button-bg-active-color":"#0071f2",
        "--text-title-color":"#fff",
        "--text-number-color":"#F2F6FA",
        "--text-unit-color":"#C6D1DB",
        "--text-name-color":"#C6D1DB",
        "--text-more-color":"#7CBFFF",
        "--text-en-color":"#215A8E",
        "--text-dialog-header-title-color":"#fff",
        "--dialog-bg-color":"#3d7ab9",
        "--detail-dialog-bg-color":"#0000004d",
        "--detail-dialog-box":"#fff",
        "--text-dialog-body-color":"#fff",
        "--td-success-color":"#2ba471",
        "--text-page-color":"#fff",
        "--bg-linear-gradient":"linear-gradient(90deg, #0953BC 0%, #042656 100%)",
        "--vi-00-a-0-e-9":"#00A0E9",
        "--warn__frame__span":"#C6D1DB",
        "--warn_stat__border-color":"#7CBFFF",
        "--carema_addr_color":"#fff",
        "--chart-title-color":"#b4c0cc",
        "--video-name":"#fff",
        "--warn__dialog__color":"#061a40",
        "--table_tbody_tr":"#062B5A",
        "--warn__dialog__text__color":"#fff",
        "--text-tree-colot":"#fff",
        "--text-tree-active-color":"#ffd700",
        "--icon-tree-fill-color":"#fff",
        "--border-row-col-color":"#d5aa5b",
        "--info-bottom-color":"#042656",
        "--dashed-color":"#274E86",
        "--td-untreated-color":"rgba(247, 131, 6, 1)",
        "--text-title-center-color":"#fff"
        
    },
    "#0B8ECB[light]":{ //蓝色3
        "--td-brand-color": "rgba(6, 123, 177, 1)",
        "--td-brand-color-1": "transparent",
        "--td-brand-color-2": "#1FB5B5",
        "--td-brand-color-3": "#49E1E1",
        "--td-brand-color-4": "#29B6B6",
        "--td-brand-color-5": "#53C1C1",
        "--td-brand-color-6": "#8FA7A7",
        "--td-brand-color-7": "#089696",
        "--td-brand-color-8": "#50C9C9",
        "--td-brand-color-9": "#8BE8E8",
        "--td-brand-color-10": "#0EAFAF",
        "--td-bg-color-specialcomponent":"transparent",
        "--input-color-normal":"#fff",
        "--button-bg-color":"#0071bc",
        "--button-bg-active-color":"#0C7D7D",
        "--text-title-color":"#fff",
        "--text-number-color":"#fff",
        "--text-unit-color":"rgba(198, 209, 219, 1)",
        "--text-name-color":"rgba(198, 209, 219, 1)",
        "--text-more-color":"#7CBFFF",
        "--text-en-color":"#21A5A5",
        "--text-dialog-header-title-color":"#BAE1E1",
        "--dialog-bg-color":"#0C8282",
        "--detail-dialog-bg-color":"#0E6363",
        "--detail-dialog-box":"#089090",
        "--text-dialog-body-color":"#59B9B9",
        "--td-success-color":"#73D1D1",
        "--text-page-color":"#fff",
        "--bg-linear-gradient":"linear-gradient(90deg, #067BB1 0%, #093562 100%)",
        "--vi-00-a-0-e-9":"#fff",
        "--warn__frame__span":"#C6D1DB",
        "--warn_stat__border-color":"#05adfa",
        "--carema_addr_color":"#fff",
        "--chart-title-color":"rgba(180, 192, 204, 1)",
        "--video-name":"#fff",
        "--warn__dialog__color":"#09D7D7",
        "--table_tbody_tr":"#33C9C9",
        "--warn__dialog__text__color":"#33C9C9",
        "--text-tree-colot":"#fff",
        "--text-tree-active-color":"rgba(6, 123, 177, 1)",
        "--icon-tree-fill-color":"#fff",
        "--border-row-col-color":"#71E9E9",
        "--info-bottom-color":"#042656",
        "--dashed-color":"#46E9E9",
        "--td-untreated-color":"rgba(247, 131, 6, 1)",
        "--text-title-center-color":"#fff"
    },
    "#1C71FC[light]":{ // 蓝色2
      "--td-brand-color": "#1C71FC",
      "--td-brand-color-1": "transparent",
      "--td-brand-color-2": "#d9e1ff",
      "--td-brand-color-3": "#b5c7ff",
      "--td-brand-color-4": "#8eabff",
      "--td-brand-color-5": "#618dff",
      "--td-brand-color-6": "#366ef4",
      "--td-brand-color-7": "#366ef4",
      "--td-brand-color-8": "#0052d9",
      "--td-brand-color-9": "#003cab",
      "--td-brand-color-10": "#001a57",
      "--td-bg-color-specialcomponent":"transparent",
      "--input-color-normal":"#fff",
      "--button-bg-color":"#0052d9",
      "--button-bg-active-color":"#0071f2",
      "--text-title-color":"#fff",
      "--text-number-color":"#F2F6FA",
      "--text-unit-color":"#C6D1DB",
      "--text-name-color":"#C6D1DB",
      "--text-more-color":"#7CBFFF",
      "--text-en-color":"#215A8E",
      "--text-dialog-header-title-color":"#fff",
      "--dialog-bg-color":"#3d7ab9",
      "--detail-dialog-bg-color":"#0000004d",
      "--detail-dialog-box":"#fff",
      "--text-dialog-body-color":"#fff",
      "--td-success-color":"#2ba471",
      "--text-page-color":"#fff",
      "--bg-linear-gradient":"linear-gradient(90deg, #0953BC 0%, #042656 100%)",
      "--vi-00-a-0-e-9":"#fff",
      "--warn__frame__span":"#C6D1DB",
      "--warn_stat__border-color":"#7CBFFF",
      "--carema_addr_color":"#fff",
      "--chart-title-color":"#b4c0cc",
      "--video-name":"#fff",
      "--warn__dialog__color":"#061a40",
      "--table_tbody_tr":"#062B5A",
      "--warn__dialog__text__color":"#fff",
      "--text-tree-colot":"#fff",
      "--text-tree-active-color":"#1C71FC",
      "--icon-tree-fill-color":"#fff",
      "--border-row-col-color":"#d5aa5b",
      "--info-bottom-color":"#042656",
      "--dashed-color":"#274E86",
      "--td-untreated-color":"rgba(247, 131, 6, 1)",
      "--text-title-center-color":"linear-gradient(180deg, #C9E2F8 0%, #309EF9 100%)"
    },
    "#8F1FFF[light]":{ // 紫色
      "--td-brand-color": "#8F1FFF",
        "--td-brand-color-1": "transparent",
        "--td-brand-color-2": "#d9e1ff",
        "--td-brand-color-3": "#b5c7ff",
        "--td-brand-color-4": "#8eabff",
        "--td-brand-color-5": "#618dff",
        "--td-brand-color-6": "#366ef4",
        "--td-brand-color-7": "#366ef4",
        "--td-brand-color-8": "#0052d9",
        "--td-brand-color-9": "#003cab",
        "--td-brand-color-10": "#001a57",
        "--td-bg-color-specialcomponent":"transparent",
        "--input-color-normal":"#fff",
        "--button-bg-color":"#8F1FFF",
        "--button-bg-active-color":"#0071f2",
        "--text-title-color":"#fff",
        "--text-number-color":"#F2F6FA",
        "--text-unit-color":"#C6D1DB",
        "--text-name-color":"#C6D1DB",
        "--text-more-color":"#FFF",
        "--text-en-color":"#215A8E",
        "--text-dialog-header-title-color":"#fff",
        "--dialog-bg-color":"#3d7ab9",
        "--detail-dialog-bg-color":"#0000004d",
        "--detail-dialog-box":"#fff",
        "--text-dialog-body-color":"#fff",
        "--td-success-color":"#2ba471",
        "--text-page-color":"#fff",
        "--bg-linear-gradient":"linear-gradient(90deg, #8F1FFF 0%, #260449 100%)",
        "--vi-00-a-0-e-9":"rgba(255,208,59,1)",
        "--warn__frame__span":"#C6D1DB",
        "--warn_stat__border-color":"transparent",
        "--carema_addr_color":"#fff",
        "--chart-title-color":"#b4c0cc",
        "--video-name":"#fff",
        "--warn__dialog__color":"#061a40",
        "--table_tbody_tr":"#062B5A",
        "--warn__dialog__text__color":"#fff",
        "--text-tree-colot":"#fff",
        "--text-tree-active-color":"#8F1FFF",
        "--icon-tree-fill-color":"#fff",
        "--border-row-col-color":"#d5aa5b",
        "--info-bottom-color":"#042656",
        "--dashed-color":"#274E86",
        "--td-untreated-color":"#FE1742",
        "--text-title-center-color":"#fff"
    }
}
export const imageList = {
  "#0B8ECB":{ // 蓝色3
    "header":'../assets/imgs/blue3/header.png',
    "deviceBackgroundBase64":"../assets/imgs/blue3/deviceBackgroundBase64.png",
    "pageBack":"../assets//imgs/blue3/pageBack.png",
    "cardBoxBase64":"../assets//imgs/blue3/cardBoxBase64.png",
    "cameraTitleBase64":"../assets//imgs/blue3/cameraTitleBase64.png",
    "boxIcon":"../assets//imgs/blue3/boxIcon.png",
    "fullScreenUrl":"../assets//imgs/blue3/fullScreen.png",
    "cardTitleBase64":"../assets//imgs/blue3/cardTitleBase64.png",
    "video_bg":"../assets//imgs/blue3/video_bg.png",
    "device_total":'../assets//imgs/blue3/device_total.png',
    "device_online":"../assets//imgs/blue3/device_online.png",
    "warn_todo":"../assets//imgs/blue3/warn_todo.png",
    "warn_total":"../assets//imgs/blue3/warn_total.png",
  },
  "#1C71FC":{ // 蓝色2
    "header":'../assets/imgs/blue2/header.png',
    "deviceBackgroundBase64":"../assets/imgs/blue2/deviceBackgroundBase64.png",
    "pageBack":"../assets//imgs/blue2/pageBack.png",
    "cardBoxBase64":"../assets//imgs/blue2/cardBoxBase64.png",
    "cameraTitleBase64":"../assets//imgs/blue2/cameraTitleBase64.png",
    "boxIcon":"../assets//imgs/blue2/boxIcon.png",
    "fullScreenUrl":"../assets//imgs/blue2/fullScreen.png",
    "cardTitleBase64":"../assets//imgs/blue2/cardTitleBase64.png",
    "video_bg":"../assets//imgs/blue2/video_bg.png",
    "device_total":'../assets//imgs/blue2/device_total.png',
    "device_online":"../assets//imgs/blue2/device_online.png",
    "warn_todo":"../assets//imgs/blue2/warn_todo.png",
    "warn_total":"../assets//imgs/blue2/warn_total.png",
  },
  "#8F1FFF":{ // 紫色
    "header":'../assets/imgs/violet/header.png',
    "deviceBackgroundBase64":"../assets/imgs/violet/deviceBackgroundBase64.png",
    "pageBack":"../assets//imgs/violet/pageBack.png",
    "cardBoxBase64":"../assets//imgs/violet/cardBoxBase64.png",
    "cameraTitleBase64":"../assets//imgs/violet/cameraTitleBase64.png",
    "boxIcon":"../assets//imgs/violet/boxIcon.png",
    "fullScreenUrl":"../assets//imgs/violet/fullScreen.png",
    "cardTitleBase64":"../assets//imgs/violet/cardTitleBase64.png",
    "video_bg":"../assets//imgs/violet/video_bg.png",
    "time":"../assets//imgs/violet/time.png",
    "device_total":'../assets//imgs/violet/device_total.png',
    "device_online":"../assets//imgs/violet/device_online.png",
    "warn_todo":"../assets//imgs/violet/warn_todo.png",
    "warn_total":"../assets//imgs/violet/warn_total.png",
  }
}