import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reui/")({
	beforeLoad: () => {
		throw redirect({ to: "/reui/dashboard" });
	},
});
