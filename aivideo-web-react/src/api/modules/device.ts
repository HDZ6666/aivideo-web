import { PORT1, PORT3, PORT4 } from "@/api/config/servicePort";
import { LocationApi } from "@/api/interface/index";

import http from "@/api";
// * 获取菜单列表

export const getDeviceList = (params: any) => {
	return http.get<any[]>(PORT1 + `/menu/list`, { ...params, mode: "1" }, { headers: { showLoading: true } });
};

export const getLocationList = (params: any) => {
	return http.get<any[]>(PORT1 + `/menu/list`, { ...params, mode: "3" }, { headers: { showLoading: true } });
};

export const getDeviceScreenList = () => {
	return http.get<any[]>(PORT1 + `/menu/list`, { mode: "4" }, { headers: { showLoading: true } });
};

export const getQueryAlarmList = (params: any) => {
	return http.get<any>(PORT1 + `/alarmList`, params);
};

export const getDeviceList2 = (params: any) => {
	return http.get<any>(PORT3 + `/device/query/cameraList`, params);
};

export const getDeviceVideoStream = (params: any) => {
	return http.get<any>(PORT3 + `/play/video/stream_start`, params);
};

export const getApiAlarmList = (params: any) => {
	return http.get<any>(PORT3 + `/alarm/alarmCameraListAll`, params);
};

export const getAlarmDetailByID = (params: any) => {
	return http.get<any>(PORT3 + `/alarm/alarmRecordDetail`, params);
};

export const handleAlarmByType = (params: any) => {
	return http.get<any>(PORT1 + `/handleAlarm`, params);
};

export const getDeviceLocation = (params: any) => {
	return http.get<LocationApi.ResLocationApi[]>(PORT3 + `/device/group/cameraGroupList`, params);
};

export const updateDeviceGroup = (params: any) => {
	return http.post<any>(PORT3 + `/device/group/updateDeviceGroup/?id=${params.id}`, params, {
		headers: { "Content-Type": "application/json" }
	});
};

export const updateAlarmStatus = (params: any) => {
	return http.get<any>(PORT3 + `/alarm/handle`, params);
};

export const sendAlarmMsg = (params: any) => {
	// https://fyict.cn:8091/smsplatform/api/Sms/SendVoice?
	return http.post<any>(
		// PORT4 + `/smsplatform/api/Sms/SendVoice?templateId=${params.templateId}&mobiles=${params.mobiles}&param=${params.param}`
		PORT4 + `/smsplatform/api/Sms/SendVoice`,
		{},
		{ params, headers: { clientid: "bf49b3c9-7075-46ea-9c48-47ff0921234" } }
	);
};
