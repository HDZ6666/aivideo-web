/* eslint-disable */
import Vue from "vue";
//不要删除
function printVueType(){
	console.log(typeof Vue)
}

declare module "@vue/runtime-core" {
	export interface ComponentCustomProperties {
		$t: (key: string, ...args: any[]) => string;
	}
}