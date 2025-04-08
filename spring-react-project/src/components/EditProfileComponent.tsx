import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateProfileUserInfo } from "../service/user.service";
import { useUserInfo } from "./ContextProvider";
import { useTheme } from "./ThemeContext";

export default function EditProfileComponent() {
  const predefinedImages = [
    "/profile-images/preview.webp",
    "/profile-images/preview1.webp",
    "/profile-images/preview2.webp",
    "/profile-images/preview3.webp",
    "/profile-images/preview4.webp",
    "/profile-images/preview5.webp",
    "/profile-images/preview6.webp",
    "/profile-images/preview7.webp",
    "/profile-images/preview8.webp",
    "/profile-images/preview9.webp",
    "/profile-images/preview10.webp",
    "/profile-images/preview11.webp",
    "/profile-images/preview12.webp",
    "/profile-images/preview13.webp",
  ];

  const { userInfo, setUserInfo } = useUserInfo();
  const navigate = useNavigate();
  const { isDarkTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [img, setImg] = useState("");
  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username || "");
      setDisplayName(userInfo.displayName || "");
      setBio(userInfo.bio || "");
      setImg(userInfo.img || "");
    }
  }, [userInfo]);

  const handleImageSelect = (selectedImg: string) => {
    setImg(selectedImg);
    setOpenImageModal(false);
  };

  const updateUserProfile = async (e: React.FormEvent) => {
    if (!username) {
      return;
    }
    e.preventDefault();

    if (!username) {
      alert("Username is required");
      return;
    }

    const updateUserDto = {
      username,
      displayName,
      bio,
      img,
    };

    try {
      const response = await updateProfileUserInfo(updateUserDto);
      const updatedUserInfo = await getUserInfo(userInfo?.id || 0);
      setUserInfo(updatedUserInfo.data);

      navigate(`/profile/${username}`);
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-lg mx-auto rounded-xl shadow-lg overflow-hidden ${
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
            
            <form onSubmit={updateUserProfile} className="space-y-5">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="mb-5 text-center">
                  <label className="block text-sm font-medium mb-2">Profile Picture</label>
                  <div className="flex flex-col items-center">
                    <img
                      src={img || "/default-avatar.webp"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-2 mb-3"
                    />
                    <button
                      type="button"
                      onClick={() => setOpenImageModal(true)}
                      className={`text-sm px-4 py-1.5 rounded-md ${
                        isDarkTheme
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } transition`}
                    >
                      Choose Image
                    </button>
                  </div>
                </div>

                {/* Username */}
                <div className="w-full mb-4">
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    maxLength={20}
                    className={`w-full px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 ${
                      isDarkTheme
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-400"
                    } border`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Display Name */}
                <div className="w-full mb-4">
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    maxLength={20}
                    className={`w-full px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 ${
                      isDarkTheme
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-400"
                    } border`}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>

                {/* Bio */}
                <div className="w-full mb-6">
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    rows={3}
                    maxLength={200}
                    className={`w-full px-4 py-2 text-sm rounded-md resize-none focus:outline-none focus:ring-2 ${
                      isDarkTheme
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-400"
                    } border`}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Submit Button */}
                <div className="w-full">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Image Selection Modal */}
      {openImageModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isDarkTheme ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"
          }`}
        >
          <div
            className={`max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-xl relative ${
              isDarkTheme ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <button
              onClick={() => setOpenImageModal(false)}
              className="absolute top-4 right-4 text-xl font-bold hover:text-gray-400 transition"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">Select a Profile Image</h3>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {predefinedImages.map((image) => (
                <div key={image} className="flex flex-col items-center">
                  <img
                    src={image}
                    alt="Option"
                    className={`w-40 h-40 rounded-full cursor-pointer border-2 p-1 hover:scale-105 transition ${
                      img === image
                        ? isDarkTheme
                          ? "border-blue-400"
                          : "border-blue-600"
                        : "border-transparent"
                    }`}
                    onClick={() => handleImageSelect(image)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}