import type { ResultsSearchTypes, ThemeClassesTypes } from "../../types";

type ResultsSearchProps = {
  search: ResultsSearchTypes;
  classes: ThemeClassesTypes;
  handleSortChange: (newSort: string) => void;
};

export function ResultsSearch({
  search,
  classes,
  handleSortChange,
}: ResultsSearchProps) {
  return (
    <div className="flex gap-4 items-center max-w-2xl">
      {/* <div className="relative flex-1">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by session ID..."
          value={search.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={classes.searchInput}
        />
      </div> */}
      <select
        value={search.sort}
        onChange={(e) => handleSortChange(e.target.value)}
        className={classes.searchInput}
      >
        <option value="-date">Newest First</option>
        <option value="date">Oldest First</option>
        <option value="-score">Highest Score</option>
        <option value="score">Lowest Score</option>
        <option value="-accuracy">Best Accuracy</option>
        <option value="accuracy">Lowest Accuracy</option>
      </select>
    </div>
  );
}
