import  { useEffect, useState } from "react";
import {
  fetchAllUsers,
  fetchFriendRequests,
  fetchFriends,
  sendFriendRequest,
  acceptFriendRequest,
  followUser,
  unfollowUser,
} from "../service/relations.service";
import { useTheme } from "./ThemeContext";
import { Link } from "react-router-dom";
import { UserInfoDto } from "../ds/dto";

export default function FriendsComponent() {
  const { isDarkTheme } = useTheme();

  const [allUsers, setAllUsers] = useState<UserInfoDto[]>([]);
  const [friendRequests, setFriendRequests] = useState<UserInfoDto[]>([]);
  const [friends, setFriends] = useState<UserInfoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("friends");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllUsers();
      setAllUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch friend requests
  const fetchRequests = async () => {
    try {
      const response = await fetchFriendRequests();
      setFriendRequests(response.data);
    } catch (err) {
      console.error("Failed to fetch friend requests:", err);
    }
  };

  // Fetch friends
  const fetchFriendsList = async () => {
    try {
      const response = await fetchFriends();
      setFriends(response.data);
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  };

  // Handle follow/unfollow
  const handleFollow = async (userId: number, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      fetchUsers();
    } catch (err) {
      console.error("Failed to update follow status:", err);
    }
  };

  // Handle friend request actions
  const handleSendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      fetchUsers();
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      await acceptFriendRequest(friendId);
      fetchRequests();
      fetchFriendsList();
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRequests();
    fetchFriendsList();
  }, []);

  return (
    <div className={`w-full ${isDarkTheme ? "bg-gray-100" : "bg-white"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 p-4 ${isDarkTheme ? "bg-gray-800" : "bg-white"} border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
        <h1 className="text-2xl font-bold">Friends</h1>
        
        {/* Tabs */}
        <div className="flex mt-4 space-x-8">
          <button
            onClick={() => setActiveTab("friends")}
            className={`pb-2 font-medium ${activeTab === "friends" ? (isDarkTheme ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-500 border-b-2 border-blue-500") : (isDarkTheme ? "text-gray-400" : "text-gray-600")}`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-2 font-medium ${activeTab === "requests" ? (isDarkTheme ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-500 border-b-2 border-blue-500") : (isDarkTheme ? "text-gray-400" : "text-gray-600")}`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`pb-2 font-medium ${activeTab === "suggestions" ? (isDarkTheme ? "text-blue-400 border-b-2 border-blue-400" : "text-blue-500 border-b-2 border-blue-500") : (isDarkTheme ? "text-gray-400" : "text-gray-600")}`}
          >
            Suggestions
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
        {activeTab === "friends" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{friends.length} Friends</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search friends"
                  className={`pl-8 pr-4 py-2 rounded-full text-sm ${isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                />
                <svg
                  className="w-4 h-4 absolute left-3 top-2.5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {friends.length === 0 ? (
              <div className={`text-center py-10 ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>
                <p className="text-lg">You don't have any friends yet</p>
                <p className="text-sm mt-2">When you add friends, they'll appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className={`rounded-lg overflow-hidden ${isDarkTheme ? "bg-gray-800" : "bg-white"}`}
                  >
                    <Link to={`/profile/${friend.username}`} className="block">
                      <img
                        src={friend.img}
                        alt="avatar"
                        className="w-full h-40 object-cover"
                      />
                    </Link>
                    <div className="p-2">
                      <Link
                        to={`/profile/${friend.username}`}
                        className="font-semibold hover:underline block truncate"
                      >
                        {friend.username}
                      </Link>
                      <button>
                        <p className="text-sm text-gray-500">{friend.displayName}</p>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
            {friendRequests.length === 0 ? (
              <div className={`text-center py-10 ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}>
                <p className="text-lg">No friend requests</p>
                <p className="text-sm mt-2">When you receive requests, they'll appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friendRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`flex items-center p-3 rounded-lg ${isDarkTheme ? "bg-gray-800" : "bg-white"} shadow`}
                  >
                    <Link to={`/profile/${request.username}`} className="flex-shrink-0">
                      <img
                        src={request.img}
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </Link>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            to={`/profile/${request.username}`}
                            className="font-semibold hover:underline"
                          >
                            {request.username}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">2 mutual friends</p>
                        </div>
                        <span className="text-xs text-gray-500">2d</span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
                        >
                          Accept
                        </button>
                        <button
                          className="flex-1 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "suggestions" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className={`text-center py-10 ${isDarkTheme ? "text-red-400" : "text-red-500"}`}>
                {error}
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex space-x-4" style={{ minWidth: `${allUsers.length * 160}px` }}>
                    {allUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex-shrink-0 w-40 rounded-lg overflow-hidden ${isDarkTheme ? "bg-gray-800" : "bg-white"} shadow`}
                      >
                        <Link to={`/profile/${user.username}`} className="block">
                          <img
                            src={user.img ||                   "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
}
                            alt="avatar"
                            className="w-full h-40 object-cover"
                          />
                        </Link>
                        <div className="p-2">
                          <Link
                            to={`/profile/${user.username}`}
                            className="font-semibold hover:underline block truncate"
                          >
                            {user.username}
                          </Link>
                          <div className="flex space-x-1 mt-2">
                            <div >
                              <button className="flex-1 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => handleSendRequest(user.id)}
                            >
                              Add Friend
                              </button>
                              <button className="flex-1 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                              onClick={() => handleFollow(user.id,false)}
                            >
                              Follow
                            </button>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}