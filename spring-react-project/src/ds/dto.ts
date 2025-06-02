
export type UserInfoDto = {
    id: number,
    username: string,
    displayName: string,
    img: string, 
    bio: string,
    followers?: number,
    following?: number
}
export type UpdateUserInfoDto = {
    username: string,
    displayName: string,
    img: string, 
    bio: string,
    followers?: number,
    following?: number
}
export type GetPostsDto = {
    page: number,
    size: number
}

export type CreatePostDto = {
    content: string,
    visibility: string
}
export type getCommentDto = {
    id: number,
    content: string,
    createdAt: string,
    postId: number,
    authorId: number,
    authorDisplayName:string,
    authorName: string,
    img: string
}
export type getPostDto = {
    id: number;
  authorName: string;
  authorDisplayName: string;
  authorId: number;
    content: string;
    img: string;
  createdAt: string;
  visibility: string;
  likeCount: number; // Ensure this exists
  likedBy: number[];
  commentCount: number;  // Array of user IDs who liked the post
  comments: getCommentDto[];
  likedByUser: boolean;
  totalPages: number;
}
export type createCommentDto ={
    content: string,
    postId: number
}

export type LoginDto = {
    username: string,
    password: string
}

export type RegisterDto = {
    username: string,
    password: string,
    email: string
}

export type NotificationDto = {
    id:number,
    senderId:number,
    receiverId:number,
    type:string,
    message:string,
    isRead:boolean,
    createdAt:string
}

export type TodoDto = {
    id?: number,
    title: string,
    dueTime: string,
    completed: boolean,
    userId?: number
}

export interface UserInfoContextType {
  userInfo: UserInfoDto | null;
  setUserInfo: (userInfo: UserInfoDto | null) => void;
}
