import { useQuery } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";
import { getBrowserFingerprint } from "../../../utils";

export const activeSessionQueryOptions = {
  queryKey: ["active-session"],
  queryFn: () => examApi.checkActiveSession(getBrowserFingerprint()),
};

// ✅ Hook now uses the exported options
// Hook to check for active session
export function useCheckActiveSession() {
  return useQuery(activeSessionQueryOptions);
}
