import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import api from "../api/axios";
import { Upload, Briefcase, Brain, Clock3 } from "lucide-react";

function InterviewSetup() {
  // Form State
  const [formData, setFormData] = useState({
    role: "",
    skills: "",
    experience: "",
    interviewType: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // state for resume upload
  const fileInputRef = useRef(null);
  const [resume, setResume] = useState(null);

  // handle resume upload
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      console.log("Selected Resume:", resume);
      if (resume) {
        const resumeData = new FormData();

        resumeData.append("resume", resume);

        await api.post("/users/upload-resume/", resumeData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const response = await api.post(
        "/interviews/create/",
        {
          role: formData.role,

          interview_type: formData.interviewType,

          experience_level: formData.experience,
        }
      );

      const navigationState = {
        interviewId: response.data.id,
        interviewType: response.data.interview_type,
        role: response.data.role,
      };

      if (response.data.interview_type === "Assessment Round") {
        navigate("/assesment", {
          state: navigationState,
        });
      } else {
        navigate("/interview", {
          state: navigationState,
        });
      }
    } catch (error) {
      console.log(error);

      setError("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      {/* Page Heading */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-5xl font-bold">Setup Your Interview</h1>

        <p className="text-slate-400 mt-4 text-lg">
          Configure your AI-powered mock interview experience.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resume Upload */}
          <div>
            <label className="block text-lg font-medium mb-4">
              Upload Resume
            </label>

            <div
              className="
              border-2
              border-dashed
              border-slate-700
              hover:border-indigo-500/50
              transition
              rounded-3xl
              p-10
              text-center
              bg-slate-800/30
            "
            >
              <Upload className="mx-auto text-indigo-400 mb-4" size={40} />

              <p className="text-slate-300 text-lg">
                Drag & Drop your resume here
              </p>

              <p className="text-slate-500 mt-2">PDF, DOC, DOCX supported</p>

              <input
                type="file"
                accept=".pdf, .doc, .docx"
                ref={fileInputRef}
                onChange={handleResumeChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  mt-6
                  bg-indigo-600
                  hover:bg-indigo-700
                  px-6
                  py-3
                  rounded-2xl
                  font-medium
                  transition
                "
              >
                Browse File
              </button>

              {resume && (
                <p className="text-green-400 text-sm mt-3">
                  Selected: {resume.name}
                </p>
              )}
            </div>
          </div>

          {/* Grid Inputs */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Job Role */}
            <div>
              <label className="block mb-3 text-lg font-medium">Job Role</label>

              <div
                className="
                flex
                items-center
                bg-slate-800
                border
                border-slate-700
                rounded-2xl
                px-4
                focus-within:border-indigo-500
                transition
              "
              >
                <Briefcase className="text-slate-400" size={20} />

                <input
                  type="text"
                  name="role"
                  placeholder="Frontend Developer"
                  value={formData.role}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-transparent
                    text-white
                    placeholder:text-slate-500
                    px-4
                    py-4
                    outline-none
                  "
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block mb-3 text-lg font-medium">
                Experience Level
              </label>

              <div
                className="
                flex
                items-center
                bg-slate-800
                border
                border-slate-700
                rounded-2xl
                px-4
                focus-within:border-indigo-500
                transition
              "
              >
                <Clock3 className="text-slate-400" size={20} />

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-slate-800
                    text-white
                    px-4
                    py-4
                    outline-none
                    rounded-2xl
                    appearance-none
                  "
                >
                  <option value="" className="bg-slate-800 text-white">
                    Select Experience
                  </option>

                  <option value="Fresher" className="bg-slate-800 text-white">
                    Fresher
                  </option>

                  <option value="1-2 Years" className="bg-slate-800 text-white">
                    1-2 Years
                  </option>

                  <option value="3+ Years" className="bg-slate-800 text-white">
                    3+ Years
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block mb-3 text-lg font-medium">Skills</label>

            <div
              className="
              flex
              items-center
              bg-slate-800
              border
              border-slate-700
              rounded-2xl
              px-4
              focus-within:border-indigo-500
              transition
            "
            >
              <Brain className="text-slate-400" size={20} />

              <input
                type="text"
                name="skills"
                placeholder="React, Python, DSA"
                value={formData.skills}
                onChange={handleChange}
                className="
                  w-full
                  bg-transparent
                  text-white
                  placeholder:text-slate-500
                  px-4
                  py-4
                  outline-none
                "
              />
            </div>
          </div>

          {/* Interview Type */}
          <div>
            <label className="block mb-3 text-lg font-medium">
              Interview Type
            </label>

            <div className="grid md:grid-cols-3 gap-5">
              {["Technical", "HR Round", "Assessment Round"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      interviewType: type,
                    })
                  }
                  className={`
                    p-5
                    rounded-2xl
                    border
                    transition
                    duration-300
                    ${formData.interviewType === type
                      ? "bg-indigo-600 border-indigo-500"
                      : "bg-slate-800 border-slate-700 hover:border-indigo-500/40"
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              py-5
              rounded-2xl
              text-lg
              font-semibold
              transition
            "
          >
            {loading ? "Preparing AI Questions & Session..." : "Start AI Interview"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InterviewSetup;
