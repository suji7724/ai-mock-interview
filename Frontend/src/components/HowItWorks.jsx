import {
    Upload,
    Briefcase,
    Video,
    BarChart3,
} from "lucide-react";

const steps = [
    {
        icon: Upload,
        title: "Upload Resume",
        description:
            "Upload your resume to personalize interview questions based on your skills and experience.",
    },
    {
        icon: Briefcase,
        title: "Choose Job Role",
        description:
            "Select your target role, experience level, and preferred interview category.",
    },
    {
        icon: Video,
        title: "Start AI Interview",
        description:
            "Practice technical and HR interviews with realistic AI-powered interaction.",
    },
    {
        icon: BarChart3,
        title: "Get AI Feedback",
        description:
            "Receive detailed feedback, confidence analysis, and improvement suggestions.",
    },
];

function HowItWorks() {
    return (
        <section className="px-8 py-24">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-20">
                    <p className="text-indigo-400 font-semibold mb-4">
                        HOW IT WORKS
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        Prepare Smarter in
                        <span className="text-indigo-500"> 4 Simple Steps</span>
                    </h2>

                    <p className="text-slate-400 text-lg mt-6 max-w-2xl mx-auto">
                        Our AI-powered platform makes interview preparation
                        personalized, interactive, and effective.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={index}
                                className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/40 hover:-translate-y-2 transition duration-300"
                            >

                                {/* Step Number */}
                                <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className="bg-indigo-600/20 w-fit p-4 rounded-2xl mb-6 mt-4">
                                    <Icon className="text-indigo-400" size={30} />
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-semibold mb-4">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-400 leading-relaxed">
                                    {step.description}
                                </p>

                            </div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}

export default HowItWorks;