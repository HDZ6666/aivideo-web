// 后端微服务端口名 mock
export const PORT1 =
	process.env.NODE_ENV === "production" ? "https://mock.mengxuegu.com/mock/65d5b165351bbd02cf339d37/hooks" : "/api/hooks";
export const PORT2 = "/userCenter";

// 后端接口
export const PORT3 = process.env.NODE_ENV === "production" ? import.meta.env.VITE_API_URL : "/video";

export const PORT4 = process.env.NODE_ENV === "production" ? import.meta.env.VITE_MSG_URL : "/msg";
