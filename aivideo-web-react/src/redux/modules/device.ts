import { DeviceState, deviceItem, locationItem } from "@/redux/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const deviceState: DeviceState = {
	locationList: [],
	deviceList: [],
	selectLocation: {}
};

const deviceSlice = createSlice({
	name: "device",
	initialState: deviceState,
	reducers: {
		setLocationList(state: DeviceState, { payload }: PayloadAction<locationItem[]>) {
			state.locationList = payload;
		},
		setDeviceList(state: DeviceState, { payload }: PayloadAction<deviceItem[]>) {
			state.deviceList = payload;
		},
		setSelectLocation(state: DeviceState, { payload }: PayloadAction<any>) {
			state.selectLocation = payload;
		}
	}
});

export const { setLocationList, setDeviceList, setSelectLocation } = deviceSlice.actions;
export default deviceSlice.reducer;
