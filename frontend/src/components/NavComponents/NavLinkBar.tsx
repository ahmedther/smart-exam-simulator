import CustomNavLink from "../CustomNavLink";

export default function NavLinkBar() {
  return (
    <ol className="ml-0 lg:ml-auto max-w-90 lg:max-w-full flex items-stretch bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md">
      <li className="relative flex min-w-30 first:pl-0 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-white/20 first:before:content-none">
        <CustomNavLink text="Home" to="/" />
      </li>
      <li className="relative flex min-w-30 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-white/20">
        <CustomNavLink text="Test" to="/test" />
      </li>
      <li className="relative flex min-w-30 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-white/20">
        <CustomNavLink text="Report" to="/report" />
      </li>
    </ol>
  );
}
