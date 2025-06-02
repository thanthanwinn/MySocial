// PostListComponent.tsx
import React from "react";
import { useUserInfo } from "./ContextProvider";
import { usePostManagement } from "../service/usePostManagement";
import PostCardComponent from "./PostCardComponent";
import Pagination from "./PaginationComponent";
import { useTheme } from "./ThemeContext";

export default function PostListComponent() {
  const { isDarkTheme } = useTheme();
  const { userInfo } = useUserInfo();
  const [newPost, setNewPost] = React.useState("");
  const [visibility, setVisibility] = React.useState("PUBLIC");

  const {
    posts,
    likes,
    userLikes,
    comments,
    newComment,
    setNewComment,
    currentPage,
    totalPages,
    loading,
    error,
    handleCreatePost,
    handleLike,
    handleDeletePost,
    handleComment,
    handleShare,
    handlePageChange,
  } = usePostManagement(userInfo?.id || 0, false); // fetchOwnPosts = false

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    handleCreatePost(newPost, visibility);
    setNewPost("");
    setVisibility("PUBLIC");
  };

  return (
// Update the main div classes to:
<div className={` max-w-md mx-auto p-2 scroll-hidden  ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-md space-y-6`}>      {/* Create Post Section */}
      <section className={`rounded-lg border ${isDarkTheme ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-[#e2e8f0]'} p-4 shadow-sm`}>
        <header className="mb-3">
          <h2 className="text-md font-semibold">Create New Post</h2>
        </header>
        <form onSubmit={handleSubmitPost} className="space-y-4">
          <textarea
            className={`w-full resize-none p-3 rounded-md border text-sm focus:outline-none focus:ring-2 transition ${isDarkTheme ? 'bg-[#0d1117] text-white border-[#30363d] focus:ring-[#58a6ff]' : 'bg-[#f9fafb] text-gray-800 border-[#d1d5db] focus:ring-blue-400'}`}
            placeholder="Write something awesome..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={4}
          />
          <div className="flex items-center gap-3">
            <select
              className={`w-1/2 rounded-md border p-2 text-sm ${isDarkTheme ? 'bg-[#0d1117] text-white border-[#30363d]' : 'bg-white text-gray-800 border-[#d1d5db]'}`}
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="PUBLIC">Public</option>
              <option value="FRIENDS">Friends</option>
              <option value="PRIVATE">Private</option>
            </select>
            <button
              className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-md transition disabled:opacity-50"
              type="submit"
              disabled={loading || !newPost.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner"></span> Posting...
                </div>
              ) : "Post"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </section>

      {/* Posts Section */}
      <section className="space-y-5">
        {loading && !posts.length ? (
          <p className="text-center text-sm text-gray-400">Loading posts...</p>
        ) : posts.length ? (
          posts.map(post => (
            <PostCardComponent
              key={post.id}
              userId={userInfo?.id || 0}
              post={post}
              onLike={async () => await handleLike(post.id)}
              onComment={async (content) => await handleComment(post.id, content)}
              onShare={async () => await handleShare(post.id)}
              onDeletePost={async () => await handleDeletePost(post.id)}
              likesCount={likes[post.id] || 0}
              userLiked={userLikes[post.id] || false}
              comments={comments[post.id] || []}
              onNewCommentChange={(postId, value) => setNewComment(prev => ({ ...prev, [postId]: value }))}
              newComment={newComment[post.id] || ""}
              loading={loading} // Pass loading state
              error={error}     // Pass error state
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-400">No posts available.</p>
        )}
      </section>

      {/* Pagination */}
      <div className="pt-4">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}