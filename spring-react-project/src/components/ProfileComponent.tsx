/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserInfo } from "./ContextProvider";
import { useTheme } from "./ThemeContext";
import { getLoggedInUserName, getUserId } from "../service/auth.service";
import { getUserInfoByUserName, getUserOwnPosts } from "../service/user.service";
import PostCardComponent from "./PostCardComponent";
import { usePostManagement } from '../service/usePostManagement';
import { getPostDto, UserInfoDto } from "../ds/dto";

export default function ProfileComponent() {
  const { username } = useParams();
  const { isDarkTheme } = useTheme();
  const { userInfo } = useUserInfo();
  const [profileUserInfo,setProfileUserInfo] = useState<UserInfoDto>();
  const [userPosts, setUserPosts] = useState<getPostDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    handleLike, 
    userLikes, 
    likes, 
    comments,
    handleComment, 
    newComment, 
    handleShare, 
    setNewComment 
  } = usePostManagement(profileUserInfo?.id || 0, true); // fetchOwnPosts = true

  useEffect(() => {
    const fetchUserInfoByUsernamee = () => {
      if (username) {
        getUserInfoByUserName(username)
          .then((res) => {
            setProfileUserInfo(res.data);
          })
          .catch((err) => console.error("Failed to fetch user info:", err));
      }
    };
    if (username) {
      fetchUserInfoByUsernamee();

    }
  },[username]);
    useEffect(() => {
  console.log("Updated user posts:", userPosts);
}, [userPosts]);  
  

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!profileUserInfo?.id) return;
      setLoading(true);
    
      setError(null);
      try {
        const posts = await getUserOwnPosts(profileUserInfo?.id ||0);
        console.log("User Posts:", posts);
        setUserPosts(posts);
        console.log("after setting user posts" + userPosts);
      } catch (err: any) {
        setError(err.message || "Failed to fetch posts");
        console.error("Error fetching user posts:", err);
      } finally {
        setLoading(false);
      }
    };
    if (profileUserInfo?.id) {
      fetchUserPosts();
    }
  }, [profileUserInfo?.id]);

  

  if (loading) {
    return <div className={`p-4 ${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`p-4 ${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>Error: {error}</div>;
  }

 return (
// Update the main div classes to:
<div className={`flex gap-8 px-6 mt-6 ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>    {/* Left Column: Profile Details */}
    <div className="w-full max-w-lg mt-6 sticky top-6 self-start">
      <div className={`rounded-2xl shadow-md p-6 ${isDarkTheme ? 'bg-gray-600' : 'bg-white'}`}>
        <div className="flex flex-col items-center text-center">
          <img
            src={profileUserInfo?.img}
            alt="Profile"
            className="rounded-full border-4 border-gray-300 object-cover mb-4"
            width="120"
            height="120"
          />
          <h3 className="text-2xl  mb-2 font-bold">{profileUserInfo?.displayName || "Anonymous User"}</h3>
          <p className="text-sm text-gray-400">@{profileUserInfo?.username || "unknown"}</p>
          <p className="mt-5 text-sm">{profileUserInfo?.bio || "This user hasn't added a bio yet."}</p>

          {/* Followers / Following */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div>
              <span className="font-semibold text-lg">{profileUserInfo?.followers ?? 0}</span>
              <p className="text-gray-500">Followers</p>
            </div>
            <div>
              <span className="font-semibold text-lg">{profileUserInfo?.following ?? 0}</span>
              <p className="text-gray-500">Following</p>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="mt-10">
            {getUserId() ? (
              <Link
                to={`/edit-profile/${username}`}
                className="text-blue-500 hover:underline text-sm"
              >
                Edit Profile
              </Link>
            ) : (
              <span className="text-sm text-gray-400">Loading...</span>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Right Column: Scrollable Posts */}
    <div className="flex-1  max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
      <div className={`rounded-2xl p-4 shadow-md }`}>
        <h5 className="text-xl font-semibold mb-4">Posts</h5>
        {userPosts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-6 mb-6 mr-10">
            {userPosts.map((post) => (
              <div key={post.id} className="rounded-xl border border-gray-200  shadow-sm">
                <PostCardComponent
                  post={post}
                  userId={profileUserInfo?.id || 0}
                  onLike={async () => await handleLike(post.id)}
                  onComment={async (content) => await handleComment(post.id, content)}
                  onShare={async () => await handleShare(post.id)}
                  likesCount={likes[post.id] || post.likeCount || 0}
                  userLiked={userLikes[post.id] || false}
                  comments={comments[post.id] || post.comments || []}
                  onNewCommentChange={(postId, value) =>
                    setNewComment((prev) => ({ ...prev, [postId]: value }))
                  }
                  newComment={newComment[post.id] || ""}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

}