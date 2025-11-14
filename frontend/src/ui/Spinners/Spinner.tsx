// Spinner.tsx
interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export default function Spinner({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Gradient Spinning Ring */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-linear-to-r from-indigo-600 to-purple-600 animate-spin`}
        >
          <div className="absolute inset-1 bg-white rounded-full"></div>
        </div>
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <p
          className={`${textSizeClasses[size]} font-semibold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}

// Alternative Spinner Styles - Export these as separate components if needed

// Dots Spinner
export function DotsSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${dotSizes[size]} bg-indigo-600 rounded-full animate-bounce`}
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className={`${dotSizes[size]} bg-purple-600 rounded-full animate-bounce`}
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className={`${dotSizes[size]} bg-indigo-600 rounded-full animate-bounce`}
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
}

// Pulse Spinner
export function PulseSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full bg-linear-to-r from-indigo-600 to-purple-600 animate-ping opacity-75`}
      ></div>
      <div
        className={`${sizeClasses[size]} rounded-full bg-linear-to-r from-indigo-600 to-purple-600 absolute`}
      ></div>
    </div>
  );
}

// Usage Examples:

/*
// Default spinner
<Spinner />

// Small spinner with custom text
<Spinner size="sm" text="Please wait..." />

// Large spinner without text
<Spinner size="lg" text="" />

// Full screen loading overlay
<Spinner fullScreen text="Loading exam questions..." />

// Dots spinner
<DotsSpinner size="md" />

// Pulse spinner
<PulseSpinner size="lg" />
*/
