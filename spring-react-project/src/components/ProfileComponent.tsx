import  { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { getUserId } from "../service/auth.service";
import { countFollowers, countFollowing, deletePost, getUserInfoByUserName, getUserOwnPosts, fetchFollowing, fetchFollowers } from '../service/user.service';
import PostCardComponent from "./PostCardComponent";
import { usePostManagement } from "../service/usePostManagement";
import { getPostDto, UserInfoDto } from "../ds/dto";
import { fetchFriends, fetchUserFriends } from "../service/relations.service";

export default function ProfileComponent() {
  const { username } = useParams();
  const { isDarkTheme } = useTheme();

  const [profileUserInfo, setProfileUserInfo] = useState<UserInfoDto>();
  const [userPosts, setUserPosts] = useState<getPostDto[]>([]);
  const [friends, setFriends] = useState<UserInfoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
 
  

  const {
    handleLike,
    userLikes,
    likes,
    comments,
    handleComment,
    newComment,
    handleShare,
    setNewComment,
  } = usePostManagement(profileUserInfo?.id ?? 0, true);

  useEffect(() => {
    const fetchFollowingCount = async () => {
      if (profileUserInfo?.id) {
        const count = await countFollowing(profileUserInfo.id);
        setFollowingCount(count.data);
      }
    };
    const fetchFollowersCount = async () => {
      if (profileUserInfo?.id) {
        const count = await countFollowers(profileUserInfo.id);
        setFollowersCount(count.data);
      }
    }
    fetchFollowersCount();
    fetchFollowingCount();
  }, [profileUserInfo?.id]);

  // Fetch friends
    const fetchFriendsList = async () => {
      try {
        const response = await fetchUserFriends(profileUserInfo?.id || 0);
        setFriends(response.data);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

  useEffect(() => {
    const fetchUserInfoByUsername = () => {
      if (!username) return;

      getUserInfoByUserName(username)
        .then((res) => setProfileUserInfo(res.data))
        .catch((err) => console.error("Failed to fetch user info:", err));
    };

    fetchUserInfoByUsername();
  }, [username]);

  

   const handleDeletePost = async (postId: number) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting to delete post with ID:", postId); // Debugging log
      await deletePost(postId); 
      console.log("Post deleted successfully:", postId); // Debugging log
      setUserPosts((prev) => prev.filter((post) => post.id !== postId)); // Update the state
    } catch (err: any) {
      setError("Failed to delete post. Please try again.");
      console.error("Error deleting post:", err.response?.data || err.message); // Debugging log
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!profileUserInfo?.id) return;
    fetchFriendsList();


    const fetchUserPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await getUserOwnPosts(profileUserInfo.id, Number(getUserId() || 0));
        console.log("id" + profileUserInfo.id);
        setUserPosts(posts);
      } catch (err: any) {
        setError(err.message || "Failed to fetch posts");
        console.error("Error fetching user posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [profileUserInfo?.id]);

  if (loading) {
    return (
      <div
        className={`p-4 ${
          isDarkTheme ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
        }`}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 ${
          isDarkTheme ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
        }`}
      >
        Error: {error}
      </div>
    );
  }

  return (
  <div className={`px-4 py-6 min-h-screen ${isDarkTheme ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-800"}`}>
    {/* Profile Header */}
    <div className={`rounded-xl shadow-sm p-4 mb-6 ${isDarkTheme ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex flex-col items-center gap-2">
        <img
          src={profileUserInfo?.img}
          alt="Profile"
          className="rounded-full border object-cover"
          width={100}
          height={100}
        />
        <div className="text-center">
          <h3 className="text-xl font-semibold">{profileUserInfo?.displayName || "Anonymous User"}</h3>
          <p className="text-sm text-gray-400">@{profileUserInfo?.username || "unknown"}</p>
          <p className="text-xs mt-1 italic text-gray-500">{profileUserInfo?.bio || "No bio available."}</p>
        </div>
        <div className="flex gap-6 text-sm mt-3">
          <div className="text-center">
            <p className="font-semibold">{followersCount}</p>
            <p className="text-gray-400">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">{followingCount}</p>
            <p className="text-gray-400">Following</p>
          </div>
        </div>
        {getUserId() && (
          <Link to={`/edit-profile/${username}`} className="mt-3 text-blue-500 text-sm hover:underline">
            Edit Profile
          </Link>
        )}
      </div>
    </div>

    {/* Friends Section */}
    <div className={`rounded-xl shadow-sm p-4 mb-6 ${isDarkTheme ? "bg-gray-900" : "bg-white"}`}>
      <h4 className="text-lg font-medium mb-4">{friends.length} Friends</h4>
      {friends.length === 0 ? (
        <div className="text-center text-sm text-gray-400">
          <p>You don't have any friends yet</p>
          <p className="text-xs mt-1">When you add friends, they'll appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {friends.map((friend) => (
            <Link to={`/profile/${friend.username}`} key={friend.id} className="group rounded-md overflow-hidden bg-opacity-40 hover:shadow-md transition">
              <img src={friend.img} alt="avatar" className="w-full h-28 object-cover rounded-t-md" />
              <div className="p-2 text-center">
                <p className="text-sm font-medium group-hover:underline truncate">{friend.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>

    {/* Posts Section */}
    <div className={`rounded-xl shadow-sm p-4 ${isDarkTheme ? "bg-gray-900" : "bg-white"}`}>
      <h4 className="text-lg font-medium mb-4">Posts</h4>
      {userPosts.length === 0 ? (
        <p className="text-sm italic text-gray-400">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {userPosts.map((post) => (
            <div key={post.id} className={`rounded-lg border ${isDarkTheme ? "border-gray-800 bg-gray-800" : "border-gray-200 bg-gray-50"} p-2 shadow-sm`}>
              <PostCardComponent
                post={post}
                userId={profileUserInfo?.id || 0}
                onLike={() => handleLike(post.id)}
                onDeletePost={() => handleDeletePost(post.id)}
                onComment={(content) => handleComment(post.id, content)}
                onShare={() => handleShare(post.id)}
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
);

}