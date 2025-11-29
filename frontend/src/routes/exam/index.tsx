import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/exam/")({
  component: ExamLandingPage,
});

import { useState } from "react";

export default function ExamLandingPage() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-linear-to-br from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl">
                <svg
                  className="w-20 h-20 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Ready to Test Your
              <br />
              Knowledge?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Challenge yourself with our comprehensive exam. Track your
              progress and master new skills.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => navigate({ to: "/" })}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative inline-flex items-center gap-4 px-12 py-6 rounded-2xl text-xl font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl hover:scale-105 transform transition-all duration-300"
            >
              <span>Start New Exam</span>
              <svg
                className={`w-7 h-7 transition-transform duration-300 ${
                  isHovered ? "translate-x-2" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {/* Card 1 */}
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 border border-indigo-100">
            <div className="bg-linear-to-br from-indigo-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Timed Sessions
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Complete the exam at your own pace with smart time management
              features.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 border border-purple-100">
            <div className="bg-linear-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Instant Results
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Get detailed feedback and comprehensive analytics immediately
              after submission.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 border border-pink-100">
            <div className="bg-linear-to-br from-pink-500 to-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Progress Tracking
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your performance and watch your skills improve over time.
            </p>
          </div>
        </div>

        {/* Exam Info Section */}
        <div className="mt-24 bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative">
            <h2 className="text-4xl font-bold mb-8 text-center">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-5xl font-bold">225</div>
                <div className="text-indigo-100">Questions</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold">255</div>
                <div className="text-indigo-100">Minutes</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold">70%</div>
                <div className="text-indigo-100">Pass Score</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-bold">∞</div>
                <div className="text-indigo-100">Attempts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-10 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <svg
              className="w-7 h-7 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Quick Tips
          </h3>
          <ul className="grid md:grid-cols-2 gap-4">
            {[
              "Read each question carefully before answering",
              "You can mark questions for review and return later",
              "Your progress is automatically saved",
              "Review all answers before final submission",
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700">
                <svg
                  className="w-6 h-6 text-green-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
