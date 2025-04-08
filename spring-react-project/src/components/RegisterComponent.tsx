import React, { useState } from "react";
import { registerApiCall } from "../service/auth.service";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";

export type RegisterDto = {
  username: string;
  password: string;
  email: string;
};

export default function RegisterComponent() {
  const { isDarkTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!username || !password || !email) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const registerDto: RegisterDto = { username, password, email };
      await registerApiCall(registerDto);
      navigate("/login");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDarkTheme ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create a New Account</h2>
        {error && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              isDarkTheme ? "bg-red-800 text-white" : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}
        <form onSubmit={registerHandler} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                isDarkTheme
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                isDarkTheme
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 ${
                isDarkTheme
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-400"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2.5 rounded-md text-white font-medium transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner"></span> Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className={`font-medium ${
                isDarkTheme ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"
              }`}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
