export default function FooterLayout() {
  return (
    <footer className="mt-auto py-6 px-4 text-center border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Exam Simulator. All rights reserved.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Do your best and achieve greatness 🎯
      </p>
    </footer>
  );
}
