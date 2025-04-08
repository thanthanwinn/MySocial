// usePostManagement.tsx
import { useState, useEffect, useCallback } from "react";
import { getPostsforUser, getUserOwnPosts, createPost, addComment, likePost, unlikePost, sharePost, fetchComments } from "../service/user.service";
import { CreatePostDto, getCommentDto, getPostDto, createCommentDto } from '../ds/dto';

export function usePostManagement(userId: number, fetchOwnPosts: boolean = false, initialPage: number = 0) {
  const [posts, setPosts] = useState<getPostDto[]>([]);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [userLikes, setUserLikes] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<{ [key: number]: getCommentDto[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 30;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (fetchOwnPosts) {
        data = await getUserOwnPosts(userId);
        setPosts(data);
        setTotalPages(1); // No pagination for own posts
      } else {
        const response = await getPostsforUser(currentPage, pageSize);
        data = response.content;
        setPosts(data);
        setTotalPages(response.totalPages || 1);
      }
      console.log("Fetched posts:", data); // Debug log

      const initialLikes: { [key: number]: number } = {};
      const initialUserLikes: { [key: number]: boolean } = {};
      const initialComments: { [key: number]: getCommentDto[] } = {};

      // Populate likes, userLikes, and fetch comments for each post
      for (const post of data) {
        initialLikes[post.id] = post.likeCount || 0;
        initialUserLikes[post.id] = post.likedBy?.includes(userId) || false;

        // Fetch comments if not included in the post data
        if (!post.comments || post.comments.length === 0) {
          try {
            const response = await fetchComments(post.id); // Fetch comments for the post
            initialComments[post.id] = response.data || [];
          } catch (err) {
            console.error(`Failed to fetch comments for post ${post.id}:`, err);
            initialComments[post.id] = []; // Default to an empty array if fetching fails
          }
        } else {
          initialComments[post.id] = post.comments;
        }
      }

      setLikes(initialLikes);
      setUserLikes(initialUserLikes);
      setComments(initialComments);
      setNewComment((prev) => ({
        ...prev,
        ...Object.fromEntries(data.map((p) => [p.id, prev[p.id] || ""])),
      }));
    } catch (err) {
      setError("Failed to fetch posts. Please try again.");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchOwnPosts, currentPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (content: string, visibility: string) => {
    setLoading(true);
    setError(null);
    const postDto: CreatePostDto = { content, visibility };
    try {
      const newPost = await createPost(postDto);
      setPosts(prev => [newPost.data, ...prev]);
      setLikes(prev => ({ ...prev, [newPost.data.id]: 0 }));
      setUserLikes(prev => ({ ...prev, [newPost.data.id]: false }));
      setComments(prev => ({ ...prev, [newPost.data.id]: [] }));
      setNewComment(prev => ({ ...prev, [newPost.data.id]: "" }));
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    setError(null);
    try {
      if (userLikes[postId]) {
        await unlikePost(postId);
        setLikes(prev => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
        setUserLikes(prev => ({ ...prev, [postId]: false }));
      } else {
        await likePost(postId);
        setLikes(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
        setUserLikes(prev => ({ ...prev, [postId]: true }));
      }
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, likeCount: likes[postId] + (userLikes[postId] ? -1 : 1) } : p
        )
      );
    } catch (err) {
      setError("Failed to update like status. Please try again.");
      console.error("Error liking/unliking post:", err);
      setLikes(prev => ({ ...prev, [postId]: prev[postId] || 0 }));
      setUserLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
    }
  };

  const handleComment = async (postId: number, content: string) => {
    setLoading(true);
    setError(null);
    const commentDto: createCommentDto = { content, postId };
    try {
      const newComment = await addComment(postId, commentDto);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment.data],
      }));
      setNewComment(prev => ({ ...prev, [postId]: "" }));
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, comments: [...(p.comments || []), newComment.data] } : p
        )
      );
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error("Error adding comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (postId: number, receiverId?: number) => {
    setLoading(true);
    setError(null);
    try {
      await sharePost(postId, receiverId || userId);
      alert("Post shared successfully!");
    } catch (err) {
      setError("Failed to share post. Please try again.");
      console.error("Error sharing post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    posts,
    setPosts,
    likes,
    userLikes,
    comments,
    newComment,
    setNewComment,
    currentPage,
    totalPages, // Fixed typo from 'toatlPages'
    loading,
    error,
    handleCreatePost,
    handleLike,
    handleComment,
    handleShare,
    handlePageChange,
    fetchPosts,
    setComments,
  };
}