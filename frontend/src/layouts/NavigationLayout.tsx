import Hero from "../components/NavComponents/Hero";
import NavLinkBar from "../components/NavComponents/NavLinkBar";
import UserProfileCircle from "../components/NavComponents/UserProfileCircle";

export default function NavigationLayout() {
  return (
    <nav className="bg-tertiary-container rounded-2xl m-4 p-3 flex flex-col gap-4 md:flex-row shadow-xl ">
      <Hero />
      <NavLinkBar />
      <UserProfileCircle />
    </nav>
  );
}
