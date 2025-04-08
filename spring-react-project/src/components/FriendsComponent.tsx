import React, { useEffect, useState } from "react";
import {
  fetchAllUsers,
  fetchFriendRequests,
  fetchFriends,
  sendFriendRequest,
  acceptFriendRequest,
  followUser,
  unfollowUser,
  blockUser,
} from "../service/relations.service";
import { useTheme } from "./ThemeContext";
import { useUserInfo } from "./ContextProvider";
import { Link } from "react-router-dom";

export default function FriendsComponent() {
  const { isDarkTheme } = useTheme();
  const { userInfo } = useUserInfo();

  const [allUsers, setAllUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Failed to update follow status:", err);
    }
  };

  // Handle friend request actions
  const handleSendRequest = async (userId: number) => {
    try {
      await sendFriendRequest(userId);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const handleAcceptRequest = async (userId: number) => {
    try {
      await acceptFriendRequest(userId);
      fetchRequests(); // Refresh friend requests
      fetchFriendsList(); // Refresh friends list
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      await blockUser(userId);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Failed to block user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRequests();
    fetchFriendsList();
  }, []);

  return (
    <div
      className={`container mx-auto p-4 ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Friends</h2>

      {/* Friend Requests */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
        {friendRequests.length === 0 ? (
          <p className="text-gray-500">No friend requests.</p>
        ) : (
          <ul className="space-y-4">
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="flex items-center justify-between p-3 rounded-lg shadow-md"
              >
                <span>{request.username}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleBlockUser(request.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Block
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Friends List */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Friends</h3>
        {friends.length === 0 ? (
          <p className="text-gray-500">No friends yet.</p>
        ) : (
          <ul className="space-y-4">
  {friends.map((friend) => (
    <li
      key={friend.id}
      className="flex items-center justify-between p-3 rounded-lg shadow-md"
    >
      <Link
        to={`/profile/${friend.username}`}
        className="text-blue-500 hover:underline"
      >
        {friend.username}
      </Link>
      <button
        onClick={() => handleBlockUser(friend.id)}
        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Block
      </button>
    </li>
  ))}
</ul>
        )}
      </section>

      {/* All Users */}
      <section>
        <h3 className="text-lg font-semibold mb-2">All Users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-4">
            {allUsers.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg shadow-md"
              >
                <span>{user.username}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFollow(user.id, user.isFollowing)}
                    className={`px-3 py-1 rounded-md ${
                      user.isFollowing
                        ? "bg-gray-500 text-white hover:bg-gray-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {user.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Friend
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
