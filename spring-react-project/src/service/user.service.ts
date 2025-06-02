
// user.service.ts
import axios from "axios";
import { UserInfoDto, CreatePostDto, createCommentDto, MessageDto, CreateMessageDto, NotificationDto, UpdateUserInfoDto, GetPostsDto, getPostDto } from '../ds/dto';
import { getToken, getUserId } from "./auth.service";

export const USER_URL = "http://localhost:8080/api/users";
export const RELATIONS_URL = "http://localhost:8080/api/relations";
export const POSTS_URL = "http://localhost:8080/api/posts";
export const MESSAGES_URL = "http://localhost:8080/api/messages";
export const NOTIFICATIONS_URL = "http://localhost:8080/api/notifications";

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    const userId = getUserId();
    if (userId) {
      config.headers["X-User-Id"] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getUserInfo = (userId:number) => {
  return axios.get<UserInfoDto>(`${USER_URL}/id/${userId}`);
}
export const getUserInfoByUserName = (username:string) => {
  return axios.get<UserInfoDto>(`${USER_URL}/username/${username}`);
}

export const updateProfileUserInfo = (updateUserDto: UpdateUserInfoDto) => {
  console.log("updateuserdto in service", updateUserDto);

  const params = new URLSearchParams();
  if (updateUserDto.username) params.append("username", updateUserDto.username);
  if (updateUserDto.bio) params.append("bio", updateUserDto.bio);
  if (updateUserDto.displayName) params.append("displayName", updateUserDto.displayName);
  if (updateUserDto.img) params.append("img", updateUserDto.img);

  return axios.put(`${USER_URL}/update`, null, {
    params,
    
  });
}; 
  
  



export const followUser = (friendId: number) => axios.post(`${RELATIONS_URL}/follow/${friendId}`);

export const fetchFollowers = (id:number) => axios.get(`${RELATIONS_URL}/followers/${id}`);

export const fetchFollowing = (id: number) => axios.get(`${RELATIONS_URL}/following/${id}`);
export const countFollowers = (id: number) => axios.get(`${RELATIONS_URL}/count-followers/${id}`);
export const countFollowing = (id: number) => axios.get(`${RELATIONS_URL}/count-followings/${id}`);
// Posts
export const createPost = (postDto: CreatePostDto) => axios.post(`${POSTS_URL}/create`, postDto);
export const editPost = (postDto: CreatePostDto, postId: number) => axios.put(`${POSTS_URL}/edit-post/${postId}`, postDto)

export const getPostsforUser = async (page : number, pageSize : number) => {
  try {
    const response = await axios.get(`${POSTS_URL}?page=${page}&size=${pageSize}`);
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { content: [], totalPages: 1 };
  }
  
};
export const getUserOwnPosts = async (userId: number,viewerId:number): Promise<getPostDto[]> => {
  try {
    const response = await axios.get(`${POSTS_URL}/user-posts/${userId}/${viewerId}`, {
      
    });
    return response.data;
  } catch (error) {
    console.error("Error with getting posts:", error);
    throw error;
  }
};


// Comments
export const addComment = (postId: number, commentDto: CreateCommentDto) => 
  axios.post(`${POSTS_URL}/${postId}/comments`, commentDto);

export const editComment = (commentDto: CreateCommentDto, commentId: number) =>
  axios.put(`${POSTS_URL}/edit-comment/${commentId}`, commentDto);

export const fetchComments = (postId: number) => axios.get(`${POSTS_URL}/${postId}/comments`);

//posts utils
// Add to user.service.ts

export const likePost = (postId: number) => axios.post(`${POSTS_URL}/${postId}/like`);
export const unlikePost = (postId: number) => axios.post(`${POSTS_URL}/${postId}/unlike`);
export const sharePost = (postId: number, receiverId: number) => axios.post(`${POSTS_URL}/${postId}/share`, { receiverId });
export const deletePost = (postId: number) => axios.delete(`${POSTS_URL}/delete-post/${postId}`);
export const deleteComment = (commentId : number) => axios.delete(`${POSTS_URL}/delete-comment/${commentId}`);
export const updatePostVisibility = (postId: number, visibility: string) => axios.put(`${POSTS_URL}/${postId}/visibility`, { visibility });
export const getPostLikes = (postId: number) => axios.get(`${POSTS_URL}/${postId}/likes`);


// Notifications
// Fetch all notifications
export const fetchNotifications = () => axios.get(`${NOTIFICATIONS_URL}`);

//clear notifications count
export const clearNotifications = () => axios.get(`${NOTIFICATIONS_URL}/clear/${parseInt(getUserId() as string)}`);
// Mark a notification as read
export const markNotificationAsRead = (notificationId: number) =>
  axios.put(`${NOTIFICATIONS_URL}/${notificationId}/read`);

export const getNotificationCount = () => axios.get(`${NOTIFICATIONS_URL}/count`)