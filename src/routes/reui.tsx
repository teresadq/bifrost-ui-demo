import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import { ReuiShell } from "@/components/reui/reuiShell";

export const Route = createFileRoute("/reui")({
	component: ReuiLayout,
});

function ReuiLayout() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const isAuth = pathname === "/reui/login" || pathname === "/reui/register";

	if (isAuth) return <Outlet />;

	return (
		<ReuiShell>
			<Outlet />
		</ReuiShell>
	);
}
