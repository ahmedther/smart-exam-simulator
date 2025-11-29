import { useQuery } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";
import { getBrowserFingerprint } from "../../../utils";

export const activeSessionQueryOptions = (enabled = true) => ({
  queryKey: ["active-session"],
  queryFn: () => examApi.checkActiveSession(getBrowserFingerprint()),
  enabled, // ✅ Control when query runs
});
// ✅ Hook now uses the exported options
// Hook to check for active session
export function useCheckActiveSession(enabled = true) {
  return useQuery(activeSessionQueryOptions(enabled));
}
