import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

import {
  Clock3,
  Mic,
  Video,
  BrainCircuit,
  ChevronRight,
  X,
} from "lucide-react";

import { motion } from "framer-motion";

function InterviewScreen() {
  const location = useLocation();

  const navigate = useNavigate();

  const { interviewId, interviewType } = location.state || {};

  const [time, setTime] = useState(0);

  console.log(location.state);
  console.log(interviewId);

  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [interviewSubmitted, setInterviewSubmitted] = useState(false);

  // timer logic
  useEffect(() => {
    switch (interviewType) {
      case "Technical":
        setTime(20 * 60);
        break;

      case "HR":
        setTime(10 * 60);
        break;

      case "Assessment Round":
        setTime(30 * 60);
        break;

      default:
        setTime(15 * 60);
    }
  }, [interviewType]);

  // fetch question from database
  const question = questions[currentQuestion] || {};
  // fetching questions
  useEffect(() => {
    if (interviewType && interviewType.toLowerCase().includes("assessment")) {
      navigate("/assesment", { state: { interviewId, interviewType } });
      return;
    }
    fetchQuestions();
  }, [interviewId, interviewType]);
  // this is the fetch function
  const fetchQuestions = async () => {
    try {
      const response = await api.get(
        `/interviews/questions/?interview_id=${interviewId}`
      );

      console.log(response.data);

      setQuestions(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Timer Logic
  useEffect(() => {
    if (time === 0) return;

    if (time <= 0 && !interviewSubmitted) {
      setInterviewSubmitted(true);

      handleSubmitInterview();

      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, interviewSubmitted]);

  // Format Timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // handle next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitInterview();
    }
    console.log(currentQuestion);
    console.log(questions.length);
  };

  //handle submit interview
  const handleSubmitInterview = async () => {
    if (submitting) return;
    console.log("Submitting Interview");
    try {
      setSubmitting(true);

      for (const q of questions) {
        const answerText = answers[q.id] || "";
        await api.post(
          "/interviews/submit-answer/",
          {
            interview: interviewId,
            question: q.id,
            answer_text: answerText,
          }
        );
      }

      toast.success("Interview submitted successfully!");

      navigate(`/feedback/${interviewId}`, {
        replace: true,
        state: {
          completed: true,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  // for loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-purple-600/20 blur-3xl rounded-full"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center text-center max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
        >
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <BrainCircuit className="w-8 h-8 text-indigo-400 absolute inset-0 m-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Initializing AI Session
          </h2>
          <p className="text-slate-400 text-sm">
            Fetching customized questions tailored to your profile and target role...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-purple-600/20 blur-3xl rounded-full"></div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="
            flex-1
            border-r
            border-slate-800
            p-6
            md:p-10
            flex
            flex-col
            justify-between
          "
        >
          {/* Top */}
          <div>
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="bg-indigo-600/20 border border-indigo-500/30 px-5 py-2 rounded-full text-indigo-300 text-sm font-medium">
                {question.category}
              </div>

              <div className="bg-slate-800 border border-slate-700 px-5 py-2 rounded-full text-slate-300 text-sm">
                {question.difficulty}
              </div>
            </div>

            {/* Question Card */}
            <div
              className="
              bg-slate-900/80
              border
              border-slate-800
              rounded-[40px]
              p-8
              md:p-10
              backdrop-blur-xl
            "
            >
              <p className="text-slate-400 text-lg mb-6">Interview Question</p>

              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {question.question_text}
              </h1>
            </div>
          </div>

          {/* Answer Section */}
          <div className="mt-10">
            <textarea
              placeholder="Type your answer here..."
              value={answers[question.id] || ""}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [question.id]: e.target.value,
                })
              }
              className="
                w-full
                h-52
                bg-slate-900
                border
                border-slate-800
                rounded-[30px]
                p-6
                text-lg
                text-white
                placeholder:text-slate-500
                outline-none
                resize-none
                focus:border-indigo-500
                transition
              "
            />

            {/* Bottom Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mt-6">
              <button
                type="button"
                onClick={handleSubmitInterview}
                className="
                w-full sm:w-auto
                flex
                items-center
                justify-center
                gap-2
                bg-red-500/20
                border
                border-red-500/30
                hover:bg-red-500/30
                px-6
                py-4
                rounded-2xl
                transition
              "
              >
                <X size={20} />
                End Interview
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="
                w-full sm:w-auto
                flex
                items-center
                justify-center
                gap-2
                bg-indigo-600
                hover:bg-indigo-700
                px-8
                py-4
                rounded-2xl
                text-lg
                font-semibold
                transition
              "
              >
                {submitting ? (
                  "Submitting..."
                ) : currentQuestion < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight size={22} />
                  </>
                ) : (
                  <>
                    Submit Interview
                    <ChevronRight size={22} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="
            w-full
            lg:w-[420px]
            p-6
            md:p-8
            flex
            flex-col
            gap-6
          "
        >
          {/* Timer Card */}
          <div
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-6
          "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400">Remaining Time</p>

                <div>
                  <h2 className="text-5xl font-bold mt-3">
                    {formatTime(time)}
                  </h2>

                  {time <= 60 && (
                    <p className="text-red-400 mt-2 animate-pulse text-sm">
                      Less than 1 minute remaining!
                    </p>
                  )}
                </div>
              </div>

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
            </div>
          </div>

          {/* Webcam Section */}
          <div
            className="
            flex-1
            bg-slate-900
            border
            border-slate-800
            rounded-[35px]
            p-6
            flex
            flex-col
          "
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Live Camera</h3>

              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Recording
              </div>
            </div>

            {/* Fake Webcam */}
            <div
              className="
              flex-1
              rounded-3xl
              bg-gradient-to-br
              from-slate-800
              to-slate-900
              border
              border-slate-700
              flex
              items-center
              justify-center
              relative
              overflow-hidden
            "
            >
              <div
                className="
                absolute
                w-72
                h-72
                bg-indigo-500/10
                blur-3xl
                rounded-full
              "
              ></div>

              <div className="relative z-10 text-center">
                <div
                  className="
                  w-28
                  h-28
                  rounded-full
                  bg-indigo-600/20
                  border
                  border-indigo-500/30
                  flex
                  items-center
                  justify-center
                  mx-auto
                "
                >
                  <Video className="text-indigo-400" size={42} />
                </div>

                <p className="text-slate-400 mt-6">Camera Preview</p>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                className="
                bg-slate-800
                hover:bg-slate-700
                py-4
                rounded-2xl
                flex
                items-center
                justify-center
                gap-2
                transition
              "
              >
                <Mic size={20} />
                Mute
              </button>

              <button
                className="
                bg-indigo-600
                hover:bg-indigo-700
                py-4
                rounded-2xl
                flex
                items-center
                justify-center
                gap-2
                transition
              "
              >
                <BrainCircuit size={20} />
                AI Active
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InterviewScreen;
