import Hero from "../components/Hero";
import NavLinkBar from "../components/NavLinkBar";
import UserProfileCircle from "../components/UserProfileCircle";

export default function NavigationLayout() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl m-4 p-3 flex flex-col gap-4 md:flex-row shadow-lg">
      <Hero />
      <NavLinkBar />
      <UserProfileCircle />
    </nav>
  );
}
