// src/hooks/useExam.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";
import { useNavigate } from "@tanstack/react-router";
import toast from "../../../utils";
import { useExamStore } from "../stores/examStore";
import React from "react";

// Get browser fingerprint (you can use a library like fingerprintjs2 for better implementation)


// Hook to start a new exam
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

