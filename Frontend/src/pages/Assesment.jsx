import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

import { Clock3, ChevronRight, ChevronLeft, CheckCircle2, XCircle, RotateCcw, FileText } from "lucide-react";

import { motion } from "framer-motion";

function Assessment() {
  const location = useLocation();
  const { interviewId } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Current Question Index
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Selected Answers
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Result State & Filter
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "incorrect", "correct"

  // Timer (30 minutes for 35 questions)
  const [time, setTime] = useState(1800);

  const question = questions[currentQuestion] || {};

  // Fetch Function
  const fetchQuestions = async () => {
    try {
      const response = await api.get("/assessment/questions/", {
        params: {
          interview_id: interviewId
        }
      });

      console.log(response.data);

      setQuestions(response.data);
    } catch (err) {
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Timer Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          handleSubmit();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Format Time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Select Answer
  const handleSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: option,
    });
  };

  // Next Question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Previous Question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Submit Assessment
  const handleSubmit = async () => {
    try {
      const response = await api.post(
        "/assessment/submit/",
        {
          answers: selectedAnswers,
          interview_id: interviewId,
        }
      );

      console.log(response.data);

      setResult(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Loading Ui
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="
      w-16
      h-16
      border-4
      border-indigo-500
      border-t-transparent
      rounded-full
    "
        />
      </div>
    );
  }
  //  Handle Error
  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }
  // result Handle
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const passed = percentage >= 60;

    const analysisDetails = result?.details || questions.map((q) => {
      const userAns = selectedAnswers[q.id];
      return {
        id: q.id,
        question: q.question,
        options: q.options,
        user_answer: userAns || "Not Answered",
        correct_answer: q.correct_answer,
        category: q.category,
        is_correct: userAns === q.correct_answer,
      };
    });

    const filteredDetails = analysisDetails.filter((item) => {
      if (filter === "incorrect") return !item.is_correct;
      if (filter === "correct") return item.is_correct;
      return true;
    });

    const incorrectCount = analysisDetails.filter((d) => !d.is_correct).length;
    const correctCount = analysisDetails.filter((d) => d.is_correct).length;

    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-green-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-10">
          {/* Summary Card Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-[36px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-center mb-6">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  passed ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                <CheckCircle2
                  size={50}
                  className={passed ? "text-green-400" : "text-red-400"}
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Assessment Completed
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              Review your performance metrics and answer breakdown below
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-1">Score</p>
                <h3 className="text-4xl font-bold text-white">
                  {result.score} <span className="text-slate-500 text-xl">/{result.total}</span>
                </h3>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-1">Percentage</p>
                <h3 className="text-4xl font-bold text-indigo-400">{percentage}%</h3>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6">
                <p className="text-slate-400 text-sm mb-1">Result Status</p>
                <h3 className={`text-4xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}>
                  {passed ? "PASSED" : "FAILED"}
                </h3>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${passed ? "bg-green-500" : "bg-red-500"}`}
                />
              </div>
            </div>

            {/* Retake Button */}
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl font-semibold transition flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Retake Assessment
              </button>
            </div>
          </motion.div>

          {/* Detailed Question Analysis & Mistake Review */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <FileText className="text-indigo-400" size={28} />
                  Question & Mistake Analysis
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Examine your answers, pinpoint mistakes, and review explanations.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl gap-1 self-start sm:self-auto">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    filter === "all" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  All ({analysisDetails.length})
                </button>
                <button
                  onClick={() => setFilter("incorrect")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    filter === "incorrect" ? "bg-red-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mistakes ({incorrectCount})
                </button>
                <button
                  onClick={() => setFilter("correct")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    filter === "correct" ? "bg-green-600 text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Correct ({correctCount})
                </button>
              </div>
            </div>

            {/* Questions Review List */}
            <div className="space-y-6">
              {filteredDetails.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-slate-900 border rounded-3xl p-6 md:p-8 ${
                    item.is_correct ? "border-slate-800" : "border-red-500/40"
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-400">Q{index + 1}</span>
                      {item.category && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    {item.is_correct ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                        <CheckCircle2 size={14} /> Correct
                      </span>
                    ) : item.user_answer === "Not Answered" ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <XCircle size={14} /> Unanswered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        <XCircle size={14} /> Incorrect
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-white leading-relaxed">
                    {item.question}
                  </h3>

                  {/* Options */}
                  <div className="grid gap-3">
                    {item.options?.map((option, optIdx) => {
                      const isSelected = item.user_answer === option;
                      const isRightAnswer = item.correct_answer === option;

                      let cardStyle = "bg-slate-800/50 border-slate-700/50 text-slate-300";
                      if (isRightAnswer) {
                        cardStyle = "bg-green-500/15 border-green-500/60 text-green-200 font-semibold";
                      } else if (isSelected && !isRightAnswer) {
                        cardStyle = "bg-red-500/15 border-red-500/60 text-red-200 font-semibold";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-4 md:p-5 rounded-2xl border transition flex items-center justify-between gap-4 ${cardStyle}`}
                        >
                          <span className="text-base">{option}</span>

                          <div className="flex items-center gap-2 shrink-0">
                            {isRightAnswer && (
                              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 font-bold border border-green-500/40">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isSelected && !isRightAnswer && (
                              <span className="text-xs px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                                ✗ Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-indigo-600/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-purple-600/20 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
          {/* Left */}
          <div>
            <p className="text-indigo-400 font-medium mb-3">
              ONLINE ASSESSMENT
            </p>

            <h1 className="text-2xl font-bold">role-based assessment</h1>

            <p className="text-slate-400 mt-4 text-lg">
              Answer all questions before submitting.
            </p>
          </div>

          {/* Timer */}
          <div
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            px-8
            py-6
            flex
            items-center
            gap-5
          "
          >
            <div
              className="
              w-16
              h-16
              rounded-2xl
              bg-indigo-600/20
              flex
              items-center
              justify-center
            "
            >
              <Clock3 className="text-indigo-400" size={30} />
            </div>

            <div>
              <p className="text-slate-400">Remaining Time</p>

              <h2 className="text-4xl font-bold mt-1">{formatTime(time)}</h2>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </p>

            <p className="text-indigo-400 font-medium">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </p>
          </div>

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
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
              className="
                h-full
                bg-gradient-to-r
                from-indigo-500
                to-purple-600
              "
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-[40px]
            p-8
            md:p-12
          "
        >
          {question?.category && (
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wide uppercase">
                {question.category}
              </span>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold leading-relaxed">
            {question?.question}
          </h2>

          {/* Options */}
          <div className="grid gap-5 mt-10">
            {question?.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                className={`
                  w-full
                  text-left
                  p-6
                  hover:scale-[1.02]
                  rounded-3xl
                  border
                  transition
                  duration-300
                  flex
                  items-center
                  justify-between
                  ${
                    selectedAnswers[question.id] === option
                      ? "bg-indigo-600 border-indigo-500"
                      : "bg-slate-800 border-slate-700 hover:border-indigo-500/40"
                  }
                `}
              >
                <span className="text-lg">{option}</span>

                {selectedAnswers[question.id] === option && (
                  <CheckCircle2 size={24} />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bottom Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-8">
          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="
              w-full
              sm:w-auto
              bg-slate-800
              hover:bg-slate-700
              disabled:opacity-40
              px-8
              py-4
              rounded-2xl
              flex
              items-center
              justify-center
              gap-2
              transition
            "
          >
            <ChevronLeft size={22} />
            Previous
          </button>

          {/* Right Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Next */}
            {currentQuestion < questions.length - 1 && (
              <button
                onClick={handleNext}
                disabled={!selectedAnswers[question.id]}
                className="
                  bg-indigo-600
                  hover:bg-indigo-700
                  px-8
                  py-4
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                Next Question
                <ChevronRight size={22} />
              </button>
            )}

            {/* Submit */}
            {currentQuestion === questions.length - 1 && (
              <button
                onClick={handleSubmit}
                className="
                  bg-green-600
                  hover:bg-green-700
                  px-8
                  py-4
                  rounded-2xl
                  font-semibold
                  transition
                "
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assessment;
