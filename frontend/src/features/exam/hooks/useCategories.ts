import { useQuery } from "@tanstack/react-query";
import { examApi } from "../../../api/examApi";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await examApi.getCategories();
      return response.results;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
