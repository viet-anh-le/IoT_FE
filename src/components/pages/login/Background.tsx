import React from "react";

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden z-0 bg-[#0B1120]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#0f172a_100%)]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[80px] opacity-60 animate-float1" />

      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[80px] opacity-50 animate-float2" />

      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-screen transition-transform duration-150 ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default Background;
