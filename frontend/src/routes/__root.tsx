import { createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Outlet } from "@tanstack/react-router";
import NavigationLayout from "../features/navigation/layouts/NavigationLayout";
import FooterLayout from "../components/layouts/FooterLayout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

const RootLayout = () => {
  return (
    <>
      <NavigationLayout />
      <Outlet />
      <FooterLayout />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <RootLayout />,
});
