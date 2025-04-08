import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import HomeComponent from "./components/HomeComponent";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import ProfileComponent from "./components/ProfileComponent";
import EditProfileComponent from "./components/EditProfileComponent";
import { isLoggedIn, isAdmin } from "./service/auth.service";
import { UserInfoProvider } from "./components/ContextProvider";
import MessageComponent from "./components/MessageComponent";
import NotificationComponent from "./components/NotificationComponent";
import FriendsComponent from "./components/FriendsComponent";
import { ThemeProvider } from "./components/ThemeContext";

export default function App() {
  const beAdmin = isAdmin();

  const AuthenticatedRoute = ({ children }) => {
    if (!isLoggedIn()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const AdminAuthenticatedRoute = ({ children }) => {
    if (!isAdmin()) {
      return <Navigate to="/home" />;
    }
    return children;
  };

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider>
        <UserInfoProvider>
          <HeaderComponent />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={<AuthenticatedRoute><HomeComponent /></AuthenticatedRoute>}
            />
            <Route
              path="/profile/:username"
              element={<AuthenticatedRoute><ProfileComponent /></AuthenticatedRoute>}
            />
            <Route
              path="/edit-profile/:username"
              element={<AuthenticatedRoute><EditProfileComponent /></AuthenticatedRoute>}
            />
            <Route
              path="/friends"
              element={<AuthenticatedRoute><FriendsComponent /></AuthenticatedRoute>}
            />
            <Route
              path="/messages"
              element={<AuthenticatedRoute><MessageComponent /></AuthenticatedRoute>}
            />
            <Route
              path="/notifications"
              element={<AuthenticatedRoute><NotificationComponent /></AuthenticatedRoute>}
            />

            {/* Admin-Only Routes */}
            {beAdmin && (
              <Route
                path="/admin-dashboard"
                element={<AdminAuthenticatedRoute><h2>Admin Dashboard</h2></AdminAuthenticatedRoute>}
              />
            )}

            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
          </UserInfoProvider>
          </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}