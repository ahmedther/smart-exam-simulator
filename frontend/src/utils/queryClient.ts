import { QueryClient, MutationCache, QueryCache } from "@tanstack/react-query";
import { toast } from "./toast";
import type { ApiError } from "../features/exam/types";

function handleError(error: ApiError) {
  console.log("Global error handler triggered:", error); // Debug log

  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "An unexpected error occurred";

  const status = error?.response?.status;

  // Different handling based on status
  if (status === 401) {
    toast.warning("Please log in again", "Session Expired");
  } else if (status === 403) {
    toast.error("You don't have permission", "Access Denied");
  } else if (status === 404) {
    toast.error("Resource not found", "Not Found");
  } else if (status && status >= 500) {
    toast.error("Server error. Please try again later", "Server Error");
  } else {
    toast.error(message);
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // ✅ Enable global error handler for queries
    },
    mutations: {},
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      console.log("Mutation error:", error);
      handleError(error);
    },
  }),
  queryCache: new QueryCache({
    onError: (error) => {
      console.log("Query error:", error);
      handleError(error);
    },
  }),
});
