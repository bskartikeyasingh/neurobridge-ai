import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        rounded-3xl
        p-6
        shadow-xl
        hover:border-cyan-400/40
        hover:shadow-[0_0_35px_rgba(34,211,238,0.18)]
        transition-all
        duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}