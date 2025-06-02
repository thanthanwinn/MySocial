import React from "react";
import { useTheme } from "./ThemeContext";
import TodoListComponent from "./TodoListComponent";
import WeatherComponent from "./WeatherComponent";
import { Outlet } from "react-router-dom"; // ✅ Add this import

export default function MainLayoutComponent() {
  const { isDarkTheme } = useTheme();

  return (
    <div
      className={`flex ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } h-full overflow-hidden`}
    >
      {/* Left Sidebar - Todo List */}
      <div className="w-2/7  h-full overflow-y-scroll scrollbar-hide">
        <TodoListComponent />
      </div>

      {/* Center Content */}
      <div className=" w-3/7  p-2  h-full overflow-y-scroll scrollbar-hide">
        <Outlet /> {/* ✅ This is where the nested route renders */}
      </div>

      {/* Right Sidebar - Weather */}
      <div className="w-2/7 p-2  h-full overflow-y-scroll scrollbar-hide">
        <WeatherComponent />
      </div>
    </div>
  );
}
