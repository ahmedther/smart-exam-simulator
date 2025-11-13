export default function FooterLayout() {
  return (
    <footer className="text-center py-4 text-sm text-gray-500 border-t border-gray-200">
      © {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
}
