import { queryOptions } from "@tanstack/react-query";
import type { PaginatedResultsTypes, ResultsSearchTypes } from "../types";
import { examApi } from "../../../api/examApi";

export const resultsQueryOptions = (params: ResultsSearchTypes) =>
  queryOptions<PaginatedResultsTypes>({
    queryKey: ["results", params.page, params.search, params.sort],
    queryFn: () => examApi.fetchAllResults(params),
  });
