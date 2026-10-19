import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * ReUI 演示使用独立的设计令牌。路由进入 /reui 时把 style-reui 挂到 <html>，
 * 这样 Radix portal（下拉、弹窗、toast）也能继承同一套变量。
 */
export function StyleScope() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const isReui = pathname === "/reui" || pathname.startsWith("/reui/");

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle("style-reui", isReui);
		return () => root.classList.remove("style-reui");
	}, [isReui]);

	return null;
}
