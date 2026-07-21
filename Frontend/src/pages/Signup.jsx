import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { useState } from "react";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle Singup function
  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const response = await api.post("/users/register/", {
        full_name: username,
        email,
        password,
      });

      console.log(response.data);

      navigate("/login");
    } catch (error) {
      console.log(error);

      const resData = error.response?.data;
      if (resData) {
        if (typeof resData === "string") {
          setError(resData);
        } else if (resData.email) {
          setError(Array.isArray(resData.email) ? resData.email[0] : resData.email);
        } else if (resData.full_name) {
          setError(Array.isArray(resData.full_name) ? resData.full_name[0] : resData.full_name);
        } else if (resData.password) {
          setError(Array.isArray(resData.password) ? resData.password[0] : resData.password);
        } else if (resData.detail) {
          setError(resData.detail);
        } else if (resData.non_field_errors) {
          setError(Array.isArray(resData.non_field_errors) ? resData.non_field_errors[0] : resData.non_field_errors);
        } else {
          const firstKey = Object.keys(resData)[0];
          const val = resData[firstKey];
          setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
        }
      } else {
        setError("Network error or server unreachable. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your AI-powered interview preparation today."
    >
      <form onSubmit={handleSignup} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm text-slate-300">Full Name</label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl px-4">
            <User className="text-slate-400" size={20} />

            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent px-4 py-4 outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm text-slate-300">
            Email Address
          </label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl px-4">
            <Mail className="text-slate-400" size={20} />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent px-4 py-4 outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm text-slate-300">Password</label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl px-4">
            <Lock className="text-slate-400" size={20} />

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent px-4 py-4 outline-none"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-semibold text-lg transition"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Bottom Text */}
      <p className="text-slate-400 mt-8 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;
