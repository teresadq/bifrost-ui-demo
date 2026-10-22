import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 3000,
		proxy: {
			// Go + HTMX 演示（htmx/）。Vite 把 /htmx/* 原样转发给本地 Go 服务，
			// 因此第三套风格与 React 演示共用同一个端口与来源。
			"/htmx": {
				target: "http://127.0.0.1:8090",
				changeOrigin: false,
			},
		},
	},
	preview: {
		port: 4173,
		proxy: {
			"/htmx": {
				target: "http://127.0.0.1:8090",
				changeOrigin: false,
			},
		},
	},
	build: {
		outDir: "dist",
		emptyOutDir: true,
	},
});
