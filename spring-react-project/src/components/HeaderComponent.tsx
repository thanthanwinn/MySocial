import { Home, Users, MessageSquare, Bell, Settings, LucideLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserInfo } from "./ContextProvider";
import { useState, useEffect } from "react";
import { UserInfoDto } from "../ds/dto";
import { getLoggedInUserName, logoutUser } from "../service/auth.service";
import { useTheme } from "./ThemeContext";
import { fetchUnreadNotifications, markNotificationAsRead } from "../service/user.service";

export default function HeaderComponent() {
  const { isDarkTheme, toggleTheme } = useTheme();
  const { userInfo } = useUserInfo();
  const [currentUser, setCurrentUser] = useState<UserInfoDto | null>(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch unread notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetchUnreadNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  // Mark a notification as read
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Set the current user from the userInfo context
  useEffect(() => {
    if (userInfo) setCurrentUser(userInfo);
  }, [userInfo]);

  const handleLogout = () => {
    logoutUser();
    window.location.reload(); // Reload the page to clear user state
  };

  return (
    <div
      className={`navbar px-4 border-b ${
        isDarkTheme
          ? "bg-gray-900 text-white border-gray-800"
          : "bg-sky-100 text-gray-900 border-sky-200"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center">
        <Link
          to="/"
          className={`text-xl font-semibold px-2 py-1 rounded ${
            isDarkTheme ? "hover:text-sky-300" : "hover:bg-sky-100 hover:text-sky-600"
          }`}
        >
          MySocial
        </Link>
      </div>

      {/* Navigation Buttons */}
      <div className="flex-1 flex justify-center gap-4">
        <Link
          to="/home"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDarkTheme
              ? "hover:text-sky-300"
              : "hover:bg-sky-100 hover:text-sky-600"
          }`}
        >
          <Home size={20} /> Home
        </Link>
        <Link
          to="/friends"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDarkTheme
              ? "hover:text-sky-300"
              : "hover:bg-sky-100 hover:text-sky-600"
          }`}
        >
          <Users size={20} /> Friends
        </Link>
        <Link
          to="/messages"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDarkTheme
              ? "hover:text-sky-300"
              : "hover:bg-sky-100 hover:text-sky-600"
          }`}
        >
          <MessageSquare size={20} /> Messages
        </Link>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDarkTheme
              ? "hover:text-sky-300"
              : "hover:bg-sky-100 hover:text-sky-600"
          }`}
        >
          <Bell size={20} /> Notifications
          {notifications.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2">
              {notifications.length}
            </span>
          )}
        </button>
        <Link
          to="/settings"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            isDarkTheme
              ? "hover:text-sky-300"
              : "hover:bg-sky-100 hover:text-sky-600"
          }`}
        >
          <Settings size={20} /> Options
        </Link>
      </div>

      {/* Search and Avatar */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search MySocial"
          className={`input input-bordered w-24 md:w-36 lg:w-64 rounded-md ${
            isDarkTheme
              ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-500"
              : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400"
          }`}
        />

        {/* Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className={`btn btn-ghost btn-circle avatar ${
              isDarkTheme ? "hover:text-sky-300" : "hover:bg-sky-100 hover:text-sky-600"
            }`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shadow">
              <img
                alt="User avatar"
                src={
                  currentUser?.img ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                onError={(e) => {
                  e.currentTarget.src =
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content mt-3 p-2 shadow-lg rounded-box ${
              isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <li>
              <Link
                to={`/profile/${getLoggedInUserName()}`}
                className={`rounded-md ${
                  isDarkTheme ? "hover:text-sky-300" : "hover:bg-sky-100 hover:text-sky-600"
                }`}
              >
                <LucideLink size={18} /> Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className={`rounded-md ${
                  isDarkTheme ? "hover:text-sky-300" : "hover:bg-sky-100 hover:text-sky-600"
                }`}
              >
                Logout
              </button>
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className={`w-full p-2 rounded-md flex items-center justify-center ${
                  isDarkTheme ? "hover:text-sky-300" : "hover:bg-sky-100 hover:text-sky-600"
                }`}
              >
                {isDarkTheme ? "Light Theme" : "Dark Theme"}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showDropdown && (
        <div
          className={`absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg ${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-2 border-b hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{notification.message}</span>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Mark as read
                </button>
              </li>
            ))}
          </ul>
          {notifications.length === 0 && (
            <p className="p-2 text-center text-gray-500">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
}
