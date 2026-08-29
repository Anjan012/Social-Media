import React from "react";

const VynkLoader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-[#ffffff]">
      {/* Soft ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]" />

      <div className="relative flex flex-col items-center">
        {/* Outer floating ring */}
        <div className="absolute -inset-8 rounded-full border border-red-500/20 animate-spin-slow" />
        <div className="absolute -inset-12 rounded-full border border-red-500/10 animate-spin-slower" />

        {/* Logo container */}
        <div className="relative">
          {/* Soft glow behind logo */}
          <div className="absolute inset-0 rounded-full bg-red-500/30 blur-2xl scale-150 animate-pulse-glow" />

          <div className="relative vynk-logo-animation">
            <img
              src="/vynk-logo-2.png"
              alt="Vynk"
              className="w-28 h-28 object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.45)]"
            />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="mt-8 text-5xl font-bold tracking-tighter bg-gradient-to-r from-red-400 via-red-500 to-rose-600 bg-clip-text text-transparent animate-text-shine">
          Vynk
        </h1>

        {/* Subtle tagline */}
        <p className="mt-2 text-sm tracking-widest text-white/40 uppercase">
          Connecting moments
        </p>

        {/* Loading dots */}
        <div className="mt-10 flex items-center gap-2">
          <span className="loading-dot" />
          <span className="loading-dot animation-delay-150" />
          <span className="loading-dot animation-delay-300" />
        </div>
      </div>

      <style jsx>{`
        @keyframes logo-breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.15);
          }
        }

        @keyframes text-shine {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes dot-bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.35;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .vynk-logo-animation {
          animation: logo-breathe 2.8s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2.8s ease-in-out infinite;
        }

        .animate-text-shine {
          background-size: 200% auto;
          animation: text-shine 4s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 18s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 28s linear infinite;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #ef4444;
          animation: dot-bounce 1.4s ease-in-out infinite;
        }

        .animation-delay-150 {
          animation-delay: 0.15s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default VynkLoader;