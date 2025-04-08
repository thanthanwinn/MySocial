import React, { useEffect } from "react";
import ToDoListComponent from "./TodoListComponent";
import PostListComponent from "./PostListComponent";
import WeatherComponent from "./WeatherComponent";
import { useTheme } from "./ThemeContext";
import { useUserInfo } from "./ContextProvider";
import { getUserInfo } from "../service/user.service";

export default function HomeComponent() {
  const { userInfo, setUserInfo } = useUserInfo();
  const { isDarkTheme } = useTheme();

  const handleUserinfo= () => {
    getUserInfo(parseInt(localStorage.getItem("loginUserId") || "0"))
    .then(
      (res) => {
        console.log("UserInfo fetched:", res.data); // 
        const userInfomation = res.data;
        setUserInfo(userInfomation)
        console.log("UserInfo:", userInfo);
      })
       
      
    .catch (e => console.log(e));
  }
  useEffect(() => {
    handleUserinfo();
  }, [])
  useEffect(() => {
    console.log("UserInfo real data:", userInfo);
  },[userInfo])


  return (
// Update the main div classes to:
<div className={`flex ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} h-screen`}>      {/* Left Sidebar - ToDoList */}
      <div className="w-4/16 h-full p-2">
        <div className="sticky top-2">
          <ToDoListComponent />
        </div>
      </div>

      {/* Center Scrollable Feed - PostList */}
      <div className="flex-1 h-full overflow-y-auto p-2 scrollbar-hide scroll-hidden">
        <PostListComponent />
      </div>

      {/* Right Sidebar - Weather */}
      <div className="w-4/16 h-full p-2">
        <div className="sticky top-2">
          <WeatherComponent />
        </div>
      </div>
    </div>
  );
}
