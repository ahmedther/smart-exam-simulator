import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/exam/$sessionId")({
  component: ExamComponent,
});

function ExamComponent() {
  return (
    <div>
      <h1>Exam loadeing</h1>
    </div>
  );
}
