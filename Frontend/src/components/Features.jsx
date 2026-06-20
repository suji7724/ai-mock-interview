import {
    Brain,
    Code2,
    FileText,
    BarChart3,
    Mic,
    ShieldCheck,
} from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "AI Interview Questions",
        description:
            "Generate personalized technical and HR interview questions instantly.",
    },
    {
        icon: Code2,
        title: "Coding/Online Assesment Round Practice",
        description:
            "Solve real coding interview questions with timer-based challenges.",
    },
    {
        icon: FileText,
        title: "Resume Analysis",
        description:
            "Upload your resume and receive AI-powered improvement suggestions.",
    },
    {
        icon: BarChart3,
        title: "Performance Analytics",
        description:
            "Track your interview performance and identify weak areas.",
    },
    {
        icon: Mic,
        title: "Voice Interaction",
        description:
            "Practice interviews using speech-based communication like real interviews.",
    },
    {
        icon: ShieldCheck,
        title: "Confidence Scoring",
        description:
            "Measure confidence, communication, and answer quality with AI.",
    },
];

function Features() {
    return (
        <section id="features" className="px-8 py-24 bg-slate-900/40 scroll-mt-20">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-16">
                    <p className="text-indigo-400 font-semibold mb-3">
                        FEATURES
                    </p>

                    <h2 className="text-4xl md:text-5xl font-bold">
                        Everything You Need to
                        <span className="text-indigo-500"> Ace Interviews</span>
                    </h2>

                    <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">
                        Our AI-powered platform helps students and professionals
                        prepare smarter and perform better in interviews.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/40 hover:-translate-y-2 transition duration-300"
                            >

                                <div className="bg-indigo-600/20 w-fit p-4 rounded-2xl mb-6">
                                    <Icon className="text-indigo-400" size={32} />
                                </div>

                                <h3 className="text-2xl font-semibold mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>

                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}

export default Features;