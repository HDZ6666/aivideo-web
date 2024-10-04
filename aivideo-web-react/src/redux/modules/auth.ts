import { AuthState } from "@/redux/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Menu } from "@/typings/global";

const authState: AuthState = {
	authMenu: [],
	authButton: [],
	authRouter: []
};

const authSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {
		setAuthMenu(state: AuthState, { payload }: PayloadAction<Menu.MenuOptions[]>) {
			state.authMenu = payload;
		},
		setAuthButton(state: AuthState, { payload }: PayloadAction<string[]>) {
			state.authButton = payload;
		},
		setAuthRouter(state: AuthState, { payload }: PayloadAction<string[]>) {
			state.authRouter = payload;
		},
		resetAuthState(state: AuthState) {
			state.authMenu = [];
			state.authButton = [];
			state.authRouter = [];
		}
	}
});

export const { setAuthMenu, setAuthButton, setAuthRouter, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
