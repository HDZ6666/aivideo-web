# Video Module Migration Map

Target: migrate business pages from `aivideo-web-v1` into `aivideo-gat1400` with Vue 3, Element Plus, RuoYi-style routing, and video request modules.

## Directory Rules

| Type | Target |
| --- | --- |
| Page | `aivideo-gat1400/src/views/video/<page-name>/index.vue` |
| Shared component | `aivideo-gat1400/src/components/video/<ComponentName>/index.vue` |
| API | `aivideo-gat1400/src/api/video/*.js` |
| Utils | `aivideo-gat1400/src/utils/video/*.js` |
| Assets | `aivideo-gat1400/src/assets/video/**` |

## Scope

- `included`: video business pages, AI iframe pages, patrol pages, media/server business pages.
- `skipped`: datav/big-screen pages, login, and old system admin pages such as user, role, menu, and log manager.
- `covered`: old split pages that are now represented by one migrated page.

## Page Map

| Old page | New page | Route | Status | Notes |
| --- | --- | --- | --- | --- |
| `src/components/live.vue` | `src/views/video/live/index.vue` | `/video/live` | `verified` | Uses three dedicated v1-style device tree components and RuoYi/Element Plus layout. |
| `src/components/liveNational.vue` | `src/views/video/live/index.vue` | `/video/live` | `covered` | Covered by the live page source selector. |
| `src/components/liveProxy.vue` | `src/views/video/live/index.vue` | `/video/live` | `covered` | Covered by the live page source selector. |
| `src/components/DeviceList.vue` | `src/views/video/device-list/index.vue` | `/video/device-list` | `verified` | Migrated with independent group, edit, and sync dialogs. |
| `src/components/DeviceGroup.vue` | `src/views/video/device-group/index.vue` | `/video/device-group` | `verified` | Migrated with independent edit and choose-device dialogs. |
| `src/components/channelList.vue` | `src/views/video/channel-list/index.vue` | `/video/channel-list` | `verified` | Migrated as RuoYi table/query page, with V1 list/tree switching and `/api/device/query/tree/channel/{deviceId}` flow restored. |
| `src/components/CloudRecord.vue` | `src/views/video/cloud-record/index.vue` | `/video/cloud-record` | `verified` | Migrated recording list flow. |
| `src/components/CloudRecordDetail.vue` | `src/views/video/cloud-record-detail/index.vue` | `/video/cloud-record-detail` | `verified` | Hidden detail route. |
| `src/components/GBRecordDetail.vue` | `src/views/video/gb-record-detail/index.vue` | `/video/gb-record-detail` | `verified` | Hidden GB recording route. |
| `src/components/PushVideoList.vue` | `src/views/video/push-video-list/index.vue` | `/video/push-video-list` | `verified` | Core list/actions and import-channel upload dialog migrated. |
| `src/components/StreamProxyList.vue` | `src/views/video/stream-proxy-list/index.vue` | `/video/stream-proxy-list` | `verified` | Migrated with left/right group layout. |
| `src/components/MediaServerManger.vue` | `src/views/video/media-server-manager/index.vue` | `/video/media-server-manager` | `verified` | Old spelling kept only in source map; target uses `manager`. |
| `src/components/ParentPlatformList.vue` | `src/views/video/parent-platform-list/index.vue` | `/video/parent-platform-list` | `verified` | Migrated upper-platform list and dialogs. |
| `src/components/map.vue` | `src/views/video/map/index.vue` | `/video/map` | `verified` | Video map page, not datav; uses target `AMapComponent`. |
| `src/components/patrolManager.vue` | `src/views/video/patrol-manager/index.vue` | `/video/patrol-manager` | `verified` | Main flow migrated; add/edit device/time selectors are simplified fields for now. |
| `src/components/patrolReport.vue` | `src/views/video/patrol-report/index.vue` | `/video/patrol-report` | `verified` | Migrated with report detail dialog. |
| `src/components/DeviceInspection.vue` | `src/views/video/device-inspection/index.vue` | `/video/device-inspection` | `verified` | Migrated polling list, batch inspection, and all inspection flow. |
| `src/components/console.vue` | `src/views/video/console/index.vue` | `/video/console` | `verified` | Migrated video server polling endpoints and platform info dialog in RuoYi card style. |
| `src/components/alarmList.vue` | `src/views/video/alarm-list/index.vue` | `/video/alarm-list` | `verified` | Migrated iframe redirect to `/ai/alarm` with current video token. |
| `src/components/fence.vue` | `src/views/video/fence/index.vue` | `/video/fence` | `verified` | Migrated iframe redirect to `/ai/setting` with current video token. |
| `src/components/aiView.vue` | `src/views/video/ai-view/index.vue` | `/video/ai-view` | `verified` | Migrated iframe redirect to `/ai/alarm` with current video token. |
| `src/components/patrol.vue` | `src/views/video/patrol-manager` + `patrol-report` | n/a | `covered` | Old wrapper replaced by direct RuoYi routes. |
| `src/components/videoCockpit.vue` | n/a | n/a | `skipped` | Datav/big-screen excluded by user. |
| `src/components/dataV.vue` | n/a | n/a | `skipped` | Datav/big-screen excluded by user. |
| `src/components/dataV2.vue` | n/a | n/a | `skipped` | Datav/big-screen excluded by user. |
| `src/components/v2/datavV2.vue` | n/a | n/a | `skipped` | Datav/big-screen excluded by user. |
| `src/components/v2/alarmV2.vue` | n/a | n/a | `skipped` | Datav/v2 cockpit family excluded for now. |
| `src/components/UserManager.vue` | n/a | n/a | `skipped` | Old system page; RuoYi already has system/user. |
| `src/components/RoleManager.vue` / `roleManager1.vue` | n/a | n/a | `skipped` | Old system page; RuoYi already has system/role. |
| `src/components/menuManager.vue` | n/a | n/a | `skipped` | Old system page; RuoYi already has system/menu. |
| `src/components/logManager.vue` | n/a | n/a | `skipped` | Old system log page, kept out with system admin pages. |
| `src/components/Settings.vue` | n/a | n/a | `skipped` | Big-screen model/theme settings, excluded with datav pages. |
| `src/components/setting/Web.vue` / `Sip.vue` / `Media.vue` | n/a | n/a | `skipped` | Old files are incomplete setting stubs; not migrated in this video-page batch. |

## Component Map

| Old component | New component | Status | Notes |
| --- | --- | --- | --- |
| `src/components/common/DeviceTreeNational.vue` | `src/components/video/DeviceTreeNational/index.vue` | `verified` | Dedicated Vue 3 component; request and node logic kept inside. |
| `src/components/common/DeviceTreeProxy.vue` | `src/components/video/DeviceTreeProxy/index.vue` | `verified` | Dedicated Vue 3 component; request and node logic kept inside. |
| `src/components/common/DeviceTreeNationalCockpit.vue` | `src/components/video/DeviceTreeNationalCockpit/index.vue` | `verified` | Dedicated Vue 3 component; request and node logic kept inside. |
| `src/components/common/jessibuca.vue` | `src/components/video/StreamPlayer/index.vue` | `verified` | Wraps the target Jessibuca player. |
| `src/components/dialog/devicePlayer.vue` | `src/components/video/DevicePlayer/index.vue` | `verified` | Playback dialog with LivePlayer, Jessibuca, WebRTC, PTZ, presets, stream sharing, codec info, and transcode flow. V1 h265web tab is still a placeholder there too. |
| `src/components/DeviceGroupList.vue` | `src/components/video/DeviceGroupList/index.vue` | `verified` | Dedicated component for device-list group filtering. |
| `src/components/dialog/deviceEdit.vue` | `src/components/video/DeviceEdit/index.vue` | `verified` | Dedicated edit dialog. |
| `src/components/dialog/SyncChannelProgress.vue` | `src/components/video/SyncChannelProgress/index.vue` | `verified` | Dedicated sync progress dialog. |
| `src/components/dialog/editDeviceGroup.vue` | `src/components/video/DeviceGroupEdit/index.vue` | `verified` | Dedicated group edit dialog. |
| `src/components/dialog/chooseDeviceForGroup.vue` | `src/components/video/ChooseDeviceForGroup/index.vue` | `v1-compatible` | Dedicated choose-device dialog. V1 itself uses mock device rows and does not submit a real binding API; keep as a known V1 limitation until a backend contract is provided. |
| `src/components/dialog/recordDownload.vue` | `src/components/video/RecordDownload/index.vue` | `verified` | Recording download dialog. |
| `src/components/dialog/pushStreamEdit.vue` | `src/components/video/PushStreamEdit/index.vue` | `verified` | Push stream GB edit dialog. |
| `src/components/dialog/StreamProxyEdit.vue` | `src/components/video/StreamProxyEdit/index.vue` | `verified` | Stream proxy edit dialog. |
| `src/components/dialog/MediaServerEdit.vue` | `src/components/video/MediaServerEdit/index.vue` | `verified` | Media server edit dialog, including record service check and send RTP port range when returned by server config. |
| `src/components/dialog/platformEdit.vue` | `src/components/video/PlatformEdit/index.vue` | `verified` | Upper platform edit dialog, including V1 device GB ID duplicate check via `/api/platform/exit/{deviceGbId}`. |
| `src/components/dialog/chooseChannel.vue` | `src/components/video/ChooseChannel/index.vue` | `verified` | Channel chooser dialog with catalog tree context actions, GB channel tab, and live stream tab. |
| `src/components/dialog/taskAdd.vue` | `src/components/video/PatrolTaskAdd/index.vue` | `verified` | Patrol add dialog with national/proxy camera tree and day/hour selector. |
| `src/components/dialog/taskEdit.vue` | `src/components/video/PatrolTaskEdit/index.vue` | `verified` | Patrol edit dialog with national/proxy camera tree and day/hour selector. |
| `src/components/dialog/showReport.vue` | `src/components/video/PatrolReportDetail/index.vue` | `verified` | Patrol report detail dialog. |
| `src/components/dialog/importChannel.vue` | `src/components/video/ImportChannel/index.vue` | `verified` | Upload dialog migrated and wired into push stream list. |
| `src/components/dialog/importChannelShowErrorData.vue` | `src/components/video/ImportChannelErrorData/index.vue` | `verified` | Duplicate GB ID and App/Stream result dialog migrated. |
| `src/components/dialog/onvifEdit.vue` | `src/components/video/OnvifEdit/index.vue` | `verified` | ONVIF RTSP lookup dialog migrated and wired into stream proxy list. |
| `src/components/Day.vue` | `src/components/video/PatrolDay/index.vue` | `verified` | Day/hour selector migrated for patrol task add/edit. |
| `src/components/common/DeviceTreeNational_patrol.vue` | `src/components/video/DeviceTreeNationalPatrol/index.vue` | `verified` | Dedicated patrol camera checkbox tree. |
| `src/components/common/DeviceTreeProxy_patrol.vue` | `src/components/video/DeviceTreeProxyPatrol/index.vue` | `verified` | Dedicated patrol proxy checkbox tree. |

## Verification

- `pnpm run build:prod` passed in `aivideo-gat1400`.
- `dist` source map count: `0`.
- `ZLMRTCClient.js.map` was not generated in `aivideo-gat1400/dist`.
- Latest re-check restored channel list tree mode, upper-platform GB ID validation, and media-server send RTP port range fields; `pnpm run build:prod` still passes.
