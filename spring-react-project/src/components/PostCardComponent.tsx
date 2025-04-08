// PostCardComponent.tsx
import React, { useEffect, useState } from "react";
import { getCommentDto, getPostDto } from "../ds/dto";
import { fetchComments } from "../service/user.service";
import { useTheme } from "./ThemeContext";
import { FaGlobe, FaLock, FaUserFriends } from "react-icons/fa";

interface PostCardProps {
  post: getPostDto;
  userId: number;
  onLike: () => Promise<void>;
  onComment: (content: string) => Promise<void>;
  onShare: () => Promise<void>;
  likesCount: number;
  userLiked: boolean;
  comments: getCommentDto[];
  onNewCommentChange: (postId: number, newComment: string) => void;
  newComment: string;
  loading?: boolean; // Added as optional prop
  error?: string | null; // Added as optional prop
}

export default function PostCardComponent({
  post,
  userId,
  onLike,
  onComment,
  onShare,
  likesCount,
  userLiked,
  comments: propComments,
  onNewCommentChange,
  newComment: propNewComment,
  loading = false,
  error = null,
}: PostCardProps) {
  const { isDarkTheme } = useTheme();
  const [commentDropdownOpen, setCommentDropdownOpen] = useState(false);

  const isAuthor = userId === post.authorId;
  const canInteract = isAuthor || post.visibility === "PUBLIC" || (post.visibility === "FRIENDS" && /* friendship check */ true);

  useEffect(() => {
    const fetchCommentsForPost = async () => {
      try {
        const response = await fetchComments(post.id);
        const fetchedComments = response.data || [];
        // No need to setComments here since parent manages comments
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };
    fetchCommentsForPost();
  }, [post.id]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (propNewComment?.trim()) {
      onComment(propNewComment);
    }
  };

  
  if (loading) return <div className={`p-4 ${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>Loading...</div>;
  if (error) return <div className={`p-4 ${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`}>Error: {error}</div>;
  return (
    <div className={`card ${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-xl shadow-lg p-0 m-0 mb-6 transition-all duration-300 hover:shadow-xl`}>
      <div className="card-body m-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="avatar">
            <div className={`w-12 h-12 rounded-full ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              <img src={post.img} alt="Avatar" />
            </div>
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div className="flex flex-col justify-start gap-2">
              <h3 className={`font-semibold text-lg ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {post.authorDisplayName ? post.authorDisplayName : post.authorName}
              </h3>
              <div className="flex items-center gap-4">
                {post.visibility === 'PUBLIC' && (
                  <div className="flex items-center gap-1">
                    <FaGlobe className={`w-4 h-4 ${isDarkTheme ? 'text-blue-400' : 'text-blue-300'}`} />
                    <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Public</span>
                  </div>
                )}
                {post.visibility === 'FRIENDS' && (
                  <div className="flex items-center gap-1">
                    <FaUserFriends className={`w-4 h-4 ${isDarkTheme ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Friends</span>
                  </div>
                )}
                {post.visibility === 'PRIVATE' && (
                  <div className="flex items-center gap-1">
                    <FaLock className={`w-4 h-4 ${isDarkTheme ? 'text-blue-400' : 'text-blue-500'}`} />
                    <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Private</span>
                  </div>
                )}
              </div>
            </div>
            <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(post.createdAt).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
              })}
            </span>
          </div>
        </div>

        <p className={`text-xl ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{post.content}</p>

        <div className={`flex justify-between text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} mb-0 mx-justify-end`}>
          <span>{likesCount || 0} Likes</span>
          <span>{propComments.length} Comments</span>
          <span>0 Shares</span>
        </div>

        <div className="flex gap-4 justify-between mt-0">
          <button
            className={`flex items-center gap-2 text-xs rounded-full py-1 px-2 transition-all duration-200 ${
              userLiked 
                ? "bg-blue-500 text-white" 
                : `${isDarkTheme ? 'bg-gray-700 text-blue-300' : 'bg-sky-100 text-blue-400'}`
            }`}
            onClick={onLike}
            disabled={!canInteract}
            aria-label="Like or unlike this post"
          >
            <svg className="w-5 h-5" fill={userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            {userLiked ? "liked" : "like"}
          </button>

          <button
            className={`flex items-center gap-2 text-xs rounded-full py-1 px-3 ${
              isDarkTheme ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' : 'bg-sky-100 text-blue-400 hover:bg-blue-200'
            } transition-all duration-200`}
            onClick={() => setCommentDropdownOpen(!commentDropdownOpen)}
            disabled={!canInteract}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comment
          </button>

          <button
            className={`flex items-center gap-2 text-xs rounded-full py-1 px-3 ${
              isDarkTheme ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' : 'bg-sky-100 text-blue-400 hover:bg-indigo-200'
            } transition-all duration-200`}
            onClick={onShare}
            disabled={!canInteract}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>

        {commentDropdownOpen && (
          <div className={`mt-4 p-4 rounded-xl ${isDarkTheme ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
            <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-4">
              <input
                type="text"
                className={`input input-sm outline outline-blue-500 input-bordered flex-1 rounded-xl focus:ring-2 focus:ring-primary ${
                  isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                }`}
                placeholder="Write a comment..."
                value={propNewComment}
                onChange={(e) => onNewCommentChange(post.id, e.target.value)}
                disabled={!canInteract}
              />
              <button 
                type="submit" 
                className="btn btn-sm btn-primary rounded-xl"
                disabled={!canInteract}
              >
                Post
              </button>
            </form>

            <ul className="space-y-3">
              {propComments.map((comment: getCommentDto, index) => (
                <li key={index} className={`flex items-start gap-4 p-3 ${
                  isDarkTheme ? 'bg-gray-600' : 'bg-white'
                } rounded-xl shadow-lg`}>
                  <div className={`w-10 h-10 rounded-full ${
                    isDarkTheme ? 'bg-gray-500' : 'bg-gray-300'
                  } flex items-center justify-center ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <img src={comment.img} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-sm ${
                        isDarkTheme ? 'text-white' : 'text-gray-800'
                      }`}>
                        {comment.authorDisplayName ? comment.authorDisplayName : comment.authorName}
                      </span>
                      <span className={`text-xs ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs ${
                      isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {comment.content}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}