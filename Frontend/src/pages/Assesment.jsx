import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

import { Clock3, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

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

  // Result State
  const [result, setResult] = useState(null);

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

  //Loading Ui
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

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        {/* Background Glow */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-green-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="
          relative
          z-10
          bg-slate-900
          border
          border-slate-800
          rounded-[40px]
          p-10
          w-full
          max-w-xl
          text-center
          shadow-2xl
        "
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`
              w-24
              h-24
              rounded-full
              flex
              items-center
              justify-center
              ${passed ? "bg-green-500/20" : "bg-red-500/20"}
            `}
            >
              <CheckCircle2
                size={50}
                className={passed ? "text-green-400" : "text-red-400"}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-4">
            Assessment Completed
          </h1>

          <p className="text-slate-400 text-lg mb-10">
            Here’s your performance summary
          </p>

          {/* Score */}
          <div className="bg-slate-800 rounded-3xl p-8 mb-8">
            <h2 className="text-6xl font-bold text-white">
              {result.score}
              <span className="text-slate-500 text-3xl">/{result.total}</span>
            </h2>

            <p className="text-slate-400 mt-3 text-lg">Correct Answers</p>
          </div>

          {/* Percentage */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-3">
              <span>Performance</span>
              <span>{percentage}%</span>
            </div>

            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8 }}
                className={`
                h-full
                rounded-full
                ${passed ? "bg-green-500" : "bg-red-500"}
              `}
              />
            </div>
          </div>

          {/* Status */}
          <div
            className={`
            mb-8
            py-4
            rounded-2xl
            font-semibold
            text-lg
            ${
              passed
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }
          `}
          >
            {passed ? "PASSED" : "FAILED"}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="
              flex-1
              bg-indigo-600
              hover:bg-indigo-700
              py-4
              rounded-2xl
              font-semibold
              transition
            "
            >
              Retake Test
            </button>
          </div>
        </motion.div>
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
