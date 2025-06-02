import React, { useEffect } from "react";
import PostListComponent from "./PostListComponent";
import { useTheme } from "./ThemeContext";
import { useUserInfo } from "./ContextProvider";
import { getUserInfo } from "../service/user.service";
import { Outlet } from "react-router-dom";

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
    <div className={` m-0  ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}  scroll-hidden h-full `}>      {/* Left Sidebar - ToDoList */}
      
      <div className={`w-full h-full overflow-y-auto p-2 scrollbar-hide`}>
        <PostListComponent />
      </div>
      <Outlet/>
      
    </div>
  );
}
