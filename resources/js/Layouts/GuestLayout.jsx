import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div 
            className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-center select-none"
            style={{ backgroundImage: "url('/images/hero_background.jpg')" }}
        >
            {/* Elegant glassmorphic background layers */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[5px] z-0" />
            
            {/* Soft gradient ambient glow spheres behind the card */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] sm:w-[35rem] sm:h-[35rem] rounded-full bg-indigo-600/20 blur-3xl animate-pulse-slow z-0 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] rounded-full bg-violet-600/15 blur-3xl animate-pulse-slow z-0 pointer-events-none" style={{ animationDelay: '2s' }} />

            {/* Header logo / logo link */}
            <div className="relative z-10 mb-6 text-center animate-fade-in">
                <Link href="/" className="inline-flex flex-col items-center gap-2.5 group">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-indigo-400/50 transition-all duration-300">
                        <ApplicationLogo className="w-10 h-10 fill-current text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-wider uppercase drop-shadow-md">
                            Smart Inventory
                        </h2>
                        <p className="text-[9px] text-indigo-300/80 font-bold tracking-widest uppercase mt-0.5">
                            Enterprise Stock Engine
                        </p>
                    </div>
                </Link>
            </div>

            {/* Glassmorphic card container */}
            <div className="relative z-10 w-full sm:max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-8 animate-fade-in-up">
                {children}
            </div>
        </div>
    );
}

