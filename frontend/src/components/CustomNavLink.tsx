import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

type Props = {
  text: string;
  to: string;
};

export default function CustomNavLink({ text, to }: Props) {
  return (
    <Link to={to} className="w-full h-full">
      {({ isActive }) => (
        <motion.div
          className={`relative flex items-center justify-center text-xl w-full h-full px-6 py-3 rounded-xl overflow-hidden ${
            isActive ? "text-on-tertiary-container bg-white" : "text-white"
          }`}
          variants={{
            hover: {
              y: -2, // Only translate Y by -2 on hover
            },
          }}
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Shine overlay */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
            variants={{
              hover: {
                x: ["-100%", "200%"],
                transition: {
                  duration: 0.6,
                  ease: "easeInOut",
                },
              },
            }}
            initial={{ x: "-100%" }}
          />

          {/* Text content */}
          <span className="relative z-10">{text}</span>
        </motion.div>
      )}
    </Link>
  );
}
