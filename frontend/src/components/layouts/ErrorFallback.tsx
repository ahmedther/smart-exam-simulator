import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

type ErrorFallbackProps = {
  navigateTo?: string;
};

export default function ErrorFallback({
  navigateTo = "/",
}: ErrorFallbackProps) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: navigateTo });
  }, [navigate, navigateTo]);

  return null;
}
