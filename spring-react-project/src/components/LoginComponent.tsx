// LoginComponent.tsx
import React, { useState } from "react";
import { LoginDto } from "../ds/dto";
import { loginApiCall, setToken, setLoggedInUserName, setUserId } from "../service/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { useUserInfo } from "./ContextProvider";
import { getUserInfo } from "../service/user.service";
import { useTheme } from "./ThemeContext";

export default function LoginComponent() {
  const { isDarkTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useUserInfo();

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginDto: LoginDto = {
      username,
      password,
    };

    try {
      const response = await loginApiCall(loginDto);
      const token = response.data.token;
      const userId = response.data.id;

      if (!token || !userId) {
        throw new Error("Invalid login response: missing token or user ID");
      }

      // Set authentication details
      setToken(token);
      setUserId(userId);
      setLoggedInUserName(username);

      // Fetch and set user info
      const userResponse = await getUserInfo(userId);
      setUserInfo(userResponse.data);

      // Navigate to home
      navigate("/home");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Invalid username or password");
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
        <h2 className="text-2xl font-bold text-center mb-6">Log in to your account</h2>
        {error && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              isDarkTheme ? "bg-red-800 text-white" : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}
        <form onSubmit={loginHandler} className="space-y-4">
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
                <span className="loading loading-spinner"></span> Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className={`font-medium ${
                isDarkTheme ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"
              }`}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}