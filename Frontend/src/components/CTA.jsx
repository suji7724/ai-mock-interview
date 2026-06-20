import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CTA() {
    const navigate = useNavigate();

    const handleStartInterview = () => {
        navigate("/interview-setup");
    };

    const handleLearnMore = () => {
        const element = document.getElementById("features");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="px-8 py-24">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden bg-gradient-to-r from-indigo-800 to-purple-700 rounded-[40px] p-10 md:p-20 text-center">
                    {/* Glow Effect */}
                    <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-[-50px] left-[-50px]"></div>

                    <div className="absolute w-72 h-72 bg-pink-500/20 rounded-full blur-3xl bottom-[-50px] right-[-50px]"></div>

                    {/* Content */}
                    <div className="relative z-10">

                        <p className="text-indigo-100 font-semibold mb-4 tracking-wide">
                            START YOUR JOURNEY
                        </p>

                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Ready to Crack Your
                            <br />
                            Dream Job Interview?
                        </h2>

                        <p className="text-indigo-100 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                            Practice technical and HR interviews with AI-powered
                            feedback, analytics, and personalized guidance.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">

                            <button 
                                onClick={handleStartInterview}
                                className="bg-white text-slate-900 hover:bg-slate-200 px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition"
                            >
                                Start Free Interview
                                <ArrowRight size={20} />
                            </button>

                            <button 
                                onClick={handleLearnMore}
                                className="border border-white/30 hover:border-white px-8 py-4 rounded-2xl font-semibold transition"
                            >
                                Learn More
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};
export default CTA;