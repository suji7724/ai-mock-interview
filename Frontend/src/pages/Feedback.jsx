import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  Trophy,
  Brain,
  MessageSquare,
  Sparkles,
  CircleCheckBig,
  TriangleAlert,
} from "lucide-react";

import { motion } from "framer-motion";

function Feedback() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      navigate("/", {
        replace: true,
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const fetchFeedback = async () => {
    try {
      const response = await api.get(`/feedback/interview/${id}/`);

      console.log(response.data);

      setFeedback(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="
            min-h-screen
            bg-slate-950
            flex
            items-center
            justify-center
            text-white
        "
      >
        Loading Feedback...
      </div>
    );
  }

  const scores = [
    {
      title: "Technical Knowledge",
      value: feedback.technical_score,
      icon: Brain,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      title: "Communication",
      value: feedback.communication_score,
      icon: MessageSquare,
      color: "from-green-500 to-emerald-700",
    },
    {
      title: "Overall Performance",
      value: feedback.overall_score,
      icon: Sparkles,
      color: "from-purple-500 to-violet-700",
    },
  ];

  let performanceTitle = "";
  let performanceSubtitle = "";

  if (feedback.overall_score >= 85) {
    performanceTitle = "Excellent";
    performanceSubtitle = "Performance!";
  } else if (feedback.overall_score >= 70) {
    performanceTitle = "Good";
    performanceSubtitle = "Performance!";
  } else if (feedback.overall_score >= 50) {
    performanceTitle = "Average";
    performanceSubtitle = "Performance!";
  } else {
    performanceTitle = "Needs";
    performanceSubtitle = "Improvement!";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-indigo-600/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-purple-600/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-gradient-to-r
            from-indigo-600
            to-purple-700
            rounded-[40px]
            p-8
            md:p-12
            overflow-hidden
            relative
          "
        >
          <div className="absolute w-72 h-72 bg-white/10 blur-3xl rounded-full top-[-80px] right-[-80px]"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Left */}
            <div>
              <p className="text-indigo-100 font-medium mb-4">
                AI INTERVIEW FEEDBACK
              </p>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                {performanceTitle}
                <br />
                {performanceSubtitle}
              </h1>

              <p className="text-indigo-100 text-lg mt-6 max-w-2xl leading-relaxed">
                {feedback.recommendation}
              </p>
            </div>

            {/* Right Score */}
            <div
              className="
              bg-white/10
              backdrop-blur-xl
              border
              border-white/20
              rounded-[35px]
              p-10
              text-center
              min-w-[250px]
            "
            >
              <div
                className="
                w-24
                h-24
                rounded-full
                bg-white/10
                flex
                items-center
                justify-center
                mx-auto
                mb-6
              "
              >
                <Trophy size={42} />
              </div>

              <p className="text-indigo-100">Overall Score</p>

              <h2 className="text-7xl font-bold mt-3">
                {feedback.overall_score}%
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {scores.map((score, index) => {
            const Icon = score.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-[35px]
                  p-8
                "
              >
                <div
                  className="
                  flex
                  items-center
                  justify-between
                  mb-8
                "
                >
                  <div>
                    <p className="text-slate-400">{score.title}</p>

                    <h2 className="text-5xl font-bold mt-4">{score.value}%</h2>
                  </div>

                  <div
                    className={`
                    w-16
                    h-16
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    bg-gradient-to-br
                    ${score.color}
                  `}
                  >
                    <Icon size={28} />
                  </div>
                </div>

                {/* Progress */}
                <div
                  className="
                  w-full
                  h-3
                  bg-slate-800
                  rounded-full
                  overflow-hidden
                "
                >
                  <div
                    style={{
                      width: `${score.value}%`,
                    }}
                    className={`
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      ${score.color}
                    `}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-[35px]
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <CircleCheckBig className="text-green-400" size={28} />

              <h2 className="text-3xl font-bold">Strengths</h2>
            </div>

            <div className="space-y-5">
              <div
                className="
        bg-slate-800/60
        border
        border-slate-700
        rounded-2xl
        p-5
    "
              >
                {feedback.strengths}
              </div>
            </div>
          </motion.div>

          {/* Improvements */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-[35px]
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <TriangleAlert className="text-yellow-400" size={28} />

              <h2 className="text-3xl font-bold">Improvements</h2>
            </div>

            <div className="space-y-5">
              <div
                className="
        bg-slate-800/60
        border
        border-slate-700
        rounded-2xl
        p-5
    "
              >
                {feedback.weaknesses}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
