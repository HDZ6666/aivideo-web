export const routedata = [
    {
        "name": "VideoCockpit",
        "path": "/videoCockpit",
        "component": "videoCockpit",
        "redirect": "noRedirect",
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
        //"redirect":"/live",
        "redirect": "noRedirect",
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
        //"redirect":"/live",
        //"redirect": "noRedirect",
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
        //"redirect":"/streamProxyList",
        "redirect": "noRedirect",
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
    {
        "name": "Xt",
        "path": "/xt",
        "hidden": false,
        "redirect": "noRedirect",
        "component": "Layout",
        "alwaysShow": true,
        "meta": {
            "title": "系统管理",
            "icon": "#",
            "noCache": false,
            "link": null
        },
        "children": [
            {
                "name": "MenuManager",
                "path": "menuManager",
                "hidden": false,
                "component": "menuManager",
                "meta": {
                    "title": "菜单管理",
                    "icon": "#",
                    "noCache": false,
                    "link": null
                }
            }
        ]
    }
]