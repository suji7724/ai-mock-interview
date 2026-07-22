import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
    
    
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const response = await api.post("/users/login/", formData);

      // Store Access Token
      localStorage.setItem("accessToken", response.data.access);

      // Store Refresh Token
      localStorage.setItem("refreshToken", response.data.refresh);

      // Store User Info
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect User
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }

    console.log("Login function triggered");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your interview preparation journey."
    >
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block mb-2 text-sm text-slate-300">
            Email Address
          </label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl px-4">
            <Mail className="text-slate-400" size={20} />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-transparent px-4 py-4 outline-none"
            />
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input type="checkbox" />
            Remember me
          </label>

          <button
            type="button"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Forgot Password?
          </button>
        </div>
        {/*The error message if login failed */}

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-semibold text-lg transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Bottom Text */}
      <p className="text-slate-400 mt-8 text-center">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
