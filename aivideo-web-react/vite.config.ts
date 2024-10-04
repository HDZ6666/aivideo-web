import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { ConfigEnv, defineConfig, loadEnv, ProxyOptions, UserConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import eslintPlugin from "vite-plugin-eslint";
import { createHtmlPlugin } from "vite-plugin-html";
import { wrapperEnv } from "./src/utils/getEnv";

// @see: https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
	const env = loadEnv(mode.mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	const base = viteEnv.VITE_BASE_URL;
	const proxy: Record<string, ProxyOptions> = {};
	proxy[`${base}video`] = {
		target: viteEnv.VITE_API_URL, //后端服务接口
		changeOrigin: true,
		rewrite: path => {
			const newpath = path.substring(`${base}video`.length);
			console.log(newpath);
			return newpath;
		}
	};
	proxy[`${base}msg`] = {
		target: viteEnv.VITE_API_URL, //后端服务接口
		changeOrigin: true,
		rewrite: path => path.substring(`${base}msg`.length)
	};

	return {
		base: base,
		// alias config
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src")
			}
		},
		// global css
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
					additionalData: `@import "@/styles/var.less";`
				}
			}
		},
		// server config
		server: {
			host: "0.0.0.0", // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			// https: false,
			// 代理跨域（mock 不需要配置，这里只是个事列）
			proxy: {
				"/api": {
					target: "https://mock.mengxuegu.com/mock/65d5b165351bbd02cf339d37", // easymock
					changeOrigin: true,
					rewrite: path => path.replace(/^\/api/, "")
				},
				"/video": {
					target: viteEnv.VITE_API_URL, //后端服务接口
					changeOrigin: true,
					rewrite: path => path.replace(/^\/video/, "")
				},
				"/msg": {
					target: viteEnv.VITE_MSG_URL, //后端服务接口
					changeOrigin: true,
					rewrite: path => path.replace(/^\/msg/, "")
				},
				...proxy
			},
			hmr: viteEnv.VITE_HMR
		},
		// plugins
		plugins: [
			react(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			// * EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),
			// * 是否生成包预览
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				})
		],
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		// build configure
		build: {
			outDir: "dist",
			sourcemap: true,
			// esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
			minify: "esbuild",
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});
