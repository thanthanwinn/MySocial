import axios from "axios";
import { USER_URL } from "./user.service";

export const RELATIONS_URL = "http://localhost:8080/api/relations";

// Fetch all users
export const fetchAllUsers = () => axios.get(`${USER_URL}/user-no-relations`);

// Fetch friend requests
export const fetchFriendRequests = () => {
 return  axios.get(`${RELATIONS_URL}/friends-requests`);
}

// Fetch friends
export const fetchUserFriends = (id: number) => {
  return axios.get(`${RELATIONS_URL}/friends/${id}`);
  
}
export const fetchFriends = () => {
  return axios.get(`${RELATIONS_URL}/friends`);
  
}


// Send a friend request
export const sendFriendRequest = (userId: number) =>
  axios.post(`${RELATIONS_URL}/request/${userId}`);

// Accept a friend request
export const acceptFriendRequest = (userId: number) =>
  axios.put(`${RELATIONS_URL}/accept/${userId}`);

// Follow a user
export const followUser = (userId: number) =>
  axios.post(`${RELATIONS_URL}/follow/${userId}`);

// Unfollow a user
export const unfollowUser = (userId: number) =>
  axios.post(`${RELATIONS_URL}/unfollow/${userId}`);

// Block a user
export const blockUser = (userId: number) =>
  axios.post(`${RELATIONS_URL}/block/${userId}`);

