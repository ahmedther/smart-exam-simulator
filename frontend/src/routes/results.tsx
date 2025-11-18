import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/results")({
  component: ResultsComponent,
});

function ResultsComponent() {
  return (
    <div>
      <h1>Results</h1>
    </div>
  );
}
