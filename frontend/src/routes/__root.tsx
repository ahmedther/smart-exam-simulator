import { createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Outlet } from "@tanstack/react-router";
import NavigationLayout from "../layouts/NavigationLayout";
import FooterLayout from "../layouts/FooterLayout";

const RootLayout = () => {
  return (
    <>
      <NavigationLayout />
      <Outlet />
      <FooterLayout />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
