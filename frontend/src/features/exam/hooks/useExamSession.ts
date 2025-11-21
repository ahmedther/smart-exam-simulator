import { useQuery } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";

export const userExamSessionOptions = (sessionId: string) => ({
  queryKey: ["exam-session", sessionId],
  queryFn: () => examApi.resumeSession(sessionId),
  enabled: !!sessionId,
  staleTime: Infinity, // ✅ Never consider stale
  gcTime: Infinity, // ✅ Keep forever
  refetchOnWindowFocus: false, // ✅ Don't refetch on focus
  refetchOnMount: false, // ✅ Don't refetch on mount - use cache!
  refetchOnReconnect: false, // ✅ Don't refetch on reconnect
});

// Hook to get exam session data
export function useExamSession(sessionId: string) {
  return useQuery(userExamSessionOptions(sessionId));
}
