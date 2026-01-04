import React from "react";

interface GlowingIconWrapperProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

const GlowingIconWrapper: React.FC<GlowingIconWrapperProps> = ({
  children,
  variant = "primary",
}) => {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`
        m-2 p-4 rounded-full mb-6 cursor-default
        transition-all duration-300 ease-out
        inline-flex items-center justify-center
        ${
          isPrimary
            ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            : "bg-slate-400/10 text-slate-400 hover:bg-slate-400/20 hover:shadow-[0_0_30px_rgba(148,163,184,0.3)]"
        }
        hover:scale-110
      `}
    >
      {children}
    </div>
  );
};

export default GlowingIconWrapper;
