import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  Upload,
  Brain,
  Sparkles,
  Trophy,
  CheckCircle2,
  FileText,
  History,
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    "Extracting details from PDF resume...",
    "Scanning content against ATS parser regulations...",
    "Assessing job readiness thresholds...",
    "Compiling custom recommendations..."
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer simulation for step transitions during loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/users/past-analyses/");
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to load past analyses", error);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== "application/pdf") {
        toast.error("Please upload a PDF file only.");
        return;
      }
      setFile(selected);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a resume file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await api.post("/users/analyze-resume/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
      toast.success("Resume analyzed successfully!");
      fetchHistory(); // Refresh history list
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Failed to analyze resume. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResult(null);
  };

  // Score coloring helpers
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400 stroke-emerald-500";
    if (score >= 60) return "text-amber-400 stroke-amber-500";
    return "text-red-400 stroke-red-500";
  };

  const getReadinessBg = (readiness) => {
    if (readiness === "Ready") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (readiness === "Needs Improvement") return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-12 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
        {/* Background glow effects */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-purple-600/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              AI Resume <span className="text-indigo-500">Analyzer</span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Check your ATS score, market readiness, and get tailored AI suggestions.
            </p>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 self-start bg-slate-900 border border-slate-800 hover:border-indigo-500/50 px-5 py-3 rounded-2xl font-medium transition duration-300 shadow-md cursor-pointer"
          >
            <History size={18} />
            {showHistory ? "Back to Analyzer" : "Past Analyses"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showHistory ? (
            // HISTORY VIEW
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold">Your Analysis History</h2>
              {history.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-[30px] p-12 text-center text-slate-500">
                  <FileText className="mx-auto text-slate-600 mb-4" size={48} />
                  <p className="text-lg">No resume analyses recorded yet.</p>
                  <p className="text-sm mt-1 text-slate-600">Upload your first resume to see reports here.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setResult(item);
                        setShowHistory(false);
                      }}
                      className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 hover:scale-[1.01] rounded-[30px] p-6 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-slate-400 text-xs font-semibold">
                            {new Date(item.created_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          <h3 className="text-xl font-bold mt-1 text-slate-100 flex items-center gap-2">
                            ATS Score: <span className={getScoreColor(item.ats_score)}>{item.ats_score}</span>
                          </h3>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getReadinessBg(item.job_readiness)}`}>
                          {item.job_readiness}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                        {item.job_readiness_reason}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {item.skills_identified.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="bg-indigo-600/10 border border-indigo-500/15 text-indigo-400 text-xs px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {item.skills_identified.length > 4 && (
                          <span className="text-slate-500 text-xs self-center">
                            +{item.skills_identified.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : loading ? (
            // LOADING STEP SCREEN
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[40px] p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full"
                />
                <Brain className="absolute inset-0 m-auto text-indigo-400 animate-pulse" size={30} />
              </div>
              <h2 className="text-2xl font-bold mb-4">Analyzing Your Resume</h2>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-6 max-w-md">
                <motion.div
                  className="bg-indigo-500 h-full rounded-full"
                  animate={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-indigo-300 font-medium text-lg min-h-[30px]"
                >
                  {steps[loadingStep]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          ) : result ? (
            // RESULTS REPORT SCREEN
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Score & Badge Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 text-center flex flex-col items-center justify-center">
                  <h3 className="text-lg text-slate-400 font-semibold mb-6">ATS Compatibility</h3>

                  {/* Radial Gauge */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-slate-800 fill-none" strokeWidth="8" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        className={`fill-none stroke-current ${getScoreColor(result.ats_score)}`}
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * result.ats_score) / 100 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-5xl font-extrabold tracking-tight">{result.ats_score}</span>
                      <span className="text-slate-500 text-xs mt-1">out of 100</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mt-8 max-w-xs leading-relaxed">
                    This score measures layout parsability, key technology matches, and phrasing structure compatibility.
                  </p>
                </div>

                {/* Job Readiness */}
                <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8">
                  <h3 className="text-lg text-slate-400 font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-400" />
                    Market Readiness
                  </h3>
                  <div className={`px-4 py-3 rounded-2xl text-center font-bold text-lg mb-4 ${getReadinessBg(result.job_readiness)}`}>
                    {result.job_readiness.toUpperCase()}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {result.job_readiness_reason}
                  </p>
                </div>
              </div>

              {/* Suggestions Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Strengths & Improvements */}
                <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Strengths */}
                    <div>
                      <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                        <CheckCircle2 size={22} />
                        Core Strengths
                      </h3>
                      <ul className="space-y-4">
                        {result.strengths.map((str, idx) => (
                          <li key={idx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                            <span className="text-emerald-500 text-lg font-bold">•</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div>
                      <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
                        <AlertCircle size={22} />
                        Areas of Improvement
                      </h3>
                      <ul className="space-y-4">
                        {result.improvements.map((imp, idx) => (
                          <li key={idx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                            <span className="text-amber-500 text-lg font-bold">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Skills Identified */}
                <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8">
                  <h3 className="text-xl font-bold text-indigo-400 mb-6 flex items-center gap-2">
                    <Award size={22} />
                    Identified Skills & Keyphrases
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {result.skills_identified.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600/20 hover:-translate-y-0.5 transition duration-150"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetAnalyzer}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 rounded-2xl font-semibold transition cursor-pointer flex-1"
                  >
                    Analyze New Resume
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            // UPLOAD UPLOADER SCREEN
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-12 text-center max-w-3xl mx-auto shadow-xl"
            >
              <form onSubmit={handleUploadSubmit} className="space-y-8">
                <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition-all rounded-[30px] p-12 bg-slate-950/30 flex flex-col items-center justify-center">
                  <div className="p-5 rounded-2xl bg-indigo-600/10 border border-indigo-500/25 mb-4">
                    <Upload className="text-indigo-400" size={36} />
                  </div>
                  <p className="text-xl font-semibold text-slate-200">
                    Upload your PDF Resume
                  </p>
                  <p className="text-slate-500 mt-2 text-sm max-w-sm">
                    Our AI parser reviews layout compliance, keyword matching, and format compatibility rules.
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-2xl font-semibold transition cursor-pointer"
                  >
                    Select PDF File
                  </button>

                  {file && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-400 font-medium text-sm mt-5 bg-green-500/10 border border-green-500/15 px-4 py-2 rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Selected: {file.name}
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!file || loading}
                  className="w-full bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-5 rounded-2xl text-lg font-bold transition duration-300 shadow-lg shadow-indigo-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  {loading ? "Analyzing Resume..." : "Launch ATS & Readiness Critique"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default ResumeAnalyzer;
