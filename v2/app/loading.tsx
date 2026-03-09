import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-cream)] dark:bg-[#0a1a13]">
      <div className="text-center">
        {/* Toto mascot with float animation — party toto for excitement */}
        <div className="w-20 h-20 relative mx-auto mb-5 animate-float">
          <Image
            src="/brand/totos/party_toto.png"
            alt="Toto mascot - page is loading"
            fill
            className="object-contain"
            sizes="80px"
            priority
          />
        </div>

        {/* Loading bar — brand gradient */}
        <div className="w-48 h-1.5 bg-[#E0C4BC]/30 dark:bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#E95331] via-[#E7B61B] to-[#6BBFAC] rounded-full animate-shimmer" 
               style={{ width: '60%' }} />
        </div>

        <p className="text-slate-400 dark:text-slate-500 text-sm mt-4 font-subtitle tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}
