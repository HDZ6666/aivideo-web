import { UserState, UserInfo } from "@/redux/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userState: UserState = {
	token: "",
	userInfo: null,
	roles: [],
	permission: []
};

const userSlice = createSlice({
	name: "tabs",
	initialState: userState,
	reducers: {
		setToken(state: UserState, { payload }: PayloadAction<string>) {
			state.token = payload;
		},
		setUserInfo(state: UserState, { payload }: PayloadAction<UserInfo | null>) {
			state.userInfo = payload;
		},
		setRoles(state: UserState, { payload }: PayloadAction<string[]>) {
			state.roles = payload;
		},
		setPermission(state: UserState, { payload }: PayloadAction<string[]>) {
			state.permission = payload;
		},
		resetUserState(state: UserState) {
			state.token = "";
			state.userInfo = null;
			state.roles = [];
			state.permission = [];
		}
	}
});

export const { setToken, setUserInfo, setRoles, setPermission, resetUserState } = userSlice.actions;
export default userSlice.reducer;
