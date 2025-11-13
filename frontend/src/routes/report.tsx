import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/report")({
  component: ReportComponent,
});

function ReportComponent() {
  return <div>Hello "/report"!</div>;
}
