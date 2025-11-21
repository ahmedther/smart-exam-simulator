import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { examApi } from "../../../api/examApi";
import { getBrowserFingerprint } from "../../../utils";

export function useStartExam() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => examApi.startExam(getBrowserFingerprint()),
    onMutate: () => {
      queryClient.clear();
    },
    onSuccess: (data) => {
      // Cache the exam data
      queryClient.setQueryData(["exam-session", data.session.session_id], data);
      // ✅ Mark as fresh (not stale)

      navigate({
        to: "/exam/$sessionId",
        params: { sessionId: data.session.session_id },
      });
    },
    onError: (error) => {
      console.error("Failed to start exam:", error);
    },
  });
}
