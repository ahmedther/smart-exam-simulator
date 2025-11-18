import { useRouter } from "@tanstack/react-router";
import React from "react";

const useErrorRedirect = () => {
  const router = useRouter();

  React.useEffect(() => {
    // Redirect to home on mount
    router.navigate({ to: "/" });
  }, [router]);
};

export { useErrorRedirect };
