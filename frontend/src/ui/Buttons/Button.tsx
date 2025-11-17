import { Link } from "@tanstack/react-router";

type Props = {
  text: string;
  to?: string;
  variant?: "primary" | "secondary";
  icon?: "arrow" | "resume" | "cross";
  search?: Record<string, unknown>;
  onClick?: (e: React.MouseEvent) => void;
  skeleton?: boolean;
  linkTag?: boolean;
};

export default function Button({
  text,
  to,
  variant = "primary",
  icon = "arrow",
  search,
  onClick,
  skeleton = false,
  linkTag = false,
}: Props) {
  const baseClasses =
    "inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-semibold transform transition-all duration-200";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 hover:from-indigo-700 hover:to-purple-700",
    secondary:
      "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-105",
  };

  const skeletonClasses = {
    primary:
      "bg-gradient-to-r from-gray-300 to-gray-400 text-transparent animate-pulse cursor-wait",
    secondary:
      "bg-gray-100 border-2 border-gray-300 text-transparent animate-pulse cursor-wait",
  };

  const icons = {
    arrow: (
      <svg
        className="w-5 h-5"
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
    ),
    resume: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
    cross: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  };

  const content = (
    <>
      {variant === "secondary" && !skeleton && icons[icon]}
      <span className={skeleton ? "invisible" : ""}>{text}</span>
      {variant === "primary" && !skeleton && icons[icon]}
    </>
  );

  if (skeleton) {
    return (
      <div
        className={`${baseClasses} ${skeletonClasses[variant]} px-15 pointer-events-none select-none`}
      >
        {content}
      </div>
    );
  }
  if (linkTag) {
    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]}`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      search={search as never}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}
/* 
Usage Examples:

// Primary button with arrow icon (default)
<LinkButton text="Start New Quiz" to="/test" />

// Secondary button with resume icon
<LinkButton 
  text="Resume Quiz" 
  to="/test?resume=true" 
  variant="secondary" 
  icon="resume" 
/>

// Primary button with resume icon
<LinkButton 
  text="Continue" 
  to="/test" 
  variant="primary" 
  icon="resume" 
/>

<LinkButton text="Get Started" to="/start" skeleton={true} />

// With different variants
<LinkButton text="Continue" to="/continue" variant="secondary" skeleton={true} />
*/
