import React from "react";
import { useTheme } from "./ThemeContext";

export default function WeatherComponent() {
  const { isDarkTheme } = useTheme();

   return (
   // Update the main div classes to:
<div className={`${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded-lg p-4`}>
      <div className="card shadow-md p-4 mb-4">
        <h2 className="text-xl font-bold mb-4">Weather</h2>
        <div className="text-center">
          <p className="text-4xl">28°C</p>
          <p className="text-sm text-gray-500">Sunny</p>
        </div>
      </div>
    </div>
  );
}
