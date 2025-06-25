import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HeaderComponent from "./components/HeaderComponent";
import HomeComponent from "./components/HomeComponent";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import ProfileComponent from "./components/ProfileComponent";
import FriendsComponent from "./components/FriendsComponent";
import MessageComponent from "./components/MessageComponent";
import NotificationComponent from "./components/NotificationComponent";
import { isLoggedIn } from "./service/auth.service";
import { UserInfoProvider } from "./components/ContextProvider";
import { ThemeProvider } from "./components/ThemeContext";
import MainLayoutComponent from "./components/MainLayoutComponent";
import EditProfileComponent from "./components/EditProfileComponent";
import ChatConversation from './components/ChatConversation';

export default function App() {
  window.global = window;

  const AuthenticatedRoute = ({ children }) => {
    if (!isLoggedIn()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className="h-screen overflow-hidden">
      <BrowserRouter>
        <ThemeProvider>
          <UserInfoProvider>
            <HeaderComponent />
            
              <Routes>
  {/* Public Routes */}
  <Route path="/login" element={<LoginComponent />} />
  <Route path="/register" element={<RegisterComponent />} />

  {/* Layout Route */}
  <Route element={<MainLayoutComponent />}>
    {/* Protected Routes */}
    <Route
      path="/home"
      element={
        <AuthenticatedRoute>
          <HomeComponent />
        </AuthenticatedRoute>
      }
    />
    <Route
      path="/profile/:username"
      element={
        <AuthenticatedRoute>
          <ProfileComponent />
        </AuthenticatedRoute>
      }
    />
    <Route
      path="/friends"
      element={
        <AuthenticatedRoute>
          <FriendsComponent />
        </AuthenticatedRoute>
      }
                />
     <Route
      path="/chat/:friendId"
      element={
        <AuthenticatedRoute>
          <ChatConversation />
        </AuthenticatedRoute>
      }
    />
    <Route
      path="/messages"
      element={
        <AuthenticatedRoute>
          <MessageComponent />
        </AuthenticatedRoute>
      }
    />
    <Route
      path="/notifications"
      element={
        <AuthenticatedRoute>
          <NotificationComponent />
        </AuthenticatedRoute>
      }
    />
    <Route
      path="/edit-profile/:username"
      element={
        <AuthenticatedRoute>
          <EditProfileComponent />
        </AuthenticatedRoute>
      }
    />

    {/* Redirect root to /home */}
    <Route path="/" element={<Navigate to="/home" />} />
  </Route>
</Routes>

          </UserInfoProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}