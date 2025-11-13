import { motion } from "framer-motion";
import CustomNavLink from "../CustomNavLink";

export default function NavLinkBar() {
  return (
    <motion.ol
      className="ml-0 lg:ml-auto max-w-90 lg:max-w-full flex items-stretch bg-on-tertiary-container rounded-xl shadow-xl shadow-tertiary"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.li
        className="relative flex min-w-30 first:pl-0 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-linear-to-b before:from-transparent before:via-white/40 before:to-transparent first:before:content-none"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <CustomNavLink text="Home" to="/" />
      </motion.li>
      <motion.li
        className="relative flex min-w-30 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-linear-to-b before:from-transparent before:via-white/40 before:to-transparent"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <CustomNavLink text="Test" to="/test" />
      </motion.li>
      <motion.li
        className="relative flex min-w-30 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-px before:bg-linear-to-b before:from-transparent before:via-white/40 before:to-transparent"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <CustomNavLink text="Report" to="/report" />
      </motion.li>
    </motion.ol>
  );
}
