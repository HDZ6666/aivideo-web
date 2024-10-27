export const routedata = [
    {
        "name": "VideoCockpit",
        "path": "/videoCockpit",
        "component": "videoCockpit",
        "hidden": false,
        "meta": {
            "title": "数据大屏",
            "icon": "#",
            "noCache": false,
            "link": null
        }
    },
    {
        "name": "Live",
        "path": "/",
        "hidden": false,
        "component": "Layout",
        "redirect":"/live",
        "meta": {
            "title": "分屏监控",
            "icon": "#",
            "noCache": false,
            "link": null
        },
        "children":[{
            "name": "Live",
            "path": "live",
            "hidden": false,
            "component": "live",
            "meta": {
                "title": "分屏监控",
                "icon": "#",
                "noCache": false,
                "link": null
            }
        }]
    },
    {
        "path": "/",
        "hidden": false,
        "component": "Layout",
        "redirect":"/live",
        "name":"",
        "meta": {
            "title": "国际对接",
            "icon": "#",
            "noCache": false,
            "link": null
        },
        "children": [
            {
                "name": "deviceList",
                "path": "deviceList",
                "component": "DeviceList",
                "hidden": false,
                "meta": {
                    "title": "设备列表",
                    "icon": "#",
                    "noCache": false,
                    "link": null
                }
            },
            {
                "name": "deviceGroup",
                "path": "deviceGroup",
                "hidden": false,
                "component": "DeviceGroup",
                "meta": {
                    "title": "分组",
                    "icon": "#",
                    "noCache": false,
                    "link": null
                }
            }
        ]
    },
    {
        "name": "StreamProxyList",
        "path": "/StreamProxyList",
        "component": "Layout",
        "redirect":"/streamProxyList",
        "hidden": false,
        "meta": {
            "title": "非国标对接",
            "icon": "#",
            "noCache": false,
            "link": null
        },
        "children":[{
            "name": "StreamProxyList",
            "path": "streamProxyList",
            "hidden": false,
            "component": "StreamProxyList",
            "meta": {
                "title": "非国标对接",
                "icon": "#",
                "noCache": false,
                "link": null
            }
        }]
    },
    // {
    //     "name": "AlarmList",
    //     "path": "/alarmList",
    //     "hidden": false,
    //     "redirect": "noRedirect",
    //     "component": "Layout",
    //     "alwaysShow": true,
    //     "meta": {
    //         "title": "AI卫士",
    //         "icon": "#",
    //         "noCache": false,
    //         "link": null
    //     },
    //     "children": [
    //         {
    //             "name": "AlarmList",
    //             "path": "alarmList",
    //             "hidden": false,
    //             "component": "AlarmList",
    //             "meta": {
    //                 "title": "告警列表",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         }
    //     ]
    // },
    // {
    //     "name": "DeviceList",
    //     "path": "/deviceList",
    //     "hidden": false,
    //     "redirect": "noRedirect",
    //     "component": "Layout",
    //     "alwaysShow": true,
    //     "meta": {
    //         "title": "国际对标",
    //         "icon": "#",
    //         "noCache": false,
    //         "link": null
    //     },
    //     "children": [
    //         {
    //             "name": "DeviceList",
    //             "path": "deviceList",
    //             "hidden": false,
    //             "component": "DeviceList",
    //             "meta": {
    //                 "title": "设备列表",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         },
    //         {
    //             "name": "DeviceGroup",
    //             "path": "deviceGroup",
    //             "hidden": false,
    //             "component": "DeviceGroup",
    //             "meta": {
    //                 "title": "分组",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         }
    //     ]
    // },
    // {
    //     "path": "/",
    //     "hidden": false,
    //     "component": "Layout",
    //     "children": [
    //         {
    //             "name": "StreamProxyList",
    //             "path": "streamProxyList",
    //             "hidden": false,
    //             "meta": {
    //                 "title": "非国际对标",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         }
    //     ]
    // },
    // {
    //     "name": "Xt",
    //     "path": "/xt",
    //     "hidden": false,
    //     "redirect": "noRedirect",
    //     "component": "Layout",
    //     "alwaysShow": true,
    //     "meta": {
    //         "title": "系统",
    //         "icon": "#",
    //         "noCache": false,
    //         "link": null
    //     },
    //     "children": [
    //         {
    //             "name": "Console",
    //             "path": "console",
    //             "hidden": false,
    //             "component": "Console",
    //             "meta": {
    //                 "title": "控制台",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         },
    //         {
    //             "name": "CloudRecord",
    //             "path": "cloudRecord",
    //             "hidden": false,
    //             "component": "CloudRecord",
    //             "meta": {
    //                 "title": "云端录像",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         },
    //         {
    //             "name": "MediaServerManger",
    //             "path": "mediaServerManger",
    //             "hidden": false,
    //             "component": "MediaServerManger",
    //             "meta": {
    //                 "title": "节点管理",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         },
    //         {
    //             "name": "ParentPlatformList/15/1",
    //             "path": "parentPlatformList/15/1",
    //             "hidden": false,
    //             "component": "ParentPlatformList",
    //             "meta": {
    //                 "title": "国际级联",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         },
    //         {
    //             "name": "UserManager",
    //             "path": "userManager",
    //             "hidden": false,
    //             "component": "UserManager",
    //             "meta": {
    //                 "title": "用户管理",
    //                 "icon": "#",
    //                 "noCache": false,
    //                 "link": null
    //             }
    //         }
    //     ]
    // }
]