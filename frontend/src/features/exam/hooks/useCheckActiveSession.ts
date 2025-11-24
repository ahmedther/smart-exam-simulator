import { useQuery } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";
import { getBrowserFingerprint } from "../../../utils";

export const activeSessionQueryOptions = (enabled = true) => ({
  queryKey: ["active-session"],
  queryFn: () => examApi.checkActiveSession(getBrowserFingerprint()),
  enabled, // ✅ Control when query runs
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,
});
// ✅ Hook now uses the exported options
// Hook to check for active session
export function useCheckActiveSession(enabled = true) {
  return useQuery(activeSessionQueryOptions(enabled));
}
