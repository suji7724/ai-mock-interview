import { BrainCircuit } from "lucide-react";

function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full"></div>

            <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 bg-slate-900/80 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">

                {/* Left Side */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-purple-700">

                    <div>
                        <div className="flex items-center gap-3">
                            <BrainCircuit size={40} />
                            <h1 className="text-3xl font-bold">
                                BitWisePrep
                            </h1>
                        </div>

                        <h2 className="text-5xl font-bold mt-16 leading-tight">
                            Practice Smarter.
                            <br />
                            Crack Interviews Faster.
                        </h2>

                        <p className="mt-8 text-indigo-100 text-lg leading-relaxed">
                            AI-powered mock interviews, resume analysis,
                            coding rounds, and personalized feedback —
                            all in one platform.
                        </p>
                    </div>

                    <div className="text-indigo-100 text-sm">
                        © 2026 BitWisePrep
                    </div>
                </div>

                {/* Right Side */}
                <div className="p-8 md:p-14 flex flex-col justify-center">

                    <div className="mb-10">
                        <h2 className="text-4xl font-bold">
                            {title}
                        </h2>

                        <p className="text-slate-400 mt-3 text-lg">
                            {subtitle}
                        </p>
                    </div>

                    {children}

                </div>
            </div>
        </div>
    );
}

export default AuthLayout;