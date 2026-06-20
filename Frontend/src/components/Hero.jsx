import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

function Hero() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    current_role: "",
    ai_score: 0,
    questions_solved: 0,
    interviews_taken: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/users/dashboard/");
        const data = response.data;
        const recent = data.recent_interviews || [];
        const lastInterview = recent.length > 0 ? recent[0] : null;

        setStats({
          current_role: lastInterview
            ? `${lastInterview.role} (${lastInterview.type})`
            : "No Interview Yet",
          ai_score: lastInterview
            ? `${lastInterview.score}%`
            : (data.average_score ? `${data.average_score}%` : "0%"),
          questions_solved: data.questions_practiced || 0,
          interviews_taken: data.total_interviews || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLearnMore = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="px-8 py-20 md:py-32">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-indigo-400 font-semibold mb-4">
            AI-Powered Interview Preparation
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Crack Your
            <span className="text-indigo-500"> Dream Job </span>
            with AI Mock Interviews
          </h1>

          <p className="text-slate-400 text-lg mt-6 leading-relaxed">
            Practice technical, HR, and coding interviews with real-time AI
            feedback and performance analysis.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/interview-setup")}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Start Interview
            </button>

            <button 
              onClick={handleLearnMore}
              className="border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-xl font-semibold transition"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Side Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
        >
          <div className="space-y-6">
            <div className="bg-slate-800 p-4 rounded-2xl">
              <p className="text-sm text-slate-400">Current Interview</p>
              <h2 className="text-xl font-semibold mt-2">
                {stats.current_role || "No Interview Yet"}
              </h2>
            </div>

            <div className="bg-indigo-600/20 border border-indigo-500/30 p-4 rounded-2xl">
              <p className="text-indigo-300 font-medium">AI Feedback Score</p>
              <h1 className="text-5xl font-bold mt-3">{stats.ai_score}</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-2xl">
                <p className="text-slate-400 text-sm">Questions Solved</p>
                <h2 className="text-3xl font-bold mt-2">
                  {stats.questions_solved}+
                </h2>
              </div>

              <div className="bg-slate-800 p-4 rounded-2xl">
                <p className="text-slate-400 text-sm">Interviews Taken</p>
                <h2 className="text-3xl font-bold mt-2">
                  {stats.interviews_taken}+
                </h2>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
