import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/nova/")({
	beforeLoad: () => {
		throw redirect({ to: "/nova/register" });
	},
});
